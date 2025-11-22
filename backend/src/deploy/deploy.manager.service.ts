import { GitService } from "../services/git.service.js";
import { DockerService } from "../services/docker.service.js";
import { DBService } from "../db/db.service.js";
import { ConflictException } from "../shared/exceptions/http.exception.js";
import type { Request } from "express";
import type { CreateDeployDto } from "./dto/create-deploy.dto.js";
import { ReverseProxyService } from "../services/reverseProxy.service.js";

export class DeployManager {
  private readonly dbService = new DBService();
  private readonly gitService = new GitService();
  private readonly dockerService = new DockerService();
  private readonly reverseProxyService = new ReverseProxyService();

  async handleDeploy(req: Request, dto: CreateDeployDto) {
    const { accessToken } = req.cookies;
    const user = req.user;

    const existingRepo = await this.dbService.checkExistingRepository(
      accessToken,
      dto.subdomain
    );
    if (existingRepo) {
      throw new ConflictException(
        "This subdomain is already associated with an existing deployment. Please choose a different subdomain."
      );
    }
    const repoPath = await this.gitService.cloneRepository(dto.repoUrl);
    await this.dockerService.buildImage(repoPath, dto.subdomain);
    await this.dockerService.runContainer(dto.subdomain, dto.subdomain, 80);

    await this.reverseProxyService.createSubdomainConfig(
      dto.subdomain,
      user!.name,
      80
    );

    await this.dbService.uploadDeploymentData(
      accessToken,
      user!.uid,
      dto.repoUrl,
      dto.subdomain,
      dto.description ?? "",
      new Date().toISOString()
    );
    await this.gitService.cleanupRepository(repoPath);
  }
}
