import { Request, Response } from "express";
import { SERVICE_TYPES } from "./serviceTypes.data";

export const getServiceTypes = (_req: Request, res: Response) => {
  res.json(SERVICE_TYPES);
};
