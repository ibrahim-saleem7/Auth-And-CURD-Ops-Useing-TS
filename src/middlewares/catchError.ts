import { Request, Response } from "express";

function catchAsyncError(fn: Function) {
  return (req: Request, res: Response, next: any) => {
    fn(req, res, next).catch((error: any) => next(error));
  };
}
export default catchAsyncError;
