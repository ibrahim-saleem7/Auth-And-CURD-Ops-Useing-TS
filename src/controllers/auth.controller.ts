import bcrypt from "bcryptjs";
import _ from "lodash";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsyncError from "../middlewares/catchError";
import httpStatusText from "../utils/httpStatusText";
import sendEmail from "../emails/user.email";
import userModel from "../models/user.model";
import loginFunction from "../utils/loginFunction";
import generateCode from "../utils/generateCode";

class AuthController {
  /**
   *  @description add new admin
   *  @route /api/admin/
   *  @method POST
   *  @access private (Super Admin)
   */

  static signUp = catchAsyncError(
    async (req: Request, res: Response, next: any) => {
      const redirectLink: any = req.header("redirectLink");
      const requiredFields: any = ["name", "email", "password", "image"];
      const body: any = _.pick(req.body, requiredFields);

      if (!body) return next(new AppError(httpStatusText.BADREQUEST, 400));

      const existingUser: any = await userModel.findOne({ email: body.email });
      if (existingUser)
        return next(new AppError("user has already found", 409));

      body.password = await bcrypt.hash(
        body.password,
        Number(process.env.SALT)
      );

      const { image }: any = req.files;
      if (!image) return next(new AppError("Missing Image", 400));
      body.image = await image[0].filename;

      const user = await userModel.create(body);

      sendEmail({
        email: body.email,
        redirectLink,
        subject: "Email Confirmation",
      });
      return res.status(201).json({
        message: `${user.name} registered successfully please check your mail to confirm your account`,
      });
    }
  );

  /**
   *  @description Login The User
   *  @route /api/auth/login
   *  @method POST
   *  @access public
   */

  static login = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    const body = _.pick(req.body, ["email", "password"]);

    const user = await userModel.findOne({ email: body.email });

    if (user) return loginFunction(body, user, res, next);

    return next(new AppError("Invalid email or password", 400));
  });

  /**
   *  @description Forgot Password User
   *  @route /api/auth/forgot-password
   *  @method POST
   *  @access public
   */

  static forgotPassword = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    const redirectLink = req.header("redirectLink");
    const codeNum = generateCode();

    const email: string = req.body.email;
    let user = await userModel.findOne({ email: email });

    if (!user) return next(new AppError("email does not exist", 404));

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY + user.password,
      { expiresIn: "10m" }
    );
    const link = {
      id: user._id,
      token: token,
    };

    user.passCode = codeNum;
    await user.save();

    sendEmail({ email, redirectLink, codeNum, subject: "Forget Password" });
    return res.status(200).json({
      message: "The code has been sent to your email, please check your email",
      link,
    });
  });

  /**
   *  @description Reset Password User
   *  @route /api/auth/reset-password/:id/:token
   *  @method POST
   *  @access public
   */

  static resetPassword = catchAsyncError(async function (
    req: Request,
    res: Response,
    next: any
  ) {
    let user = await userModel.findById(req.params.id);

    if (!user) return next(new AppError("email does not exist", 404));

    const body = _.pick(req.body, ["password", "code"]);

    const toke: any = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET_KEY + user.password
    );

    if (user.passCode != body.code)
      return next(new AppError("code is incorrect", 400));

    user.password = await bcrypt.hash(body.password, Number(process.env.SALT));
    user.passCode = undefined;
    await user.save();

    return res.status(201).json({
      email: user.email,
      message: "The password is reset successfully",
    });
  });

  /**
   *  @description Change Password User
   *  @route /api/auth/change-password
   *  @method POST
   *  @access public
   */

  static changePassword = catchAsyncError(async function (
    req: Request | any,
    res: Response,
    next: any
  ) {
    const redirectLink = req.header("redirectLink");
    const codeNum = generateCode();

    const body = _.pick(req.body, ["email", "password"]);
    let user = await userModel.findOne({ email: body.email });

    if (!user) return next(new AppError("email does not exist", 400));

    if (req.user.id != user._id)
      return next(new AppError("you are not allowed", 403));

    const matchPassword = await bcrypt.compare(body.password, user.password);
    if (!matchPassword) return next(new AppError("Invalid Password", 400));

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY + user.password,
      { expiresIn: "10m" }
    );
    const link = {
      id: user._id,
      token: token,
    };

    user.passCode = codeNum;
    await user.save();

    sendEmail({
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

  /**
   *  @description Set New Password User
   *  @route /api/auth/set-new-password:id/:token
   *  @method Put
   *  @access public
   */

  static setNewPassword = catchAsyncError(async function (
    req: Request | any,
    res: Response,
    next: any
  ) {
    const userId = req.params.id;
    let user = await userModel.findById(userId);

    if (!user) return next(new AppError("email is not existing", 404));

    const body = _.pick(req.body, ["password", "code"]);

    if (req.user.id != user._id)
      return next(new AppError("you are not allowed", 403));

    const token = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET_KEY + user.password
    );

    if (user.passCode != body.code)
      return next(new AppError("code is incorrect", 400));

    user.password = await bcrypt.hash(body.password, Number(process.env.SALT));
    user.passCode = undefined;
    await user.save();

    return res.status(200).json({ message: " Password changed successfully " });
  });

  /**
   *  @description Confirm user email
   *  @route /api/auth/confirm/:token
   *  @method GET
   *  @access public
   */
  static confirmEmail = catchAsyncError(
    async (req: Request | any, res: Response) => {
      const email = req.email;
      await userModel.findOneAndUpdate({ email }, { isConfirm: true });
      res.status(200).json({ messag: "success" });
    }
  );
}

export default AuthController;
