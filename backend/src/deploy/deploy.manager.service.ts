import { GitService } from "../services/git.service.js";
import { DockerService } from "../services/docker.service.js";
import { RobleDBService } from "../db/roble.db.service.js";
import {
  BadRequestException,
  ConflictException,
} from "../shared/exceptions/http.exception.js";
import { ReverseProxyService } from "../services/reverseProxy.service.js";
import { appConfig } from "../shared/config/config.js";
import type { CreateDeployDto } from "./dto/create-deploy.dto.js";
import type { IUser } from "../auth/auth.types.js";
import type { DeployRollbackService } from "./deploy-rollback.service.js";
import type { SqliteDBService } from "../db/sqlite.db.service.js";
import { normalizeUserName } from "./util/normalizeUserName.util.js";

export class DeployManagerService {
  constructor(
    private readonly robleDBService: RobleDBService,
    private readonly sqliteDBService: SqliteDBService,
    private readonly gitService: GitService,
    private readonly dockerService: DockerService,
    private readonly reverseProxyService: ReverseProxyService,
    private readonly deployRollbackService: DeployRollbackService
  ) {}

  async handleDeploy(accessToken: string, user: IUser, dto: CreateDeployDto) {
    // projectName se usa para evitar conflictos entre usuarios
    // que usen el mismo subdominio.
    // se crea un nombre unico basado en el subdominio y el nombre del usuario
    // por ejemplo: myapp.esteban.
    // ademas, busca normalizar para ubicar el proyecto de forma consistente
    // en docker, nginx, base de datos, etc.
    const normalizedUserName = normalizeUserName(user.name);
    const projectName = dto.subdomain.toLowerCase() + "." + normalizedUserName;

    const deploymentState = {
      repoPath: null as string | null,
      imageBuilt: false,
      containerRunning: false,
      proxyConfigured: false,
      dbRecordCreated: false,
    };

    try {
      const existingRepo =
        await this.sqliteDBService.findDeployment(projectName);
      if (existingRepo) {
        throw new ConflictException(
          "This subdomain is already associated with an existing deployment. Please choose a different subdomain."
        );
      }
      const repoPath = await this.gitService.cloneRepository(dto.repoUrl);
      deploymentState.repoPath = repoPath;

      await this.dockerService.buildImage(repoPath, projectName);
      deploymentState.imageBuilt = true;

      await this.dockerService.runContainer(
        projectName,
        projectName,
        appConfig.nginxPort
      );
      deploymentState.containerRunning = true;

      await this.reverseProxyService.createSubdomainConfig(
        projectName,
        appConfig.nginxPort
      );
      await this.reverseProxyService.reloadProxy();
      deploymentState.proxyConfigured = true;

      await this.robleDBService.uploadDeploymentData(
        accessToken,
        user!.uid,
        dto.repoUrl,
        projectName,
        dto?.description ?? "",
        new Date().toISOString()
      );
      await this.sqliteDBService.saveDeploymentData(user!.uid, {
        repoUrl: dto.repoUrl,
        subdomain: projectName,
        description: dto?.description,
      });
      deploymentState.dbRecordCreated = true;

      await this.gitService.cleanupRepository(repoPath);

      return `http://${projectName}.localhost`;
    } catch (err) {
      await this.deployRollbackService.rollback(
        accessToken,
        projectName,
        deploymentState
      );
      throw err;
    }
  }

  async deleteDeploy(
    accessToken: string,
    projectName: string,
    userName: string
  ) {
    const normalizedUserName = normalizeUserName(userName);
    const containerName = `${projectName}.${normalizedUserName}`;
    const exists = await this.dockerService.checkIfExists(containerName);
    if (!exists) {
      throw new BadRequestException(
        `Container ${containerName} does not exist`
      );
    }
    const isRunning = await this.dockerService.checkIfRunning(containerName);
    if (isRunning) {
      await this.reverseProxyService.removeSubdomainConfig(containerName);
      await this.dockerService.stopContainer(containerName);
    }
    await this.dockerService.removeContainer(containerName);
    await this.dockerService.removeImage(containerName);
    await this.robleDBService.deleteDeploymentData(accessToken, containerName);
    await this.sqliteDBService.deleteDeploymentData(containerName);
    await this.reverseProxyService.reloadProxy();
  }

  async notifyAccess(projectName: string) {
    await this.sqliteDBService.notifyAccess(projectName);
  }

  async sleep(projectName: string) {
    await this.reverseProxyService.removeSubdomainConfig(projectName);
    await this.dockerService.stopContainer(projectName);
    await this.sqliteDBService.updateActiveStatus(projectName, false);
    await this.reverseProxyService.reloadProxy();
  }

  async wakeUp(projectName: string) {
    await this.dockerService.startContainer(projectName);
    await this.sqliteDBService.updateActiveStatus(projectName, true);
    await this.reverseProxyService.createSubdomainConfig(
      projectName,
      appConfig.nginxPort
    );
    await this.reverseProxyService.reloadProxy();
  }
}
