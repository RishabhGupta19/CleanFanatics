import { Schema, model } from "mongoose";
import { ServiceCategory } from "../bookings/booking.types";

export interface ServiceTypeDocument {
  name: string;
  category: ServiceCategory;
  basePrice: number; // stored in PAISA
}

const serviceTypeSchema = new Schema<ServiceTypeDocument>({
  name: { type: String, required: true },
  category: { type: String, enum: Object.values(ServiceCategory), required: true },
  basePrice: { type: Number, required: true },
});

export const ServiceType = model<ServiceTypeDocument>(
  "ServiceType",
  serviceTypeSchema
);
