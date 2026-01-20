# Clean Fanatics – Home Services Booking Platform

Clean Fanatics is a full-stack home services booking platform inspired by real-world systems like Urban Company.  
It is built with production-grade backend logic, role-based access control, booking state machines, and a clean frontend architecture.

This project demonstrates practical backend engineering, API design, and frontend integration using modern tools.

---

## 1. Project Overview

The platform supports three roles:

• Customer – creates and manages service bookings  
• Provider – accepts, rejects, and completes jobs  
• Admin – oversees all bookings and system operations  

The system ensures:
- Correct booking lifecycle transitions
- Role-aware data visibility
- Non-destructive booking history
- Scalable backend architecture

---

## 2. Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Context API (global auth & state)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

### Tooling
- ts-node-dev
- dotenv
- bcrypt
- jsonwebtoken
- morgan

---

## 3. System Architecture

Frontend communicates with backend via REST APIs.  
Backend handles authentication, authorization, and data persistence.

Architecture flow:

Frontend (React)
→ API Layer
→ Express Controllers
→ Services & Business Logic
→ MongoDB (Mongoose Models)


The backend is stateless and secured using JWT.

---

## 4. User Roles & Responsibilities

### Customer
- Create bookings
- View own bookings
- Cancel pending bookings
- See assigned provider details

### Provider
- View all available jobs
- Accept jobs (job becomes assigned)
- Reject jobs (job remains available for others)
- View only assigned jobs in “My Jobs”
- Update job status (Assigned → In Progress → Completed)
- Earnings calculated from completed bookings

### Admin
- View all bookings
- Assign providers manually
- Override booking status
- Retry failed assignments
- Monitor system metrics

---

## 5. Booking Lifecycle

Bookings follow a controlled state machine:

PENDING  
→ ASSIGNED  
→ IN_PROGRESS  
→ COMPLETED  

Additional admin-only states:
- CANCELLED
- RE_ASSIGNED
- PROVIDER_NO_SHOW

Provider rejection does NOT cancel a booking.  
It only removes that booking from the rejecting provider’s view.



## 6. Authentication & Authorization

Authentication is handled using JWT.

Flow:
1. User logs in
2. Backend issues JWT
3. Token stored in localStorage
4. Token sent in Authorization header
5. Middleware validates token
6. Role-based access enforced

State persists across refresh using localStorage hydration.

---

## 8. API Endpoints

### Authentication
POST /api/auth/login  
POST /api/auth/register  

### Service Types
GET /api/service-types  

### Bookings
POST   /api/bookings  
GET    /api/bookings?scope=all|mine  
GET    /api/bookings/:id  
PATCH  /api/bookings/:id/status  
POST   /api/bookings/:id/cancel  
POST   /api/bookings/:id/retry  
POST   /api/bookings/:id/accept  
POST   /api/bookings/:id/reject  
GET    /api/bookings/:id/events  

### Providers
GET /api/providers/available  
GET /api/providers/:id/stats  

### Admin
POST /api/admin/assign-provider  
POST /api/admin/override-status  

---

## 9. Provider Earnings Logic

Earnings are calculated dynamically:

totalEarnings =
Sum of totalPrice for all COMPLETED bookings assigned to the provider

No fixed earnings or mock values are used.

---

## 10. Environment Variables

Create a .env file in backend root:

PORT=3001  
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/clean-fanatics  
JWT_SECRET=your_secret_key  
JWT_EXPIRES_IN=7d  
NODE_ENV=development  

---

## 11. Setup Instructions

### Backend
cd backend  
npm install  
npm run dev  

### Frontend
cd frontend  
npm install  
npm run dev  

---

## 12. Key Engineering Decisions

- No destructive deletes (event-based history)
- Role-aware database queries
- Controlled booking transitions
- Stateless backend (JWT)
- DTO-based API responses
- No frontend-only authorization
- Backend remains source of truth

---

## 13. What This Project Demonstrates

- Real-world backend architecture
- Role-based access control
- State machines and transitions
- Clean API design
- Full-stack ownership
- Debugging complex data flow issues

---

```bash
# Design Decisions ───────────────────────────────
- Feature-based backend modules
- Backend-driven business rules
- Finite state machine for bookings
- Plain REST (no WebSockets)

# Trade-offs ─────────────────────────────────────
- Simulated pricing (no real gateway)
- Poll-based refresh (no realtime)
- Manual provider assignment by admin

# Assumptions ────────────────────────────────────
- 1 provider per booking
- Providers can reject independently
- Admin has ultimate control
- Prices are fixed/predefined

# Future Improvements ────────────────────────────
- WebSockets / SSE for live updates
- Automatic provider matching
- Real payment integration
- Refresh tokens + rate limiting
- Unit + integration test suite

## 14. Author

Rishabh Gupta  
Full Stack Developer (MERN)
Connect :
rishabh134we@gmail.com
7896751316
www.rishabhs.xyz

This project reflects real production-style decision making and system design.
