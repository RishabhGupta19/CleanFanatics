# HomeServe Pro - Frontend Documentation

## Overview

HomeServe Pro is a comprehensive frontend for an on-demand home services marketplace. It provides interfaces for customers to book services, providers to manage jobs, and administrators to oversee operations.

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Lucide React** for icons

## Project Structure

```
src/
├── api/
│   └── api.ts              # Centralized API layer with full documentation
├── components/
│   └── ui/                 # shadcn/ui components
├── contexts/
│   └── AppContext.tsx      # Global state (auth, role switching, mock mode)
├── data/
│   └── mockData.ts         # Mock data for demo/testing
├── hooks/
│   └── use-toast.ts        # Toast notifications
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── Login.tsx           # Authentication with role selection
│   ├── Register.tsx        # User registration for all roles
│   ├── CustomerDashboard.tsx
│   ├── ProviderDashboard.tsx
│   └── AdminDashboard.tsx
├── types/
│   └── booking.ts          # TypeScript type definitions
└── App.tsx                 # Main app with routing
```

## Pages & Features

### 1. Landing Page (`/`)
- Hero section with value proposition
- Service categories overview
- How it works section
- Customer testimonials
- Company about section
- Contact footer

### 2. Login Page (`/login`)
- Unified login with role tabs (Customer/Provider/Admin)
- Demo mode toggle for mock data
- Automatic navigation to appropriate dashboard
- Link to registration page

### 3. Register Page (`/register`)
- User registration for all three roles (Customer/Provider/Admin)
- Role-specific fields (service area for providers)
- Client-side validation with Zod
- Password confirmation and input validation
- Automatic redirect to login after successful registration

### 3. Customer Dashboard (`/customer`)
- Create new bookings with service selection
- View all bookings with status tracking
- Cancel pending bookings
- Filter by status (All/Active/Completed)

### 4. Provider Dashboard (`/provider`)
- View available jobs to accept
- Accept or reject incoming jobs
- Update job status (Start → Complete)
- View earnings and performance stats

### 5. Admin Dashboard (`/admin`)
- Overview statistics (bookings, revenue, providers)
- Searchable/filterable booking table
- Manual status override capability
- Provider assignment functionality
- Booking event log (audit trail)
- Retry failed bookings

## API Layer

All API functions are in `src/api/api.ts` with comprehensive JSDoc documentation.

### Key API Functions

| Function | Endpoint | Description |
|----------|----------|-------------|
| `register()` | POST /auth/register | Register new user |
| `login()` | POST /auth/login | User login |
| `logout()` | POST /auth/logout | User logout |
| `createBooking()` | POST /bookings | Create new booking |
| `getBookings()` | GET /bookings | List bookings with filters |
| `updateBookingStatus()` | PATCH /bookings/:id/status | Update status |
| `cancelBooking()` | POST /bookings/:id/cancel | Cancel booking |
| `acceptJob()` | POST /bookings/:id/accept | Provider accepts job |
| `rejectJob()` | POST /bookings/:id/reject | Provider rejects job |
| `assignProvider()` | POST /bookings/:id/assign | Admin assigns provider |
| `adminOverrideStatus()` | POST /admin/bookings/:id/override | Admin force status |
| `retryBooking()` | POST /bookings/:id/retry | Retry failed assignment |
| `getBookingEvents()` | GET /bookings/:id/events | Get audit trail |
| `getDashboardStats()` | GET /admin/stats | Admin statistics |

### Mock Data Mode

Toggle between mock data and real API calls:

```typescript
import { setUseMockData } from "@/api/api";
setUseMockData(false); // Use real backend
```

## Type Definitions

All types are in `src/types/booking.ts`:

### Core Enums

```typescript
enum BookingStatus {
  PENDING, ASSIGNED, IN_PROGRESS, COMPLETED,
  CANCELLED, REJECTED, PROVIDER_NO_SHOW, RE_ASSIGNED
}

enum ServiceCategory {
  CLEANING, REPAIR_MAINTENANCE, BEAUTY_WELLNESS
}

enum UserRole {
  CUSTOMER, PROVIDER, ADMIN
}
```

### Key Interfaces

- `Booking` - Main booking entity
- `ServiceType` - Service offering
- `Provider` - Service provider
- `BookingEvent` - Audit log entry
- `CreateBookingRequest` - Booking creation payload
- `DashboardStats` - Admin statistics

## Backend Integration Guide

### Required Endpoints

1. **Authentication**
   - POST `/auth/register` - Register new user (returns success status)
   - POST `/auth/login` - Returns JWT token and user object
   - POST `/auth/logout` - Invalidate token

2. **Bookings**
   - GET `/bookings` - List with filters
   - POST `/bookings` - Create booking
   - GET `/bookings/:id` - Get single booking
   - PATCH `/bookings/:id/status` - Update status
   - POST `/bookings/:id/cancel` - Cancel
   - POST `/bookings/:id/accept` - Provider accept
   - POST `/bookings/:id/reject` - Provider reject
   - POST `/bookings/:id/assign` - Admin assign
   - POST `/bookings/:id/retry` - Retry assignment
   - GET `/bookings/:id/events` - Audit log

3. **Admin**
   - GET `/admin/stats` - Dashboard stats
   - POST `/admin/bookings/:id/override` - Force status

4. **Other**
   - GET `/service-types` - List services
   - GET `/providers/available` - Available providers

### Status Transition Rules

```
PENDING → ASSIGNED, CANCELLED
ASSIGNED → IN_PROGRESS, REJECTED, CANCELLED
IN_PROGRESS → COMPLETED, PROVIDER_NO_SHOW, CANCELLED
REJECTED → RE_ASSIGNED (via retry)
PROVIDER_NO_SHOW → RE_ASSIGNED (via retry)
```

### Authentication

- JWT token in Authorization header: `Bearer <token>`
- Token stored in localStorage as `auth_token`

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": { "field": ["error message"] },
  "code": "VALIDATION_ERROR"
}
```

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Running the Frontend

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

## Design System

Colors are defined in `src/index.css` using CSS variables:
- Primary: Corporate blue
- Accent: Teal for CTAs
- Success/Warning/Destructive: Status colors

All colors use HSL format for consistency.
