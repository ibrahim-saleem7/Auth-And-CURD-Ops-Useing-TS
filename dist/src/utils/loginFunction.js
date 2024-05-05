"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = __importDefault(require("./appError"));
const generateToken_1 = __importDefault(require("./generateToken"));
function login(body, user, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user.isConfirm)
            return next(new appError_1.default("please confirm your account", 403));
        const matchPassword = yield bcryptjs_1.default.compare(body.password, user.password);
        if (!matchPassword)
            return next(new appError_1.default("Invalid email or password", 400));
        const token = (0, generateToken_1.default)({ id: user._id, name: user.name });
        return res.status(200).json({ id: user._id, token: token });
    });
}
exports.default = login;
