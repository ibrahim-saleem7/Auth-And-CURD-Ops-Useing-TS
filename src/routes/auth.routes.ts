import express from "express";
import fileUpload from "../utils/fileUpload";
import validation from "../middlewares/validation";
import AuthController from "../controllers/auth.controller";
import Auth from "../validations/auth.validation";
import limiter from "../middlewares/limiter";
import Token from "../middlewares/verifyToken";

const router = express.Router();

// /api/auth/signup
router.post(
  "/signup",
  fileUpload("image"),
  validation(Auth.signup),
  AuthController.signUp
);

// /api/auth/login
router.post(
  "/login",
  limiter(4, true),
  validation(Auth.login),
  AuthController.login
);

// /api/auth/forgot-password'
router.post(
  "/forgot-password",
  limiter(4, false),
  validation(Auth.email),
  AuthController.forgotPassword
);

// /api/auth//reset-password/:id/:token
router.post(
  "/reset-password/:id/:token",
  validation(Auth.setNewPassword),
  AuthController.resetPassword
);

// /api/auth/change-password
router.post(
  "/change-password",
  limiter(3, false),
  Token.verifyToken,
  validation(Auth.login),
  AuthController.changePassword
);

// /api/auth/set-new-password/:id/:token
router.put(
  "/set-new-password/:id/:token",
  Token.authUserAndAdmin(["all"]),
  validation(Auth.setNewPassword),
  AuthController.setNewPassword
);

// /api/auth/confirm/:token
router.get(
  "/confirm/:token",
  Token.verifyEmailToken,
  AuthController.confirmEmail
);

export default router;
