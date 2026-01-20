// import { Router } from "express";
// import * as controller from "./booking.controller";
// import { auth } from "../../middleware/auth.middleware";

// const router = Router();

// router.post("/", auth, controller.createBooking);
// router.patch("/:id/status", auth, controller.updateStatus);
// router.post("/:id/cancel", auth, controller.cancelBooking);
// router.post("/:id/accept", auth, controller.acceptJob);
// router.post("/:id/reject", auth, controller.rejectJob);
// router.post("/:id/retry", auth, controller.retryBooking);
// router.get("/:id/events", auth, controller.getEvents);

// export default router;

import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  retryBooking,
  acceptJob,
  rejectJob,
  getBookingEvents,
} from "./booking.controller";
import { auth } from "../../middleware/auth.middleware";

const router = Router();

/** CREATE booking */
router.post("/", auth, createBooking);

/** 🔴 THIS IS REQUIRED (your 404 is here) */
router.get("/", auth, getBookings);

/** GET booking by id */
router.get("/:id", auth, getBookingById);

/** STATUS updates */
router.patch("/:id/status", auth, updateBookingStatus);
router.post("/:id/cancel", auth, cancelBooking);
router.post("/:id/retry", auth, retryBooking);

/** PROVIDER actions */
router.post("/:id/accept", auth, acceptJob);
router.post("/:id/reject", auth, rejectJob);

/** EVENTS */
router.get("/:id/events", auth, getBookingEvents);

export default router;
