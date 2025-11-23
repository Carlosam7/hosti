import { exec } from "../shared/utils/exec.util.js";

export class DockerService {
  async buildImage(repoPath: string, imageName: string): Promise<void> {
    await exec(`docker build -t ${imageName} ${repoPath}`);
  }

  async runContainer(
    imageName: string,
    containerName: string,
    port: number
  ): Promise<void> {
    await exec(
      `docker run -d --name ${containerName} --network hosti_net -p ${port} ${imageName}`
    );
  }
}
