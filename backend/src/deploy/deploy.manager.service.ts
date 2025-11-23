import { GitService } from "../services/git.service.js";
import { DockerService } from "../services/docker.service.js";
import { DBService } from "../db/db.service.js";
import { ConflictException } from "../shared/exceptions/http.exception.js";
import type { Request } from "express";
import type { CreateDeployDto } from "./dto/create-deploy.dto.js";
import { ReverseProxyService } from "../services/reverseProxy.service.js";
import { config } from "../shared/config/config.js";

export class DeployManager {
  private readonly dbService = new DBService();
  private readonly gitService = new GitService();
  private readonly dockerService = new DockerService();
  private readonly reverseProxyService = new ReverseProxyService();

  async handleDeploy(req: Request, dto: CreateDeployDto) {
    const { accessToken } = req.cookies;
    // user viene del middleware de autenticacion.
    // siempre va a estar definido aqui.
    // si no estuviera definido, el middleware habria lanzado un error.
    const user = req.user;

    // projectName se usa para evitar conflictos entre usuarios
    // que usen el mismo subdominio.
    // se crea un nombre unico basado en el subdominio y el nombre del usuario
    // por ejemplo: myapp.esteban.
    // ademas, busca normalizar para ubicar el proyecto de forma consistente
    // en docker, nginx, base de datos, etc.
    const projectName =
      dto.subdomain.toLowerCase() + "." + user!.name.toLowerCase();

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
    await this.dockerService.buildImage(repoPath, projectName);
    await this.dockerService.runContainer(
      projectName,
      projectName,
      config.nginxPort
    );
    await this.reverseProxyService.createSubdomainConfig(
      projectName,
      config.nginxPort
    );

    await this.dbService.uploadDeploymentData(
      accessToken,
      user!.uid,
      dto.repoUrl,
      projectName,
      dto.description ?? "",
      new Date().toISOString()
    );
    await this.gitService.cleanupRepository(repoPath);

    return `http://${projectName}.localhost`;
    // TODO: rollback en caso de error en algun paso
    // TODO: limpiar imagenes ya construidas y contenedores antiguos
  }

  // TODO: agregar metodo para eliminar deploys

  // TODO: agreagar metodo para congelar deploys (para no consumir recursos)
  // esto implica detener el contenedor y actualizar la base de datos
  // como sabemos cuanto tiempo ha estado sin usarse un contenedor? nadie sabe jaja
}
