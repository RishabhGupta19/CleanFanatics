import { Schema, model, Types } from "mongoose";
import { BookingStatus, BookingEvent } from "./booking.types";

/* ============================
   MONGOOSE DOCUMENT INTERFACE
============================ */

export interface BookingDocument {
  customer: Types.ObjectId;
  provider?: Types.ObjectId | null;

  /** 🔴 matches frontend + controller */
  serviceTypeId: string;

  scheduledDate: Date;

  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    unit?: string;
    notes?: string;
  };

  notes?: string;
  totalPrice: number;
  status: BookingStatus;
  events: BookingEvent[];
 
  createdAt: Date;
  updatedAt: Date;
   rejectedProviders?: Types.ObjectId[];
}

/* ============================
   EVENT SUB-SCHEMA
============================ */

const bookingEventSchema = new Schema<BookingEvent>(
  {
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
    },
    changedBy: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    
  },
  { _id: false }
);

/* ============================
   ADDRESS SUB-SCHEMA
============================ */

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    unit: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

/* ============================
   BOOKING SCHEMA
============================ */

const bookingSchema = new Schema<BookingDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    serviceTypeId: {
      type: String,
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    address: {
      type: addressSchema,
      required: true,
    },

    notes: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
    },

    events: {
      type: [bookingEventSchema],
      default: [],
    },
    
    rejectedProviders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ], 
  },
  { timestamps: true }
  
);

/* ============================
   MODEL
============================ */

export const Booking = model<BookingDocument>("Booking", bookingSchema);
