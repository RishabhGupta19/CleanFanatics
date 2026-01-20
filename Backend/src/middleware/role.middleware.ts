import { Request, Response, NextFunction } from "express";
import { UserRole } from "../config/roles";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        message: "Forbidden: insufficient permissions"
      });
    }

    next();
  };
