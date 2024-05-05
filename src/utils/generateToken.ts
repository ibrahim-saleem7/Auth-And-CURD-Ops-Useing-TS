import jwt from "jsonwebtoken";
function generateToken(payload: any) {
  const secret: any = process.env.JWT_SECRET_KEY;
  return jwt.sign(payload, secret);
}

export default generateToken;
