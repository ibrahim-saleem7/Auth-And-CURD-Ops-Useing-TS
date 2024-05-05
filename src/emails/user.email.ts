import nodemailer from "nodemailer";
import AppError from "../utils/appError";
import passwordResetForgetFormat from "./email.password";
import generateToken from "../utils/generateToken";
import emailConfirmFormat from "./emailConfirmFormat";

/**
 *  @description Sends emails to users when confirm email or reset password
 *  @param {string} email - user email.
 *  @param {string} redirectLink - Frontend route to redirect user (in confirm case).
 *  @param {number} code - Code to verify (in resst password case).
 *  @param {string} subject - Email subject.
 * @returns {string} html email string
 */

const sendEmail = async ({ email, redirectLink, codeNum, subject }: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info: any = await transporter.sendMail(
    {
      from: `Ibrahim Saleem <${process.env.EMAIL}>`,
      to: email,
      subject: subject || "Saleem Email", // subject
      html: (function () {
        if (codeNum) {
          return passwordResetForgetFormat(codeNum);
        } else {
          const token = generateToken({ email });
          return emailConfirmFormat(token, redirectLink);
        }
      })(),
    },
    (error, success) => {
      if (error) {
        return new AppError(error.message, 400);
      }
      return { message: "Email sent successfully!" };
    }
  );
};

export default sendEmail;
