// import { Request, Response } from "express";
// import { Booking } from "../bookings/booking.model";
// import { BookingStatus } from "../bookings/booking.types";
// import * as bookingService from "../bookings/booking.service";

// /**
//  * GET /admin/stats
//  * Dashboard metrics
//  */
// export const getDashboardStats = async (_req: Request, res: Response) => {
//   const [total, completed, cancelled] = await Promise.all([
//     Booking.countDocuments(),
//     Booking.countDocuments({ status: BookingStatus.COMPLETED }),
//     Booking.countDocuments({ status: BookingStatus.CANCELLED })
//   ]);

//   res.json({
//     totalBookings: total,
//     completedBookings: completed,
//     cancelledBookings: cancelled
//   });
// };

// /**
//  * POST /admin/bookings/:id/assign
//  * Manually assign provider
//  */
// export const assignProvider = async (req: Request, res: Response) => {
//   try {
//     const booking = await bookingService.assignProvider(
//       req.params.id as string,
//       req.body.providerId
//     );
//     res.json(booking);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * POST /admin/bookings/:id/override
//  * Force booking status
//  */
// export const overrideBookingStatus = async (req: Request, res: Response) => {
//   try {
//     const booking = await bookingService.updateBookingStatus(
//       req.params.id as string,
//       req.body.status,
//       "ADMIN_OVERRIDE",
//       req.body.note || "Admin override"
//     );
//     res.json(booking);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };


import { Request, Response } from "express";
import { Booking } from "../bookings/booking.model";
import { User } from "../users/user.model";
import { BookingStatus } from "../bookings/booking.types";
import * as bookingService from "../bookings/booking.service";

/**
 * GET /admin/stats
 * Dashboard metrics
 */
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [total, completed, cancelled, rejected, noShow] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: BookingStatus.COMPLETED }),
      Booking.countDocuments({ status: BookingStatus.CANCELLED }),
      Booking.countDocuments({ status: BookingStatus.REJECTED }),
      Booking.countDocuments({ status: BookingStatus.PROVIDER_NO_SHOW }),
    ]);

    // ✅ Calculate total revenue from completed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { status: BookingStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // ✅ Count active providers
    const activeProviders = await User.countDocuments({ 
      role: "PROVIDER",
      // Add any additional active criteria you have
    });

    // ✅ Calculate bookings needing attention
    const requiresAttention = rejected + noShow;

    // ✅ Get bookings by status
    const bookingsByStatus: Record<BookingStatus, number> = {
      [BookingStatus.PENDING]: await Booking.countDocuments({ status: BookingStatus.PENDING }),
      [BookingStatus.ASSIGNED]: await Booking.countDocuments({ status: BookingStatus.ASSIGNED }),
      [BookingStatus.IN_PROGRESS]: await Booking.countDocuments({ status: BookingStatus.IN_PROGRESS }),
      [BookingStatus.COMPLETED]: completed,
      [BookingStatus.CANCELLED]: cancelled,
      [BookingStatus.REJECTED]: rejected,
      [BookingStatus.PROVIDER_NO_SHOW]: noShow,
      [BookingStatus.RE_ASSIGNED]: await Booking.countDocuments({ status: BookingStatus.RE_ASSIGNED }),
    };

    res.json({
      totalBookings: total,
      activeProviders,
      totalRevenue, // ✅ Now properly calculated
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageRating: 4.5, // ✅ You can calculate this from your ratings system
      requiresAttention,
      bookingsByStatus,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /admin/bookings/:id/assign
 * Manually assign provider
 */
export const assignProvider = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.assignProvider(
      req.params.id as string,
      req.body.providerId
    );
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * POST /admin/bookings/:id/override
 * Force booking status
 */
export const overrideBookingStatus = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.updateBookingStatus(
      req.params.id as string,
      req.body.status,
      "ADMIN_OVERRIDE",
      req.body.note || "Admin override"
    );
    res.json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};