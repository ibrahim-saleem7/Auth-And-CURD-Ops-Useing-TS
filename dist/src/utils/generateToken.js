"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(payload) {
    const secret = process.env.JWT_SECRET_KEY;
    return jsonwebtoken_1.default.sign(payload, secret);
}
exports.default = generateToken;
