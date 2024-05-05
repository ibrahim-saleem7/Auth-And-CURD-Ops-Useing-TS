import fs from "fs";
import path from "path";
import { Request } from "express";

function uploadError(req: Request | any) {
  for (let file in req.files) {
    req.files[file].map((f: any) => {
      return fs.unlink(
        path.join(__dirname, "../../uploads", f.filename),
        (err) => (err ? console.log("err", err) : null)
      );
    });
  }
}

export default uploadError;
