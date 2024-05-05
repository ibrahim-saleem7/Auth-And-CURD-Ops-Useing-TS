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
const nodemailer_1 = __importDefault(require("nodemailer"));
const appError_1 = __importDefault(require("../utils/appError"));
const email_password_1 = __importDefault(require("./email.password"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const emailConfirmFormat_1 = __importDefault(require("./emailConfirmFormat"));
/**
 *  @description Sends emails to users when confirm email or reset password
 *  @param {string} email - user email.
 *  @param {string} redirectLink - Frontend route to redirect user (in confirm case).
 *  @param {number} code - Code to verify (in resst password case).
 *  @param {string} subject - Email subject.
 * @returns {string} html email string
 */
const sendEmail = ({ email, redirectLink, codeNum, subject }) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });
    const info = yield transporter.sendMail({
        from: `Ibrahim Saleem <${process.env.EMAIL}>`,
        to: email,
        subject: subject || "Saleem Email",
        html: (function () {
            if (codeNum) {
                return (0, email_password_1.default)(codeNum);
            }
            else {
                const token = (0, generateToken_1.default)({ email });
                return (0, emailConfirmFormat_1.default)(token, redirectLink);
            }
        })(),
    }, (error, success) => {
        if (error) {
            return new appError_1.default(error.message, 400);
        }
        return { message: "Email sent successfully!" };
    });
});
exports.default = sendEmail;
