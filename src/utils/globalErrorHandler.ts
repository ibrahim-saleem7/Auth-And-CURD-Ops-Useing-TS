import { Request, Response } from "express";
import uploadError from "./uploadError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: any
) => {
  if (process.env.NODE_ENV == "development") developmentMode(error, req, res);
  else productionMode(error, req, res);
};

const developmentMode = (error: any, req: Request, res: Response) => {
  const code: number = error.statusCode || 400;
  uploadError(req);
  res
    .status(code)
    .json({ error: error.message, statusCode: code, stack: error.stack });
};

const productionMode = (error: any, req: Request, res: Response) => {
  const code: number = error.statusCode || 400;
  uploadError(req);
  res.status(code).json({ error: error.message, statusCode: code });
};

export default globalErrorHandler;
