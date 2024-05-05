import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import AppError from "../utils/appError";

function validation(schema: any) {
  return (req: Request | any, res: Response, next: any) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (req.files)
        for (let file in req.files) {
          req.files[file].map((f: any) => {
            return fs.unlink(
              path.join(__dirname, "../../uploads", f.filename),
              (err) => (err ? console.log("err", err) : null)
            );
          });
        }

      next(new AppError(error.details[0].message, 400));
    } else next();
  };
}

export default validation;
