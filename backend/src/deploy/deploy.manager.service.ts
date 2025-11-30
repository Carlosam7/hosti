import { GitService } from "../services/git.service.js";
import { DockerService } from "../services/docker.service.js";
import { RobleDBService } from "../db/roble-db.service.js";
import {
  BadRequestException,
  ConflictException,
} from "../shared/exceptions/http.exception.js";
import type { CreateDeployDto } from "./dto/create-deploy.dto.js";
import { ReverseProxyService } from "../services/reverseProxy.service.js";
import { config } from "../shared/config/config.js";
import type { IUser } from "../auth/auth.types.js";
import type { DeployRollbackService } from "./deploy-rollback.service.js";

export class DeployManagerService {
  constructor(
    private readonly dbService: RobleDBService,
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
    const projectName =
      dto.subdomain.toLowerCase() + "." + user!.name.toLowerCase();

    const deploymentState = {
      repoPath: null as string | null,
      imageBuilt: false,
      containerRunning: false,
      proxyConfigured: false,
      dbRecordCreated: false,
    };

    try {
      const existingRepo = await this.dbService.checkExistingRepository(
        accessToken,
        projectName
      );
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
        config.nginxPort
      );
      deploymentState.containerRunning = true;

      await this.reverseProxyService.createSubdomainConfig(
        projectName,
        config.nginxPort
      );
      deploymentState.proxyConfigured = true;

      await this.dbService.uploadDeploymentData(
        accessToken,
        user!.uid,
        dto.repoUrl,
        projectName,
        dto?.description ?? "",
        new Date().toISOString()
      );
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
    const containerName = `${projectName}.${userName}`;
    const exists = await this.dockerService.checkIfExists(containerName);
    if (!exists) {
      throw new BadRequestException(
        `Container ${containerName} does not exist`
      );
    }
    await this.dockerService.removeContainer(containerName);
    await this.dockerService.removeImage(containerName);
    await this.dbService.deleteDeploymentData(accessToken, projectName);
    await this.reverseProxyService.removeSubdomainConfig(containerName);
  }

  // TODO: agregar metodo para eliminar deploys

  // TODO: agreagar metodo para congelar deploys (para no consumir recursos)
  // esto implica detener el contenedor y actualizar la base de datos
  // como sabemos cuanto tiempo ha estado sin usarse un contenedor? nadie sabe jaja

  async notifyAccess(accessToken: string, subdomain: string) {
    await this.dbService.notifyAccess(accessToken, subdomain);
  }
}
