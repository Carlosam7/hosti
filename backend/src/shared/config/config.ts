export const config = {
  port: process.env.PORT || 3000,
  robleUrl: process.env.ROBLE_URL,
  tokenContract: process.env.TOKEN_CONTRACT,
  backendUrl: `http://localhost:${process.env.PORT ?? 3000}`,
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
