"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
function fileUpload(...params) {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image") ||
            file.mimetype.startsWith("application/pdf")) {
            cb(null, true);
        }
        else
            cb(null, false);
    };
    const upload = (0, multer_1.default)({ storage, fileFilter });
    return upload.fields([
        { name: params[0], maxCount: 5 },
        { name: params[1], maxCount: 5 },
        { name: params[2], maxCount: 5 },
        { name: params[3], maxCount: 5 },
    ]);
}
exports.default = fileUpload;
