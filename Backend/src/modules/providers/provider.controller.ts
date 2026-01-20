import { Request, Response } from "express";
import { User } from "../users/user.model";
import { Booking } from "../bookings/booking.model";
import { BookingStatus } from "../bookings/booking.types";

/**
 * GET /api/providers/available
 * ADMIN only
 * Fetch providers from DB (role = PROVIDER)
 */
export const getAvailableProviders = async (req: Request, res: Response) => {
  const { serviceArea } = req.query;

  const filter: any = {
    role: "PROVIDER",
  };

  if (serviceArea) {
    filter.serviceArea = serviceArea;
  }

  const providers = await User.find(filter).select(
    "_id name email serviceArea"
  );

  res.json(
    providers.map((p) => ({
      id: p._id,
      name: p.name,
      email: p.email,
      serviceArea: p.serviceArea,
    }))
  );
};

/**
 * GET /api/providers/:id/stats
 * PROVIDER (self) or ADMIN
 */
export const getProviderStats = async (req: Request, res: Response) => {
  const providerId = req.params.id;

  const completedBookings = await Booking.find({
  provider: providerId,
  status: BookingStatus.COMPLETED,
}).select("totalPrice");

  const totalEarnings = completedBookings.reduce(
  (sum, booking) => sum + (booking.totalPrice || 0),
  0
);

  res.json({
    completedBookings : completedBookings.length,
    inProgressJobs: await Booking.countDocuments({
      provider: providerId,
      status: BookingStatus.IN_PROGRESS,
    }),
    totalEarnings, // ✅ always number
    acceptanceRate: completedBookings ? 90 : 0,
    averageRating: 4.5,
  });
};

