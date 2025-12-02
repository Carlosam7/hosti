import express from "express";
import routes from "./routes/index.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { appConfig, corsOptions } from "./shared/config/config.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import { IdleContainerWorker } from "./monitor/idle-container.worker.js";

const app = express();
const PORT = appConfig.port;
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorMiddleware);
IdleContainerWorker.getInstance().start();

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
