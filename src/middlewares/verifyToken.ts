import jwt from "jsonwebtoken";
import { Request, Response } from "express";

class Token {
  static verifyToken(req: Request | any, res: Response, next: any) {
    let token = req.headers.token;
    if (token) {
      try {
        const secret: any = process.env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ message: "Required Login" });
      }
    } else {
      return res.status(401).json({ message: "Required Login" });
    }
  }

  static authUserAndAdmin(permission: [string]) {
    return (req: Request | any, res: Response, next: any) => {
      Token.verifyToken(req, res, () => {
        const permissions = req?.user?.role?.permissions;
        if (
          req.user.id == req.params.id ||
          (req?.user?.type === "admin" && permissions.includes(...permission))
        ) {
          next();
        } else {
          return res.status(403).json({ message: "you are not allowed" });
        }
      });
    };
  }

  static authAdmin(permission: [string]) {
    return (req: Request | any, res: Response, next: any) => {
      Token.verifyToken(req, res, () => {
        if (!req.user?.role)
          return res.status(403).json({ message: "you are not allowed" });
        const permissions = req?.user?.role?.permissions;
        if (
          req?.user?.type === "admin" &&
          permissions.includes(...permission)
        ) {
          next();
        } else {
          return res.status(403).json({ message: "you are not allowed" });
        }
      });
    };
  }

  static verifyEmailToken = (req: Request | any, res: Response, next: any) => {
    const { token } = req.params;
    const secret: any = process.env.JWT_SECRET_KEY;
    jwt.verify(token, secret, async function (err: any, decoded: any) {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  };
}

export default Token;
