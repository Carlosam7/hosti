import fs from "fs/promises";
import { exec } from "../shared/utils/exec.util.js";
import { config } from "../shared/config/config.js";

export class ReverseProxyService {
  // cada contenedor se va a crear con un nombre unico basado en
  // el subdominio y el nombre del usuario, por ejemplo: myapp.esteban
  // de esta manera se evita conflictos entre contenedores
  // al final el reverse proxy va a mapear el subdominio al contenedor correspondiente
  // ejemplo: myapp.esteban.localhost -> myapp.esteban
  async createSubdomainConfig(conainerName: string, port: number) {
    const conf = `
server {
  listen 80;
  server_name ${conainerName}.localhost;

  location / {
    proxy_pass http://${conainerName}:${port};
  }
}
`;

    const confPath = `${config.nginxConfPath}/${conainerName}.conf`;

    await fs.writeFile(confPath, conf);
    await exec("docker exec nginx nginx -s reload");
  }
}
