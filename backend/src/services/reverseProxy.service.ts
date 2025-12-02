import fs from "fs/promises";
import { exec } from "../shared/utils/exec.util.js";
import { appConfig } from "../shared/config/config.js";

export class ReverseProxyService {
  // cada contenedor se va a crear con un nombre unico basado en
  // el nombre del proyecto y el nombre del usuario, por ejemplo: myapp.esteban.
  // de esta manera se evita conflictos entre contenedores.
  // al final, el reverse proxy va a crear una configuracion de nginx (subdominio)
  // con el mismo nombre del contenedor.
  // ejemplo: myapp.esteban -> myapp.esteban.localhost
  async createSubdomainConfig(containerName: string, port: number) {
    const conf = `
server {
  listen 80;
  server_name ${containerName}.localhost;

  location / {
    auth_request /notify-access;
    proxy_pass http://${containerName}:${port};
  }

  location /notify-access {
    internal;
    rewrite ^/notify-access$ /deploy/notify-access/${containerName} break;
    proxy_pass http://${appConfig.backendUrl};
  }
}
`;

    const confPath = `${appConfig.nginxConfPath}/${containerName}.conf`;

    await fs.writeFile(confPath, conf);
  }

  async removeSubdomainConfig(containerName: string) {
    const confPath = `${appConfig.nginxConfPath}/${containerName}.conf`;
    await fs.unlink(confPath);
    await exec("docker exec nginx nginx -s reload");
  }

  async reloadProxy() {
    await exec("docker exec nginx nginx -s reload");
  }
}
