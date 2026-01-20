import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: "Registration successful" });
  } catch (error: any) {
    res.status(400).json({
      statusCode: 400,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({
      statusCode: 401,
      message: error.message
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  // JWT is stateless – frontend removes token
  res.status(200).json({ message: "Logged out successfully" });
};
