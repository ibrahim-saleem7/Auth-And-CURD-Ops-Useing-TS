"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class Auth {
}
Auth.signup = joi_1.default.object({
    name: joi_1.default.string().lowercase().required(),
    email: joi_1.default.string().lowercase().required(),
    password: joi_1.default.string().required(),
    image: joi_1.default.any(),
});
Auth.login = joi_1.default.object({
    email: joi_1.default.string().lowercase().required(),
    password: joi_1.default.string().required(),
});
Auth.email = joi_1.default.object({
    email: joi_1.default
        .string()
        .lowercase()
        .required()
        .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
});
Auth.setNewPassword = joi_1.default.object({
    password: joi_1.default
        .string()
        .required()
        .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    code: joi_1.default.string().required().trim(),
});
exports.default = Auth;
