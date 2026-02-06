import jwt from "jsonwebtoken";
import { PayloadUserType } from "../models/user.model";
import { ENV } from "./env";

// access token
export const generateAccessToken = (payload: PayloadUserType) => {
  return jwt.sign(payload, ENV.SECRET_KEY, { expiresIn: "1d" });
};

// verify token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.SECRET_KEY);
};
