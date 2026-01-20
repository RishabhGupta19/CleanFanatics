import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { ENV } from "../config/env";

export const signJwt = (
  payload: jwt.JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  const secret: Secret = ENV.JWT_SECRET;

  const options: SignOptions = {
    expiresIn
  };

  return jwt.sign(payload, secret, options);
};
