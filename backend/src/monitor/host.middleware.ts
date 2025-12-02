import type { NextFunction, Request, Response } from "express";
import { SqliteDBService } from "../db/sqlite.db.service.js";
import { DeployModule } from "../deploy/deploy.module.js";

const pendingWakeUps = new Set<string>();

export const hostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const host = req.headers.host;
  if (!host) {
    return res.status(400).send("Host header is missing");
  }
  console.log(`Incoming request from host: ${host}`);

  if (req.path !== "/") return next();

  const hostParts = host.split(".");
  if (hostParts.length < 3) return next();

  const subdomain = hostParts.slice(0, 2).join(".");

  try {
    const deploy =
      await SqliteDBService.getInstance().findDeployment(subdomain);
    if (!deploy) return res.status(404).end();

    if (deploy.active) return next();

    console.log(`Waking up host ${subdomain}`);

    if (pendingWakeUps.has(subdomain)) {
      console.log(`Host ${subdomain} is already waking up.`);
      return res.status(503).end();
    }

    pendingWakeUps.add(subdomain);
    const deployManager = DeployModule.getDeployManager();
    deployManager
      .wakeUp(subdomain)
      .then(() => deployManager.notifyAccess(subdomain))
      .then(() => console.log(`Host ${subdomain} is now active.`))
      .catch((err) => console.error(`Error waking up host ${subdomain}:`, err))
      .finally(() => pendingWakeUps.delete(subdomain));

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(503).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Hosti • Waking up your project</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 100vh;
      background: #fff;
      color: #222;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 3rem;
      font-weight: 200;
      text-align: center;
      color: #2dd4cf;
    }

    .hosti {
      background-color: #2dd4cf;
      color: #fff;
      font-weight: 400;
      padding: 0 0.5rem;
      border-radius: 0.5rem;
    }

    p {
      margin: 0;
      opacity: 0.85;
    }

    .footer-text {
      opacity: 0.35;
      line-height: 1.5rem;
    }

    .infinite-container {
      position: relative;
      margin: 5rem 0 10rem;
    }

    #outline {
      stroke-dasharray: 2.42777px, 242.77666px;
      stroke-dashoffset: 0;
      -webkit-animation: anim 1.6s linear infinite;
      animation: anim 1.6s linear infinite;
    }

    @-webkit-keyframes anim {
      12.5% {
        stroke-dasharray: 33.98873px, 242.77666px;
        stroke-dashoffset: -26.70543px;
      }

      43.75% {
        stroke-dasharray: 84.97183px, 242.77666px;
        stroke-dashoffset: -84.97183px;
      }

      100% {
        stroke-dasharray: 2.42777px, 242.77666px;
        stroke-dashoffset: -240.34889px;
      }
    }

    @keyframes anim {
      12.5% {
        stroke-dasharray: 33.98873px, 242.77666px;
        stroke-dashoffset: -26.70543px;
      }

      43.75% {
        stroke-dasharray: 84.97183px, 242.77666px;
        stroke-dashoffset: -84.97183px;
      }

      100% {
        stroke-dasharray: 2.42777px, 242.77666px;
        stroke-dashoffset: -240.34889px;
      }
    }
  </style>
</head>

<body>
  <main>
    <h1>Welcome to <span class="hosti">Hosti</span>!</h1>
    <p>Your project is waking up</p>
    <div class="infinite-container">
      <svg style="left: 50%;
          top: 50%;
          position: absolute;
          transform: translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 187.3 93.7" height="200px" width="300px">
        <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="4" fill="none" id="outline" stroke="#2dd4cf"></path>
        <path d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 				c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#2dd4cf" fill="none" opacity="0.05" id="outline-bg"></path>
      </svg>
    </div>
    <p class="footer-text">This may take a few seconds. <br />The page will refresh automatically when it's ready.</p>
  </main>
  <script>
    let attempts = 0;
    const maxAttempts = 90;

    function check() {
      attempts++;
      fetch("/", {
        method: "GET",
        cache: "no-store"
      })
        .then(response => {
          if (response.ok) {
            window.location.reload();
          } else if (attempts < maxAttempts) {
            setTimeout(check, 1000);
          }
        })
        .catch(() => {
          if (attempts < maxAttempts) {
            setTimeout(check, 1000);
          }
        });
    }
    setTimeout(check, 1500);
  </script>
</body>
</html>`);
  } catch (err) {
    return next(err);
  }
};
