/**
 * =============================================================================
 * BOOKING TYPES - Core type definitions for the booking system
 * =============================================================================
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the application. These types define the data contracts between frontend
 * and backend, ensuring type safety and consistency.
 * 
 * IMPORTANT FOR BACKEND DEVELOPERS:
 * - All API endpoints should accept and return data matching these types
 * - Date fields should be ISO 8601 strings (e.g., "2024-01-15T10:30:00Z")
 * - IDs should be UUID v4 strings
 * - Enums define the exact allowed values for status fields
 */

// =============================================================================
// ENUMS - Status and Category Definitions
// =============================================================================

/**
 * Booking Status Lifecycle:
 * 
 * PENDING -> ASSIGNED -> IN_PROGRESS -> COMPLETED
 *    |          |            |
 *    v          v            v
 * CANCELLED  REJECTED   PROVIDER_NO_SHOW
 *               |
 *               v
 *          RE_ASSIGNED (retry)
 * 
 * Backend should validate status transitions according to this flow.
 */
export enum BookingStatus {
  /** Initial state when customer creates booking */
  PENDING = "PENDING",
  /** Provider has been assigned (automatic or accepted) */
  ASSIGNED = "ASSIGNED",
  /** Provider has started the job */
  IN_PROGRESS = "IN_PROGRESS",
  /** Job completed successfully */
  COMPLETED = "COMPLETED",
  /** Booking cancelled by customer or admin */
  CANCELLED = "CANCELLED",
  /** Provider rejected the job */
  REJECTED = "REJECTED",
  /** Provider did not show up */
  PROVIDER_NO_SHOW = "PROVIDER_NO_SHOW",
  /** Re-assigned to another provider after rejection/no-show */
  RE_ASSIGNED = "RE_ASSIGNED",
}

/**
 * Service Categories - Main service groupings
 * Backend should use these exact values in database
 */
export enum ServiceCategory {
  CLEANING = "CLEANING",
  REPAIR_MAINTENANCE = "REPAIR_MAINTENANCE",
  BEAUTY_WELLNESS = "BEAUTY_WELLNESS",
}

/**
 * User Roles for access control
 * Backend should implement role-based access control (RBAC)
 */
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

/**
 * Event types for audit logging
 * Backend should log all state changes with these event types
 */
export enum EventType {
  BOOKING_CREATED = "BOOKING_CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  PROVIDER_ASSIGNED = "PROVIDER_ASSIGNED",
  PROVIDER_ACCEPTED = "PROVIDER_ACCEPTED",
  PROVIDER_REJECTED = "PROVIDER_REJECTED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  ADMIN_OVERRIDE = "ADMIN_OVERRIDE",
  RETRY_TRIGGERED = "RETRY_TRIGGERED",
}

// =============================================================================
// SERVICE TYPE DEFINITIONS
// =============================================================================

/**
 * Service Type - Individual service offering
 * 
 * Backend Requirements:
 * - Store in 'service_types' table
 * - Link to ServiceCategory
 * - Include base pricing information
 */
export interface ServiceType {
  /** UUID v4 */
  id: string;
  /** Display name (e.g., "Deep Cleaning") */
  name: string;
  /** Detailed description of service */
  description: string;
  /** Parent category */
  category: ServiceCategory;
  /** Base price in cents (e.g., 5000 = $50.00) */
  basePrice: number;
  /** Estimated duration in minutes */
  estimatedDuration: number;
  /** Icon name from lucide-react */
  icon: string;
}

// =============================================================================
// USER TYPES
// =============================================================================

/**
 * Base User - Common fields for all users
 */
export interface User {
  /** UUID v4 */
  id: string;
  /** User's email address */
  email: string;
  /** Full name */
  name: string;
  /** Phone number in E.164 format (e.g., +1234567890) */
  phone: string;
  /** User role */
  role: UserRole;
  /** ISO 8601 timestamp */
  createdAt: string;
}

/**
 * Provider - Service provider with additional fields
 * 
 * Backend Requirements:
 * - Store in 'providers' table with FK to 'users'
 * - Track availability and ratings
 */
export interface Provider extends User {
  role: UserRole.PROVIDER;
  /** Categories this provider can service */
  serviceCategories: ServiceCategory[];
  /** Average rating (1.0 - 5.0) */
  rating: number;
  /** Total jobs completed */
  completedJobs: number;
  /** Whether provider is accepting new jobs */
  isAvailable: boolean;
  /** Service area (city/region) */
  serviceArea: string;
}

/**
 * Customer - Customer with booking history
 */
export interface Customer extends User {
  role: UserRole.CUSTOMER;
  /** Saved addresses */
  addresses: Address[];
}

// =============================================================================
// ADDRESS TYPE
// =============================================================================

/**
 * Address - Physical location for service
 * 
 * Backend Requirements:
 * - Validate address format
 * - Store in 'addresses' table
 */
export interface Address {
  /** UUID v4 */
  id: string;
  /** Street address line 1 */
  street: string;
  /** Apartment, unit, etc. (optional) */
  unit?: string;
  /** City name */
  city: string;
  /** State/Province code */
  state: string;
  /** Postal/ZIP code */
  postalCode: string;
  /** Additional notes for provider */
  notes?: string;
}

// =============================================================================
// BOOKING TYPES
// =============================================================================

/**
 * Booking - Core booking entity
 * 
 * Backend Requirements:
 * - Store in 'bookings' table
 * - Implement status transition validation
 * - Trigger events on status changes
 * - Auto-assign provider or wait for acceptance based on config
 * 
 * Database Schema Suggestion:
 * ```sql
 * CREATE TABLE bookings (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   customer_id UUID REFERENCES users(id) NOT NULL,
 *   provider_id UUID REFERENCES providers(id),
 *   service_type_id UUID REFERENCES service_types(id) NOT NULL,
 *   status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
 *   scheduled_date TIMESTAMP NOT NULL,
 *   address JSONB NOT NULL,
 *   notes TEXT,
 *   total_price INTEGER NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 * ```
 */
export interface Booking {
  /** UUID v4 - Primary key */
  id: string;
  /** Reference to customer who created booking */
  customerId: string;
  /** Customer details (populated on fetch) */
  customer?: Customer;
  /** Reference to assigned provider (null if pending) */
  providerId?: string;
  /** Provider details (populated on fetch) */
  provider?: Provider;
  /** Reference to service type */
  serviceTypeId: string;
  /** Service type details (populated on fetch) */
  serviceType?: ServiceType;
  /** Current booking status */
  status: BookingStatus;
  /** Scheduled service date/time - ISO 8601 */
  scheduledDate: string;
  /** Service location */
  address: Address;
  /** Customer notes for provider */
  notes?: string;
  /** Total price in cents */
  totalPrice: number;
  /** ISO 8601 timestamp */
  createdAt: string;
  /** ISO 8601 timestamp */
  updatedAt: string;
}

// =============================================================================
// EVENT LOG TYPES
// =============================================================================

/**
 * BookingEvent - Audit log entry for booking changes
 * 
 * Backend Requirements:
 * - Store in 'booking_events' table
 * - Create event on every status change
 * - Include actor information (who made the change)
 * 
 * This is critical for observability and debugging issues.
 */
export interface BookingEvent {
  /** UUID v4 */
  id: string;
  /** Reference to booking */
  bookingId: string;
  /** Type of event */
  eventType: EventType;
  /** Previous status (for status changes) */
  previousStatus?: BookingStatus;
  /** New status (for status changes) */
  newStatus?: BookingStatus;
  /** ID of user who triggered event */
  triggeredBy: string;
  /** Role of user who triggered event */
  triggeredByRole: UserRole;
  /** Additional event metadata */
  metadata?: Record<string, unknown>;
  /** ISO 8601 timestamp */
  createdAt: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Create Booking Request
 * 
 * Validation Requirements:
 * - serviceTypeId must exist in service_types table
 * - scheduledDate must be in the future
 * - address must have required fields
 */
export interface CreateBookingRequest {
  /** Valid service type ID */
  serviceTypeId: string;
  /** Future date/time - ISO 8601 */
  scheduledDate: string;
  /** Service address */
  address: Omit<Address, "id">;
  /** Optional notes */
  notes?: string;
}

/**
 * Update Booking Status Request
 * 
 * Backend should validate status transitions:
 * - PENDING -> ASSIGNED, CANCELLED
 * - ASSIGNED -> IN_PROGRESS, REJECTED, CANCELLED
 * - IN_PROGRESS -> COMPLETED, PROVIDER_NO_SHOW, CANCELLED
 * - Admin can override any status
 */
export interface UpdateBookingStatusRequest {
  /** Booking ID to update */
  bookingId: string;
  /** New status */
  status: BookingStatus;
  /** Reason for status change (required for CANCELLED, REJECTED) */
  reason?: string;
}

/**
 * Assign Provider Request
 * 
 * Admin can manually assign any available provider
 */
export interface AssignProviderRequest {
  /** Booking ID */
  bookingId: string;
  /** Provider ID to assign */
  providerId: string;
}

/**
 * Provider Action Request
 * 
 * For provider accepting or rejecting a job
 */
export interface ProviderActionRequest {
  /** Booking ID */
  bookingId: string;
  /** Accept or reject */
  action: "ACCEPT" | "REJECT";
  /** Required if rejecting */
  reason?: string;
}

/**
 * Retry Booking Request
 * 
 * Used to re-attempt provider assignment after failure
 */
export interface RetryBookingRequest {
  /** Booking ID to retry */
  bookingId: string;
}

/**
 * Get Bookings Request - Query parameters
 */
export interface GetBookingsRequest {
  /** Filter by status */
  status?: BookingStatus;
  /** Filter by customer ID */
  customerId?: string;
  /** Filter by provider ID */
  providerId?: string;
  /** Filter by date range start - ISO 8601 */
  dateFrom?: string;
  /** Filter by date range end - ISO 8601 */
  dateTo?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page (default 20, max 100) */
  limit?: number;
  scope?: "all" | "mine";
}

/**
 * Paginated Response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  data: T[];
  /** Total count of items matching query */
  total: number;
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * API Error Response
 * 
 * Backend should return this format for all errors:
 * - 400: Validation errors
 * - 401: Authentication required
 * - 403: Insufficient permissions
 * - 404: Resource not found
 * - 409: Conflict (e.g., invalid status transition)
 * - 500: Server error
 */
export interface ApiError {
  /** HTTP status code */
  statusCode: number;
  /** Error message */
  message: string;
  /** Detailed errors (for validation) */
  errors?: Record<string, string[]>;
  /** Error code for client handling */
  code?: string;
}

// =============================================================================
// DASHBOARD STATISTICS
// =============================================================================

/**
 * Admin Dashboard Stats
 * 
 * Backend should compute these from database
 */
export interface DashboardStats {
  /** Total bookings */
  totalBookings: number;
  /** Bookings by status */
  bookingsByStatus: Record<BookingStatus, number>;
  /** Active providers count */
  activeProviders: number;
  /** Completion rate percentage */
  completionRate: number;
  /** Average rating */
  averageRating: number;
  /** Revenue in cents */
  totalRevenue: number;
  /** Bookings requiring attention (failed, no-show) */
  requiresAttention: number;
}

/**
 * Provider Stats
 */
export interface ProviderStats {
  /** Jobs completed */
   completedBookings: number;
  /** Jobs in progress */
  inProgressJobs: number;
  /** Total earnings in cents */
  totalEarnings: number;
  /** Acceptance rate percentage */
  acceptanceRate: number;
  /** Average rating */
  averageRating: number;
}
