

// import { Request, Response } from "express";
// import { Types } from "mongoose";
// import { Booking } from "./booking.model";
// import { BookingStatus } from "./booking.types";
// import { canTransition } from "./booking.transitions";
// import { UserRole } from "../../config/roles";
// import { ServiceType } from "../serviceTypes/serviceType.model";

// /**
//  * CREATE BOOKING
//  * POST /api/bookings
//  */
// function transformBooking(booking: any) {
//   const obj = booking.toObject ? booking.toObject() : booking;
//   return {
//     ...obj,
//     id: obj._id?.toString() || obj.id,
//     customerId: obj.customerId || obj.customer?._id?.toString(),
//     providerId: obj.providerId || obj.provider?._id?.toString(),
//     serviceTypeId: obj.serviceTypeId || obj.serviceType?._id?.toString(),
//     totalPrice: obj.totalPrice || 0, 
//     // Remove _id from response if you prefer clean IDs
//     _id: undefined,
//   };
// }
// const mapBooking = (booking: any) => {
//   const obj = booking.toObject ? booking.toObject() : booking;
//   return {
//     ...obj,
//     id: obj._id.toString(),
//      totalPrice: obj.totalPrice || 0,
//   };
// };


// export const createBooking = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//      const serviceTypeId = req.body.serviceTypeId;
//    const serviceType = await ServiceType.findById(req.body.serviceTypeId);

// if (!serviceType) {
//   return res.status(400).json({ message: "Invalid service type" });
// }

// const totalPrice = serviceType.basePrice;

//     const booking = await Booking.create({
//       customer: req.user.id,
//       serviceTypeId: req.body.serviceTypeId,
//       scheduledDate: req.body.scheduledDate,
//       address: req.body.address,
//       notes: req.body.notes,
//       totalPrice: serviceType.basePrice,
//       status: BookingStatus.PENDING,
//       events: [
//         {
//           status: BookingStatus.PENDING,
//           changedBy: req.user.role,
//           timestamp: new Date(),
//         },
//       ],
//     });

//     res.status(201).json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * GET BOOKINGS (with filters + pagination)
//  * GET /api/bookings
//  */
// export const getBookings = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const {
//       scope = "mine", // mine | all
//       status,
//       page = "1",
//       limit = "20",
//     } = req.query;

//     const query: any = {};

//     // CUSTOMER → always own bookings
//     if (req.user.role === UserRole.CUSTOMER) {
//       query.customer = req.user.id;
//     }

//     // PROVIDER LOGIC
//     if (req.user.role === UserRole.PROVIDER) {
//   if (scope === "mine") {
//     // My Jobs → only jobs assigned to me
//     query.provider = req.user.id;
//   } else {
//     // Available Jobs → exclude jobs I already rejected
//     query.$and = [
//       { status: BookingStatus.PENDING },
//       {
//         $or: [
//           { rejectedProviders: { $exists: false } },
//           { rejectedProviders: { $ne: req.user.id } },
//         ],
//       },
//     ];
//   }
// }


//     // ADMIN → sees everything

//     if (status) query.status = status;

//     const pageNum = Number(page);
//     const limitNum = Number(limit);

//     const bookings = await Booking.find(query)
//       .populate("provider", "name")
//       .sort({ createdAt: -1 })
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);

//     const total = await Booking.countDocuments(query);
//     const transformedBookings = bookings.map(transformBooking);
//     res.json({
//        data: transformedBookings,
//       total: transformedBookings.length,
//       page: pageNum,
//       limit: limitNum,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };


// /**
//  * GET BOOKING BY ID
//  * GET /api/bookings/:id
//  */
// export const getBookingById = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id )
//     .populate("provider", "name");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Access control
//     if (
//       req.user.role === UserRole.CUSTOMER &&
//       booking.customer.toString() !== req.user.id
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     if (
//       req.user.role === UserRole.PROVIDER &&
//       booking.provider?.toString() !== req.user.id
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * UPDATE BOOKING STATUS
//  * PATCH /api/bookings/:id/status
//  */
// export const updateBookingStatus = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const { status, reason } = req.body;

//     const booking = await Booking.findById(req.params.id as string);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Admin override allowed
//     if (req.user.role !== UserRole.ADMIN) {
//       if (!canTransition(booking.status, status)) {
//         return res.status(400).json({ message: "Invalid status transition" });
//       }
//     }

//     booking.status = status;
//     booking.events.push({
//       status,
//       changedBy:
//         req.user.role === UserRole.ADMIN ? "ADMIN_OVERRIDE" : req.user.role,
//       note: reason,
//       timestamp: new Date(),
//     });

//     await booking.save();
//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * CANCEL BOOKING
//  * POST /api/bookings/:id/cancel
//  */
// export const cancelBooking = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id as string);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     booking.status = BookingStatus.CANCELLED;
//     booking.events.push({
//       status: BookingStatus.CANCELLED,
//       changedBy: req.user.role,
//       note: req.body.reason,
//       timestamp: new Date(),
//     });

//     await booking.save();
//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * RETRY BOOKING
//  * POST /api/bookings/:id/retry
//  */
// export const retryBooking = async (req: Request, res: Response) => {
//   if (!req.user || req.user.role !== UserRole.ADMIN) {
//     return res.status(403).json({ message: "Admin only" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id as string);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     booking.status = BookingStatus.RE_ASSIGNED;
//     booking.provider = undefined;
//     booking.events.push({
//       status: BookingStatus.RE_ASSIGNED,
//       changedBy: "SYSTEM",
//       timestamp: new Date(),
//     });

//     await booking.save();
//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * PROVIDER ACCEPT JOB
//  * POST /api/bookings/:id/accept
//  */
// export const acceptJob = async (req: Request, res: Response) => {
//   if (!req.user || req.user.role !== UserRole.PROVIDER) {
//     return res.status(403).json({ message: "Provider only" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id as string);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     booking.provider = new Types.ObjectId(req.user.id);
//     booking.status = BookingStatus.ASSIGNED;
//     booking.events.push({
//       status: BookingStatus.ASSIGNED,
//       changedBy: req.user.role,
//       timestamp: new Date(),
//     });

//     await booking.save();
//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * PROVIDER REJECT JOB
//  * POST /api/bookings/:id/reject
//  */
// // export const rejectJob = async (req: Request, res: Response) => {
// //   if (!req.user || req.user.role !== UserRole.PROVIDER) {
// //     return res.status(403).json({ message: "Provider only" });
// //   }

// //   try {
// //     const booking = await Booking.findById(req.params.id as string);
// //     if (!booking) {
// //       return res.status(404).json({ message: "Booking not found" });
// //     }

// //     booking.status = BookingStatus.REJECTED;
// //     booking.events.push({
// //       status: BookingStatus.REJECTED,
// //       changedBy: req.user.role,
// //       note: req.body.reason,
// //       timestamp: new Date(),
// //     });

// //     await booking.save();
// //     res.json(mapBooking(booking));
// //   } catch (err: any) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// export const rejectJob = async (req: Request, res: Response) => {
//   if (!req.user || req.user.role !== UserRole.PROVIDER) {
//     return res.status(403).json({ message: "Provider only" });
//   }

//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // ⛔ Provider should NOT change booking status
//     // ⛔ Booking stays PENDING

//     // Prevent duplicate rejection
//     if (!booking.rejectedProviders) {
//       booking.rejectedProviders = [];
//     }

//     const alreadyRejected = booking.rejectedProviders.some(
//       (id) => id.toString() === req.user!.id
//     );

//     if (!alreadyRejected) {
//       booking.rejectedProviders.push(new Types.ObjectId(req.user.id));
//     }

//     booking.events.push({
//       status: BookingStatus.PENDING,
//       changedBy: req.user.role,
//       note: "Provider rejected job",
//       timestamp: new Date(),
//     });

//     await booking.save();
//     res.json(mapBooking(booking));
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };

// /**
//  * GET BOOKING EVENTS
//  * GET /api/bookings/:id/events
//  */
// export const getBookingEvents = async (req: Request, res: Response) => {
//   try {
//     const booking = await Booking.findById(req.params.id as string).select(
//       "events"
//     );
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.json(booking.events);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };




import { Request, Response } from "express";
import { Types } from "mongoose";
import { Booking } from "./booking.model";
import { BookingStatus } from "./booking.types";
import { canTransition } from "./booking.transitions";
import { UserRole } from "../../config/roles";
import { SERVICE_TYPES } from "../serviceTypes/serviceTypes.data";

/* ============================================================
   NORMALIZER – SINGLE RESPONSE SHAPE (CRITICAL)
============================================================ */
const mapBooking = (booking: any) => {
  const obj = booking.toObject ? booking.toObject() : booking;

  return {
    id: obj._id.toString(),
    customerId: obj.customer?.toString?.() || obj.customer,
    providerId: obj.provider?._id?.toString?.() || obj.provider || null,
     customer: obj.customer?.name
      ? {
          id: obj.customer._id.toString(),
          name: obj.customer.name,
          email: obj.customer.email,
        }
      : null,
    provider: obj.provider?.name
      ? {
          id: obj.provider._id.toString(),
          name: obj.provider.name,
        }
      : null,

    serviceTypeId: obj.serviceTypeId,
    scheduledDate: obj.scheduledDate,
    address: obj.address,
    notes: obj.notes,
    status: obj.status,
    totalPrice: obj.totalPrice ?? 0,
    events: obj.events ?? [],
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

/* ============================================================
   CREATE BOOKING
============================================================ */
export const createBooking = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { serviceTypeId, scheduledDate, address, notes } = req.body;

    const serviceType = SERVICE_TYPES.find(s => s.id === serviceTypeId);
    if (!serviceType) {
      return res.status(400).json({ message: "Invalid service type" });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      serviceTypeId,
      scheduledDate,
      address,
      notes,
      totalPrice: serviceType.basePrice,
      status: BookingStatus.PENDING,
      rejectedProviders: [],
      events: [
        {
          status: BookingStatus.PENDING,
          changedBy: req.user.role,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   GET BOOKINGS (CUSTOMER / PROVIDER / ADMIN)
============================================================ */
// export const getBookings = async (req: Request, res: Response) => {
//   if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const {
//       scope = "mine", // mine | all
//       status,
//       page = "1",
//       limit = "20",
//     } = req.query;

//     const query: any = {};

//     // CUSTOMER → always own bookings
//     if (req.user.role === UserRole.CUSTOMER) {
//       query.customer = req.user.id;
//     }

//     // PROVIDER
//     if (req.user.role === UserRole.PROVIDER) {
//       if (scope === "mine") {
//         query.provider = req.user.id;
//       } else {
//         query.status = BookingStatus.PENDING;
//         query.$or = [
//           { rejectedProviders: { $exists: false } },
//           { rejectedProviders: { $ne: req.user.id } },
//         ];
//       }
//     }

//     // ADMIN → sees everything

//     if (status) query.status = status;

//     const pageNum = Number(page);
//     const limitNum = Number(limit);

//     const bookings = await Booking.find(query)
//       .populate("provider", "name")
//       .sort({ createdAt: -1 })
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);

//     const total = await Booking.countDocuments(query);

//     res.json({
//       data: bookings.map(mapBooking),
//       total,
//       page: pageNum,
//       limit: limitNum,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// };


export const getBookings = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const {
      scope = "mine", // mine | all
      status,
      page = "1",
      limit = "20",
    } = req.query;

    const query: any = {};

    // CUSTOMER → always own bookings
    if (req.user.role === UserRole.CUSTOMER) {
      query.customer = req.user.id;
    }

    // PROVIDER
    if (req.user.role === UserRole.PROVIDER) {
      if (scope === "mine") {
        query.provider = req.user.id;
      } else {
        query.status = BookingStatus.PENDING;
        query.$or = [
          { rejectedProviders: { $exists: false } },
          { rejectedProviders: { $ne: req.user.id } },
        ];
      }
    }

    // ADMIN → sees everything

    if (status) query.status = status;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    // ✅ POPULATE both customer and provider
    const bookings = await Booking.find(query)
      .populate("customer", "name email phone") // ✅ Add customer population
      .populate("provider", "name email phone rating") // ✅ Add more provider fields
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    // ✅ Service type mapping - matches your controller prices
    const serviceTypeMap: Record<string, any> = {
      "cleaning-deep": { id: "cleaning-deep", name: "Deep Cleaning", basePrice: 15000 },
      "cleaning-kitchen": { id: "cleaning-kitchen", name: "Kitchen Cleaning", basePrice: 8000 },
      "cleaning-bathroom": { id: "cleaning-bathroom", name: "Bathroom Cleaning", basePrice: 6000 },
      "cleaning-windows": { id: "cleaning-windows", name: "Window Cleaning", basePrice: 7000 },
      "repair-electric": { id: "repair-electric", name: "Electrical Repair", basePrice: 12000 },
      "repair-plumbing": { id: "repair-plumbing", name: "Plumbing Repair", basePrice: 10000 },
      "repair-ac": { id: "repair-ac", name: "AC Repair", basePrice: 15000 },
      "beauty-haircut": { id: "beauty-haircut", name: "Haircut", basePrice: 5000 },
      "beauty-facial": { id: "beauty-facial", name: "Facial", basePrice: 8000 },
    };

    // ✅ Transform bookings to add serviceType data
    const transformedBookings = bookings.map((booking) => {
      const mapped = mapBooking(booking);
      
      // ✅ Add serviceType object
      return {
        ...mapped,
        serviceType: serviceTypeMap[mapped.serviceTypeId] || { 
          id: mapped.serviceTypeId,
          name: mapped.serviceTypeId?.replace("-", " ").toUpperCase() || "Unknown Service",
          basePrice: 10000 
        },
      };
    });

    res.json({
      data: transformedBookings, // ✅ Use transformed bookings
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err: any) {
    console.error("Get bookings error:", err); // ✅ Add logging
    res.status(400).json({ message: err.message });
  }
};
/* ============================================================
   GET BOOKING BY ID
============================================================ */
export const getBookingById = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const booking = await Booking.findById(req.params.id)
      .populate("provider", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      req.user.role === UserRole.CUSTOMER &&
      booking.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      req.user.role === UserRole.PROVIDER &&
      booking.provider?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   UPDATE BOOKING STATUS
============================================================ */
export const updateBookingStatus = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { status, reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== UserRole.ADMIN) {
      if (!canTransition(booking.status, status)) {
        return res.status(400).json({ message: "Invalid status transition" });
      }
    }

    booking.status = status;
    booking.events.push({
      status,
      changedBy:
        req.user.role === UserRole.ADMIN ? "ADMIN_OVERRIDE" : req.user.role,
      note: reason,
      timestamp: new Date(),
    });

    await booking.save();
    await booking.populate("provider", "name");

    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   CANCEL BOOKING (CUSTOMER / ADMIN)
============================================================ */
export const cancelBooking = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = BookingStatus.CANCELLED;
    booking.events.push({
      status: BookingStatus.CANCELLED,
      changedBy: req.user.role,
      note: req.body.reason,
      timestamp: new Date(),
    });

    await booking.save();
    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   RETRY BOOKING (ADMIN)
============================================================ */
export const retryBooking = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Admin only" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = BookingStatus.RE_ASSIGNED;
    booking.provider = undefined;
    booking.rejectedProviders = [];

    booking.events.push({
      status: BookingStatus.RE_ASSIGNED,
      changedBy: "SYSTEM",
      timestamp: new Date(),
    });

    await booking.save();
    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   PROVIDER ACCEPT JOB
============================================================ */
export const acceptJob = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== UserRole.PROVIDER) {
    return res.status(403).json({ message: "Provider only" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.provider = new Types.ObjectId(req.user.id);
    booking.status = BookingStatus.ASSIGNED;

    booking.events.push({
      status: BookingStatus.ASSIGNED,
      changedBy: req.user.role,
      timestamp: new Date(),
    });

    await booking.save();
    await booking.populate("provider", "name");

    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   PROVIDER REJECT JOB (SOFT REJECT)
============================================================ */
export const rejectJob = async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== UserRole.PROVIDER) {
    return res.status(403).json({ message: "Provider only" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.rejectedProviders) booking.rejectedProviders = [];

    const alreadyRejected = booking.rejectedProviders.some(
      (id: Types.ObjectId) => id.toString() === req.user!.id
    );

    if (!alreadyRejected) {
      booking.rejectedProviders.push(new Types.ObjectId(req.user.id));
    }

    booking.events.push({
      status: BookingStatus.PENDING,
      changedBy: req.user.role,
      note: "Provider rejected job",
      timestamp: new Date(),
    });

    await booking.save();
    res.json(mapBooking(booking));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   GET BOOKING EVENTS
============================================================ */
export const getBookingEvents = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id).select("events");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking.events);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
