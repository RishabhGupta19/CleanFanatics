import { Booking } from "./booking.model";
import { BookingStatus, CreateBookingDTO } from "./booking.types";
import { canTransition } from "./booking.transitions";
import { Types } from "mongoose";
import { UserRole } from "../../config/roles";

export const createBooking = async (
  customerId: string,
  data: CreateBookingDTO
) => {
  return Booking.create({
    customer: customerId,
    serviceTypeId: data.serviceTypeId,
    scheduledDate: new Date(data.scheduledDate),
    status: BookingStatus.PENDING,
    events: [
      {
        status: BookingStatus.PENDING,
        changedBy: UserRole.CUSTOMER
      }
    ]
  });
};

export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus,
  changedBy: UserRole | "SYSTEM" | "ADMIN_OVERRIDE",
  note?: string
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (changedBy !== "ADMIN_OVERRIDE") {
    if (!canTransition(booking.status, newStatus)) {
      throw new Error("Invalid booking status transition");
    }
  }

  booking.status = newStatus;
  booking.events.push({
    status: newStatus,
    changedBy,
    note,
    timestamp: new Date()
  });

  return booking.save();
};

export const assignProvider = async (
  bookingId: string,
  providerId: string
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.provider = new Types.ObjectId(providerId);
  booking.status = BookingStatus.ASSIGNED;
  booking.events.push({
  status: BookingStatus.ASSIGNED,
  changedBy: "SYSTEM",
  timestamp: new Date()
});


  return booking.save();
};

export const getBookingEvents = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).select("events");
  if (!booking) throw new Error("Booking not found");
  return booking.events;
};
