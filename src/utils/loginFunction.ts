import bcrypt from "bcryptjs";
import { Response } from "express";
import AppError from "./appError";
import generateToken from "./generateToken";

async function login(body: any, user: any, res: Response, next: any) {
  if (!user.isConfirm)
    return next(new AppError("please confirm your account", 403));

  const matchPassword = await bcrypt.compare(body.password, user.password);

  if (!matchPassword)
    return next(new AppError("Invalid email or password", 400));

  const token: any = generateToken({ id: user._id, name: user.name });

  return res.status(200).json({ id: user._id, token: token });
}

export default login;
