import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { UserRole } from "../../config/roles";
import {
  getAvailableProviders,
  getProviderStats,
} from "./provider.controller";

const router = Router();

/**
 * GET /api/providers/available
 * ADMIN only
 */
router.get(
  "/available",
  auth,
  requireRole(UserRole.ADMIN), // ✅ FIX
  getAvailableProviders
);

/**
 * GET /api/providers/:id/stats
 * PROVIDER (self) or ADMIN
 */
router.get(
  "/:id/stats",
  auth,
  getProviderStats
);

export default router;
