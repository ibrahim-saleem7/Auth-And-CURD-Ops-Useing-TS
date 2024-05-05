"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = __importDefault(require("../utils/fileUpload"));
const validation_1 = __importDefault(require("../middlewares/validation"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_validation_1 = __importDefault(require("../validations/auth.validation"));
const limiter_1 = __importDefault(require("../middlewares/limiter"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const router = express_1.default.Router();
// /api/auth/signup
router.post("/signup", (0, fileUpload_1.default)("image"), (0, validation_1.default)(auth_validation_1.default.signup), auth_controller_1.default.signUp);
// /api/auth/login
router.post("/login", (0, limiter_1.default)(4, true), (0, validation_1.default)(auth_validation_1.default.login), auth_controller_1.default.login);
// /api/auth/forgot-password'
router.post("/forgot-password", (0, limiter_1.default)(4, false), (0, validation_1.default)(auth_validation_1.default.email), auth_controller_1.default.forgotPassword);
// /api/auth//reset-password/:id/:token
router.post("/reset-password/:id/:token", (0, validation_1.default)(auth_validation_1.default.setNewPassword), auth_controller_1.default.resetPassword);
// /api/auth/change-password
router.post("/change-password", (0, limiter_1.default)(3, false), verifyToken_1.default.verifyToken, (0, validation_1.default)(auth_validation_1.default.login), auth_controller_1.default.changePassword);
// /api/auth/set-new-password/:id/:token
router.put("/set-new-password/:id/:token", verifyToken_1.default.authUserAndAdmin(["all"]), (0, validation_1.default)(auth_validation_1.default.setNewPassword), auth_controller_1.default.setNewPassword);
// /api/auth/confirm/:token
router.get("/confirm/:token", verifyToken_1.default.verifyEmailToken, auth_controller_1.default.confirmEmail);
exports.default = router;
