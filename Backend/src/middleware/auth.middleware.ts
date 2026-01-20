

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { UserRole } from "../config/roles";

interface JwtPayload {
  id: string;
  role: UserRole;
}

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authorization token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid or expired token"
    });
  }
};
