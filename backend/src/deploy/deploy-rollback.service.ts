import type { RobleDBService } from "../db/roble.db.service.js";
import type { DockerService } from "../services/docker.service.js";
import type { GitService } from "../services/git.service.js";
import type { ReverseProxyService } from "../services/reverseProxy.service.js";

export class DeployRollbackService {
  constructor(
    private readonly dbService: RobleDBService,
    private readonly reverseProxyService: ReverseProxyService,
    private readonly dockerService: DockerService,
    private readonly gitService: GitService
  ) {}

  async rollback(
    accessToken: string,
    projectName: string,
    state: {
      repoPath: string | null;
      imageBuilt: boolean;
      containerRunning: boolean;
      proxyConfigured: boolean;
      dbRecordCreated: boolean;
    }
  ) {
    if (state.dbRecordCreated) {
      await this.dbService.deleteDeploymentData(accessToken, projectName);
    }
    if (state.proxyConfigured) {
      await this.reverseProxyService.removeSubdomainConfig(projectName);
    }
    if (state.containerRunning) {
      await this.dockerService.stopContainer(projectName);
    }
    if (state.imageBuilt) {
      await this.dockerService.removeContainer(projectName);
      await this.dockerService.removeImage(projectName);
    }
    if (state.repoPath) {
      await this.gitService.cleanupRepository(state.repoPath);
    }
  }
}
