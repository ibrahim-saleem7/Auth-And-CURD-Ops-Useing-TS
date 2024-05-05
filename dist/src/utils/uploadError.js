"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function uploadError(req) {
    for (let file in req.files) {
        req.files[file].map((f) => {
            return fs_1.default.unlink(path_1.default.join(__dirname, "../../uploads", f.filename), (err) => (err ? console.log("err", err) : null));
        });
    }
}
exports.default = uploadError;
