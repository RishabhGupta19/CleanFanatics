import { Router } from "express";
import * as controller from "./admin.controller";
import { auth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { UserRole } from "../../config/roles";

const router = Router();

router.use(auth);
router.use(requireRole(UserRole.ADMIN));

router.get("/stats", controller.getDashboardStats);
router.post("/bookings/:id/assign", controller.assignProvider);
router.post("/bookings/:id/override", controller.overrideBookingStatus);

export default router;
