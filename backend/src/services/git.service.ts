import { exec } from "../shared/utils/exec.util.js";
import { appConfig } from "../shared/config/config.js";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export class GitService {
  async cloneRepository(repoUrl: string): Promise<string> {
    const dir = path.join(appConfig.tmpRepoPath, randomUUID());
    await exec(`git clone ${repoUrl} ${dir}`);

    if (!fs.existsSync(dir)) {
      throw new Error("Failed to clone repository");
    }
    return dir;
  }

  async cleanupRepository(repoPath: string): Promise<void> {
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
  }
}
