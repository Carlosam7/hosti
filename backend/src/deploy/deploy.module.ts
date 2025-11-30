import { RobleDBService } from "../db/roble.db.service.js";
import { SqliteDBService } from "../db/sqlite.db.service.js";
import { DockerService } from "../services/docker.service.js";
import { GitService } from "../services/git.service.js";
import { ReverseProxyService } from "../services/reverseProxy.service.js";
import { DeployRollbackService } from "./deploy-rollback.service.js";
import { DeployController } from "./deploy.controller.js";
import { DeployManagerService } from "./deploy.manager.service.js";

export class DeployModule {
  private static instance: DeployModule;

  public readonly controller: DeployController;
  private readonly deployManager: DeployManagerService;
  private readonly rollbackService: DeployRollbackService;

  private constructor() {
    const dockerService = new DockerService();
    const gitService = new GitService();
    const reverseProxyService = new ReverseProxyService();
    const robleDBService = RobleDBService.getInstance();
    const sqliteDBService = SqliteDBService.getInstance();

    this.rollbackService = new DeployRollbackService(
      robleDBService,
      reverseProxyService,
      dockerService,
      gitService
    );

    this.deployManager = new DeployManagerService(
      robleDBService,
      sqliteDBService,
      gitService,
      dockerService,
      reverseProxyService,
      this.rollbackService
    );

    this.controller = new DeployController(this.deployManager);
  }

  static getInstance(): DeployModule {
    if (!DeployModule.instance) {
      DeployModule.instance = new DeployModule();
    }
    return DeployModule.instance;
  }
}
