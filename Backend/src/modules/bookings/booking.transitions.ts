import { BookingStatus } from "./booking.types";

export const ALLOWED_TRANSITIONS: Record<
  BookingStatus,
  BookingStatus[]
> = {
  [BookingStatus.PENDING]: [
    BookingStatus.ASSIGNED,
    BookingStatus.CANCELLED
  ],

  [BookingStatus.ASSIGNED]: [
    BookingStatus.IN_PROGRESS,
    BookingStatus.REJECTED,
    BookingStatus.CANCELLED
  ],

  [BookingStatus.IN_PROGRESS]: [
    BookingStatus.COMPLETED,
    BookingStatus.PROVIDER_NO_SHOW,
    BookingStatus.CANCELLED
  ],

  [BookingStatus.REJECTED]: [
    BookingStatus.RE_ASSIGNED
  ],

  [BookingStatus.PROVIDER_NO_SHOW]: [
    BookingStatus.RE_ASSIGNED
  ],

  [BookingStatus.RE_ASSIGNED]: [
    BookingStatus.ASSIGNED
  ],

  [BookingStatus.COMPLETED]: [],

  [BookingStatus.CANCELLED]: []
};

export const canTransition = (
  from: BookingStatus,
  to: BookingStatus
): boolean => {
  return ALLOWED_TRANSITIONS[from].includes(to);
};
