export const config = {
  port: process.env.PORT || 3000,
  robleUrl: process.env.ROBLE_URL,
  tokenContract: process.env.TOKEN_CONTRACT,
  backendUrl:
    process.env.NODE_ENV === "production"
      ? "backend:3000"
      : "host.docker.internal:3000",
  tmpRepoPath:
    process.env.NODE_ENV === "production"
      ? "/app/tmp/repositories"
      : "tmp/repositories",
  nginxConfPath:
    process.env.NODE_ENV === "production"
      ? "/app/nginx/conf.d"
      : "nginx/conf.d",
  nginxPort: 80,
};

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];
export const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
