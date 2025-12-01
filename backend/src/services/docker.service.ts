import { exec } from "../shared/utils/exec.util.js";

export class DockerService {
  async buildImage(repoPath: string, imageName: string): Promise<void> {
    await exec(`docker build --no-cache -t ${imageName} ${repoPath}`);
  }

  async removeImage(imageName: string): Promise<void> {
    await exec(`docker rmi ${imageName}`);
  }

  // TODO??: limite de CPU y memoria ajustable por template
  async runContainer(
    imageName: string,
    containerName: string,
    port: number
  ): Promise<void> {
    await exec(
      `docker run -d --cpus="0.5" --memory="250m" --name ${containerName} --network hosti_net -p ${port} ${imageName}`
    );
  }

  async stopContainer(containerName: string): Promise<void> {
    await exec(`docker stop ${containerName}`);
  }

  async startContainer(containerName: string): Promise<void> {
    await exec(`docker start ${containerName}`);
  }

  async removeContainer(containerName: string): Promise<void> {
    await exec(`docker rm ${containerName}`);
  }

  async checkIfExists(containerName: string): Promise<boolean> {
    const result = await exec(
      `docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`
    );
    return result.stdout.trim() === containerName;
  }

  async checkIfRunning(containerName: string): Promise<boolean> {
    const result = await exec(
      `docker inspect -f '{{.State.Running}}' ${containerName}`
    );
    return result.stdout.trim() === "true";
  }
}
