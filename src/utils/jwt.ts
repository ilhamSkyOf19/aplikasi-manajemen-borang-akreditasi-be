import jwt from "jsonwebtoken";
import { ENV } from "./env";
import { PayloadDosenType } from "../models/dosen.model";

// access token
export const generateAccessToken = (payload: PayloadDosenType) => {
  return jwt.sign(payload, ENV.SECRET_KEY, { expiresIn: "1d" });
};

// verify token
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.SECRET_KEY);
};
