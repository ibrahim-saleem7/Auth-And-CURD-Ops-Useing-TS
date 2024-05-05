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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    static verifyToken(req, res, next) {
        let token = req.headers.token;
        if (token) {
            try {
                const secret = process.env.JWT_SECRET_KEY;
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                req.user = decoded;
                next();
            }
            catch (err) {
                return res.status(401).json({ message: "Required Login" });
            }
        }
        else {
            return res.status(401).json({ message: "Required Login" });
        }
    }
    static authUserAndAdmin(permission) {
        return (req, res, next) => {
            Token.verifyToken(req, res, () => {
                var _a, _b, _c;
                const permissions = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === null || _b === void 0 ? void 0 : _b.permissions;
                if (req.user.id == req.params.id ||
                    (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.type) === "admin" && permissions.includes(...permission))) {
                    next();
                }
                else {
                    return res.status(403).json({ message: "you are not allowed" });
                }
            });
        };
    }
    static authAdmin(permission) {
        return (req, res, next) => {
            Token.verifyToken(req, res, () => {
                var _a, _b, _c, _d;
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.role))
                    return res.status(403).json({ message: "you are not allowed" });
                const permissions = (_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.permissions;
                if (((_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.type) === "admin" &&
                    permissions.includes(...permission)) {
                    next();
                }
                else {
                    return res.status(403).json({ message: "you are not allowed" });
                }
            });
        };
    }
}
Token.verifyEmailToken = (req, res, next) => {
    const { token } = req.params;
    const secret = process.env.JWT_SECRET_KEY;
    jsonwebtoken_1.default.verify(token, secret, function (err, decoded) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            else {
                req.email = decoded.email;
                next();
            }
        });
    });
};
exports.default = Token;
