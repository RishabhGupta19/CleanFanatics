import { UserRole } from "../../config/roles";

/* ============================
   ENUMS
============================ */

export enum BookingStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  PROVIDER_NO_SHOW = "PROVIDER_NO_SHOW",
  RE_ASSIGNED = "RE_ASSIGNED",
}

export enum ServiceCategory {
  CLEANING = "CLEANING",
  REPAIR_MAINTENANCE = "REPAIR_MAINTENANCE",
  BEAUTY_WELLNESS = "BEAUTY_WELLNESS",
}

/* ============================
   ADDRESS
============================ */

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  unit?: string;
  notes?: string;
}

/* ============================
   EVENTS
============================ */

export interface BookingEvent {
  status: BookingStatus;
  changedBy: UserRole | "SYSTEM" | "ADMIN_OVERRIDE";
  note?: string;
  timestamp: Date;
}

/* ============================
   BOOKING (DOMAIN TYPE)
============================ */

export interface Booking {
  customer: string;
  provider?: string;

  /** 🔴 MUST MATCH FRONTEND + SCHEMA */
  serviceTypeId: string;

  status: BookingStatus;
  scheduledDate: Date;
  address: Address;
  notes?: string;
  events: BookingEvent[];
}

/* ============================
   CREATE BOOKING DTO (USED)
============================ */

export interface CreateBookingDTO {
  serviceTypeId: string;
  scheduledDate: string;
  address: Address;
  notes?: string;
}
