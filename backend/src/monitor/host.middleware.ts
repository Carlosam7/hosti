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

    return res.status(503).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Hosti • Waking up your project</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root { color-scheme: light dark }
    body { margin:0; font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial,sans-serif;
           display:flex; align-items:center; justify-content:center; min-height:100vh; background:#0b0f14; color:#e6edf3; }
    .card { max-width:640px; padding:24px 28px; border-radius:16px; background:#11171f; box-shadow:0 8px 24px rgba(0,0,0,.35); text-align:center; }
    h1 { margin:0 0 8px; font-size:1.25rem; }
    p { margin:0; opacity:.85 }
    .dots::after { content:"..."; animation: ellipsis 1.2s infinite steps(4,end) }
    @keyframes ellipsis { 0%{content:""} 25%{content:"."} 50%{content:".."} 75%{content:"..."} 100%{content:""} }
    .meta { margin-top:16px; font-size:.9rem; opacity:.7 }
  </style>
</head>
<body>
  <div class="card">
    <h1>Starting your environment</h1>
    <p class="dots">Your project is waking up</p>
    <p class="meta">This may take a few seconds. The page will refresh automatically when it’s ready.</p>
  </div>
  <script>
    let attempts = 0, maxAttempts = 90;
    function check() {
      attempts++;
      // Consulta la raíz del subdominio; cuando esté listo devolverá 200
      fetch("/", { method: "GET", cache: "no-store" })
        .then(r => {
          if (r.ok) {
            window.location.reload();
          } else if (attempts < maxAttempts) {
            setTimeout(check, 1000);
          }
        })
        .catch(() => {
          if (attempts < maxAttempts) setTimeout(check, 1000);
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
