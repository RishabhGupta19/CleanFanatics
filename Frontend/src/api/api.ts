/**
 * =============================================================================
 * API LAYER - Centralized API functions for backend communication
 * =============================================================================
 */

import {
  Booking,
  BookingEvent,
  BookingStatus,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  AssignProviderRequest,
  ProviderStats,
  Provider,
  ServiceType,
  UserRole,
  DashboardStats,
  ApiError,
  PaginatedResponse,
  GetBookingsRequest,
} from "@/types/booking";



/* ============================================================================
   CONFIG
============================================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

/** 🔴 IMPORTANT: REAL BACKEND ENABLED */
let useMockData = false;

export const setUseMockData = (value: boolean) => {
  useMockData = value;
};

export const getUseMockData = (): boolean => {
  return useMockData;
};

/* ============================================================================
   FETCH HELPER
============================================================================ */
function transformMongoId<T extends { _id?: any; id?: string }>(obj: T): T {
  if (!obj) return obj;
  
  // If it's an array, transform each item
  if (Array.isArray(obj)) {
    return obj.map(transformMongoId) as any;
  }
  
  // If it's an object with _id, add/replace id
  if (obj._id) {
    return {
      ...obj,
      id: obj._id.toString ? obj._id.toString() : obj._id,
    };
  }
  
  return obj;
}
// async function fetchApi<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = localStorage.getItem("auth_token");

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//   });

//   if (!res.ok) {
//     const err: ApiError = await res.json().catch(() => ({
//       statusCode: res.status,
//       message: res.statusText,
//     }));
//     throw err;
//   }

//   if (res.status === 204) return null as T;
//   return res.json();
// }
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      statusCode: res.status,
      message: res.statusText,
    }));
    throw err;
  }

  if (res.status === 204) return null as T;
  
  const data = await res.json();
  
  // ✅ Transform MongoDB IDs to standard ids
  return transformMongoId(data);
}


/* ============================================================================
   AUTH
============================================================================ */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  serviceArea?: string;
}

export async function register(
  data: RegisterRequest
): Promise<{ message: string }> {
  return fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: any }> {
  const res = await fetchApi<{ token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  /** 🔴 STORE TOKEN */
  localStorage.setItem("auth_token", res.token);

  return res;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("auth_token");
  await fetchApi("/auth/logout", { method: "POST" });
}

/* ============================================================================
   BOOKINGS
============================================================================ */

export async function createBooking(
  data: CreateBookingRequest
): Promise<Booking> {
  return fetchApi("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getBookings(
  params: GetBookingsRequest = {}
): Promise<PaginatedResponse<Booking>> {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return fetchApi(`/bookings?${qs}`);
}

export async function getBookingById(id: string): Promise<Booking> {
  return fetchApi(`/bookings/${id}`);
}

export async function updateBookingStatus(
  data: UpdateBookingStatusRequest
): Promise<Booking> {
  return fetchApi(`/bookings/${data.bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: data.status,
      reason: data.reason,
    }),
  });
}

export async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<Booking> {
  return fetchApi(`/bookings/${bookingId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function retryBooking(bookingId: string): Promise<Booking> {
  return fetchApi(`/bookings/${bookingId}/retry`, { method: "POST" });
}

export async function getBookingEvents(
  bookingId: string
): Promise<BookingEvent[]> {
  return fetchApi(`/bookings/${bookingId}/events`);
}

/* ============================================================================
   PROVIDER
============================================================================ */

export async function acceptJob(bookingId: string): Promise<Booking> {
  return fetchApi(`/bookings/${bookingId}/accept`, { method: "POST" });
}

export async function rejectJob(
  bookingId: string,
  reason: string
): Promise<Booking> {
  return fetchApi(`/bookings/${bookingId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function getProviderStats(
  providerId: string
): Promise<ProviderStats> {
  return fetchApi(`/providers/${providerId}/stats`);
}

export async function getAvailableProviders(
  category?: string,
  serviceArea?: string
): Promise<Provider[]> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (serviceArea) params.append("serviceArea", serviceArea);
  return fetchApi(`/providers/available?${params}`);
}

/* ============================================================================
   ADMIN
============================================================================ */

export async function assignProvider(
  data: AssignProviderRequest
): Promise<Booking> {
  return fetchApi(`/admin/bookings/${data.bookingId}/assign`, {
    method: "POST",
    body: JSON.stringify({ providerId: data.providerId }),
  });
}

export async function adminOverrideStatus(
  bookingId: string,
  status: BookingStatus,
  reason: string
): Promise<Booking> {
  return fetchApi(`/admin/bookings/${bookingId}/override`, {
    method: "POST",
    body: JSON.stringify({ status, reason }),
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchApi("/admin/stats");
}

/* ============================================================================
   SERVICE TYPES
============================================================================ */

export async function getServiceTypes(
  category?: string
): Promise<ServiceType[]> {
  const qs = category ? `?category=${category}` : "";
  return fetchApi(`/service-types${qs}`);
}
