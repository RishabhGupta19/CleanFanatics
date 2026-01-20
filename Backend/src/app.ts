import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import adminRoutes from "./modules/admin/admin.routes";
import serviceTypeRoutes from "./modules/serviceTypes/serviceType.routes";
import providerRoutes from "./modules/providers/provider.routes";



import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

/* -------------------- Global Middlewares -------------------- */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* -------------------- Health Check -------------------- */
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/service-types", serviceTypeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/providers", providerRoutes);
/* -------------------- 404 Handler -------------------- */
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Route not found"
  });
});

/* -------------------- Error Handler -------------------- */
app.use(errorHandler);

export default app;
