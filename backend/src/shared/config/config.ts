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

const allowedDomains = process.env.CORS_ALLOWED_DOMAINS
  ? process.env.CORS_ALLOWED_DOMAINS.split(",")
  : ["localhost"];

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    const isAllowedDomain = allowedDomains.some((domain) =>
      origin.endsWith(domain)
    );
    if (isAllowedDomain) return callback(null, true);

    console.warn(`CORS policy: Blocked origin ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
