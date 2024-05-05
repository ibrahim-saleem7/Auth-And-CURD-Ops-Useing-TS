"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadError_1 = __importDefault(require("./uploadError"));
const globalErrorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV == "development")
        developmentMode(error, req, res);
    else
        productionMode(error, req, res);
};
const developmentMode = (error, req, res) => {
    const code = error.statusCode || 400;
    (0, uploadError_1.default)(req);
    res
        .status(code)
        .json({ error: error.message, statusCode: code, stack: error.stack });
};
const productionMode = (error, req, res) => {
    const code = error.statusCode || 400;
    (0, uploadError_1.default)(req);
    res.status(code).json({ error: error.message, statusCode: code });
};
exports.default = globalErrorHandler;
