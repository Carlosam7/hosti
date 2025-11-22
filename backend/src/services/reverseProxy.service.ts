import fs from "fs/promises";
import { exec } from "../shared/utils/exec.util.js";

export class ReverseProxyService {
  async createSubdomainConfig(
    subdomain: string,
    userName: string,
    port: number
  ) {
    const config = `
    server {
      listen 80;
      server_name ${subdomain}.${userName}.localhost.com;

      location / {
        proxy_pass http://host.docker.internal:${port}
      }
    }`;

    const path = `/etc/nginx/conf.d/${subdomain}.conf`;

    await fs.writeFile(path, config);
    await exec("docker exec nginx-proxy nginx -s reload");
  }
}
