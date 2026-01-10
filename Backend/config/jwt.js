import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};