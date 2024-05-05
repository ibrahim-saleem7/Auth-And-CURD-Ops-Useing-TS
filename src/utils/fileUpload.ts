import multer from "multer";
import { Request, Response } from "express";

function fileUpload(...params: any) {
  const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const fileFilter: any = (req: Response, file: any, cb: any) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("application/pdf")
    ) {
      cb(null, true);
    } else cb(null, false);
  };
  const upload = multer({ storage, fileFilter });
  return upload.fields([
    { name: params[0], maxCount: 5 },
    { name: params[1], maxCount: 5 },
    { name: params[2], maxCount: 5 },
    { name: params[3], maxCount: 5 },
  ]);
}

export default fileUpload;
