import { Schema, model, Document } from "mongoose";
import { UserRole } from "../../config/roles";

export interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  serviceArea?: string | null;
}

const userSchema = new Schema<UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false // VERY important
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true
    },
    serviceArea: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Ensure providers must have serviceArea
 */
userSchema.pre("save", function () {
  if (this.role === UserRole.PROVIDER && !this.serviceArea) {
    throw new Error("Provider must have serviceArea");
  }
});


export const User = model<UserModel>("User", userSchema);
