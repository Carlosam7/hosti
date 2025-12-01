import fs from "fs/promises";
import { exec } from "../shared/utils/exec.util.js";
import { config } from "../shared/config/config.js";

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
    auth_request_set $auth_status $upstream_status;

    if ($auth_status = 412) {
      return 412;
    }

    error_page 412 = @wake_up;
    proxy_pass http://${containerName}:${port};
  }

  location /notify-access {
    internal;
    rewrite ^/notify-access$ /deploy/notify-access/${containerName} break;
    proxy_pass http://${config.backendUrl};
  }

  location @wake_up {
    add_header Refresh "1; url=$scheme://$host$request_uri";
    add_header Content-Type text/html;
    return 200 "<html><body><h1>welcome to Hosti!. Your project is waking up...</h1></body></html>";
  }
}
`;

    const confPath = `${config.nginxConfPath}/${containerName}.conf`;

    await fs.writeFile(confPath, conf);
  }

  async removeSubdomainConfig(containerName: string) {
    const confPath = `${config.nginxConfPath}/${containerName}.conf`;
    await fs.unlink(confPath);
    await exec("docker exec nginx nginx -s reload");
  }

  async reloadProxy() {
    await exec("docker exec nginx nginx -s reload");
  }
}
