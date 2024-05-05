"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const appError_1 = __importDefault(require("../utils/appError"));
function validation(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            if (req.files)
                for (let file in req.files) {
                    req.files[file].map((f) => {
                        return fs_1.default.unlink(path_1.default.join(__dirname, "../../uploads", f.filename), (err) => (err ? console.log("err", err) : null));
                    });
                }
            next(new appError_1.default(error.details[0].message, 400));
        }
        else
            next();
    };
}
exports.default = validation;
