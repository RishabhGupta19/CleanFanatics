import { Router } from "express";
import { getServiceTypes } from "./serviceType.controller";

const router = Router();

router.get("/", getServiceTypes);

export default router;
