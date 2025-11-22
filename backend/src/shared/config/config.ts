export const config = {
  port: process.env.PORT || 3000,
  robleUrl: process.env.ROBLE_URL,
  tokenContract: process.env.TOKEN_CONTRACT,
  tmpRepoPath:
    process.env.NODE_ENV === "production"
      ? "/app/tmp/repositories"
      : "tmp/repositories",
};
