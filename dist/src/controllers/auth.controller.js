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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lodash_1 = __importDefault(require("lodash"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchError_1 = __importDefault(require("../middlewares/catchError"));
const httpStatusText_1 = __importDefault(require("../utils/httpStatusText"));
const user_email_1 = __importDefault(require("../emails/user.email"));
const user_model_1 = __importDefault(require("../models/user.model"));
const loginFunction_1 = __importDefault(require("../utils/loginFunction"));
const generateCode_1 = __importDefault(require("../utils/generateCode"));
class AuthController {
}
_a = AuthController;
/**
 *  @description add new admin
 *  @route /api/admin/
 *  @method POST
 *  @access private (Super Admin)
 */
AuthController.signUp = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectLink = req.header("redirectLink");
    const requiredFields = ["name", "email", "password", "image"];
    const body = lodash_1.default.pick(req.body, requiredFields);
    if (!body)
        return next(new appError_1.default(httpStatusText_1.default.BADREQUEST, 400));
    const existingUser = yield user_model_1.default.findOne({ email: body.email });
    if (existingUser)
        return next(new appError_1.default("user has already found", 409));
    body.password = yield bcryptjs_1.default.hash(body.password, Number(process.env.SALT));
    const { image } = req.files;
    if (!image)
        return next(new appError_1.default("Missing Image", 400));
    body.image = yield image[0].filename;
    const user = yield user_model_1.default.create(body);
    (0, user_email_1.default)({
        email: body.email,
        redirectLink,
        subject: "Email Confirmation",
    });
    return res.status(201).json({
        message: `${user.name} registered successfully please check your mail to confirm your account`,
    });
}));
/**
 *  @description Login The User
 *  @route /api/auth/login
 *  @method POST
 *  @access public
 */
AuthController.login = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = lodash_1.default.pick(req.body, ["email", "password"]);
        const user = yield user_model_1.default.findOne({ email: body.email });
        if (user)
            return (0, loginFunction_1.default)(body, user, res, next);
        return next(new appError_1.default("Invalid email or password", 400));
    });
});
/**
 *  @description Forgot Password User
 *  @route /api/auth/forgot-password
 *  @method POST
 *  @access public
 */
AuthController.forgotPassword = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const redirectLink = req.header("redirectLink");
        const codeNum = (0, generateCode_1.default)();
        const email = req.body.email;
        let user = yield user_model_1.default.findOne({ email: email });
        if (!user)
            return next(new appError_1.default("email does not exist", 404));
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY + user.password, { expiresIn: "10m" });
        const link = {
            id: user._id,
            token: token,
        };
        user.passCode = codeNum;
        yield user.save();
        (0, user_email_1.default)({ email, redirectLink, codeNum, subject: "Forget Password" });
        return res.status(200).json({
            message: "The code has been sent to your email, please check your email",
            link,
        });
    });
});
/**
 *  @description Reset Password User
 *  @route /api/auth/reset-password/:id/:token
 *  @method POST
 *  @access public
 */
AuthController.resetPassword = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_model_1.default.findById(req.params.id);
        if (!user)
            return next(new appError_1.default("email does not exist", 404));
        const body = lodash_1.default.pick(req.body, ["password", "code"]);
        const toke = jsonwebtoken_1.default.verify(req.params.token, process.env.JWT_SECRET_KEY + user.password);
        if (user.passCode != body.code)
            return next(new appError_1.default("code is incorrect", 400));
        user.password = yield bcryptjs_1.default.hash(body.password, Number(process.env.SALT));
        user.passCode = undefined;
        yield user.save();
        return res.status(201).json({
            email: user.email,
            message: "The password is reset successfully",
        });
    });
});
/**
 *  @description Change Password User
 *  @route /api/auth/change-password
 *  @method POST
 *  @access public
 */
AuthController.changePassword = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const redirectLink = req.header("redirectLink");
        const codeNum = (0, generateCode_1.default)();
        const body = lodash_1.default.pick(req.body, ["email", "password"]);
        let user = yield user_model_1.default.findOne({ email: body.email });
        if (!user)
            return next(new appError_1.default("email does not exist", 400));
        if (req.user.id != user._id)
            return next(new appError_1.default("you are not allowed", 403));
        const matchPassword = yield bcryptjs_1.default.compare(body.password, user.password);
        if (!matchPassword)
            return next(new appError_1.default("Invalid Password", 400));
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY + user.password, { expiresIn: "10m" });
        const link = {
            id: user._id,
            token: token,
        };
        user.passCode = codeNum;
        yield user.save();
        (0, user_email_1.default)({
            email: user.email,
            redirectLink,
            codeNum,
            subject: "Change Password",
        });
        return res.status(200).json({
            message: "The code has been sent to your email, please check your email",
            link,
        });
    });
});
/**
 *  @description Set New Password User
 *  @route /api/auth/set-new-password:id/:token
 *  @method Put
 *  @access public
 */
AuthController.setNewPassword = (0, catchError_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        let user = yield user_model_1.default.findById(userId);
        if (!user)
            return next(new appError_1.default("email is not existing", 404));
        const body = lodash_1.default.pick(req.body, ["password", "code"]);
        if (req.user.id != user._id)
            return next(new appError_1.default("you are not allowed", 403));
        const token = jsonwebtoken_1.default.verify(req.params.token, process.env.JWT_SECRET_KEY + user.password);
        if (user.passCode != body.code)
            return next(new appError_1.default("code is incorrect", 400));
        user.password = yield bcryptjs_1.default.hash(body.password, Number(process.env.SALT));
        user.passCode = undefined;
        yield user.save();
        return res.status(200).json({ message: " Password changed successfully " });
    });
});
/**
 *  @description Confirm user email
 *  @route /api/auth/confirm/:token
 *  @method GET
 *  @access public
 */
AuthController.confirmEmail = (0, catchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    yield user_model_1.default.findOneAndUpdate({ email }, { isConfirm: true });
    res.status(200).json({ messag: "success" });
}));
exports.default = AuthController;
