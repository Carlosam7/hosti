import express from "express";
import routes from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import { config } from "./shared/config/config.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();
const PORT = config.port;
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
