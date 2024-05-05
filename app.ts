import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import hpp from "hpp";
import helmet from "helmet";
import AppError from "./src/utils/appError";
import globalErrorHandler from "./src/utils/globalErrorHandler";
import itemsRoutes from "./src/routes/items.routes";
import authRoutes from "./src/routes/auth.routes";

/*------------------const-------------------*/
import fileUpload from "./src/utils/fileUpload";

const app: Express = express();

/*------------------Middlewares-------------------*/
app.use(cors());
app.use(express.static(path.join(__dirname, "./uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(hpp());
app.use(helmet());

/*------------------Routes-------------------*/
app.use("/api/items", itemsRoutes);
app.use("/api/auth", authRoutes);

/*------------------Handlers-----------------*/
app.all("*", (req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(fileUpload());
app.use(globalErrorHandler);

/*------------------------------------*/
export default app;
