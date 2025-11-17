import { GitService } from "../services/git.service.js";
import { DockerService } from "../services/docker.service.js";
import { DBService } from "../db/db.service.js";
import { ConflictException } from "../shared/exceptions/http.exception.js";
import type { Request } from "express";

export class DeployManager {
  private readonly dbService = new DBService();
  private readonly gitService = new GitService();
  private readonly dockerService = new DockerService();

  async handleDeploy(req: Request, repoUrl: string, subdomain: string) {
    const { accessToken } = req.cookies;
    const user = req.user;

    const existingRepo = await this.dbService.checkExistingRepository(
      accessToken,
      subdomain
    );
    if (existingRepo) {
      throw new ConflictException(
        "This subdomain is already associated with an existing deployment. Please choose a different subdomain."
      );
    }
    const repoPath = await this.gitService.cloneRepository(repoUrl);
    await this.dockerService.buildImage(repoPath, subdomain);
    await this.dockerService.runContainer(subdomain, subdomain, 80);
    await this.dbService.uploadDeploymentData(
      accessToken,
      user!.uid,
      repoUrl,
      subdomain,
      "Deployment created via DeployManager",
      new Date().toISOString()
    );
  }
}
