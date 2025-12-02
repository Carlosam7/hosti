import { SqliteDBService } from "../db/sqlite.db.service.js";
import { DeployModule } from "../deploy/deploy.module.js";
import { appConfig } from "../shared/config/config.js";

export class IdleContainerWorker {
  private static instance: IdleContainerWorker;

  private readonly checkIntervalMs = appConfig.workerCheckIntervalS * 1000;
  private readonly idleThresholdMs =
    appConfig.workerInactivityThresholdS * 1000;

  private constructor(
    private readonly sqlite = SqliteDBService.getInstance(),
    private readonly deployManager = DeployModule.getDeployManager()
  ) {}

  static getInstance(): IdleContainerWorker {
    if (!this.instance) {
      this.instance = new IdleContainerWorker();
    }
    return this.instance;
  }

  start() {
    setInterval(() => this.checkForIdleContainers(), this.checkIntervalMs);
  }

  private async checkForIdleContainers() {
    const now = Date.now();
    const activeDeployments = await this.sqlite.getActiveDeployments();

    for (const deploy of activeDeployments) {
      const lastAccess = deploy.lastAccess;
      const diff = now - new Date(lastAccess).getTime();

      if (diff >= this.idleThresholdMs) {
        const containerName = deploy.subdomain;
        console.log(
          `Container ${containerName} has been idle for ${
            diff / 1000
          } seconds. Stopping it.`
        );
        await this.deployManager.sleep(containerName);

        console.log(`Host ${containerName} has been stopped due to idleness.`);
      }
    }
  }
}
