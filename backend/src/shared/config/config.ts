export const config = {
  port: process.env.PORT || 3000,
  robleUrl: process.env.ROBLE_URL,
  tokenContract: process.env.TOKEN_CONTRACT,
  deploymentsPath:
    process.env.REPO_PATH || "/home/edadul/GitHub/hosti/backend/deployments",
};
