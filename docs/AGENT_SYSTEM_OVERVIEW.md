# 🧠 NoboGhat: Deep Agent System Architecture & Technical Specification

> **Audience:** Autonomous AI Agents, Senior Systems Engineers, and Technical Maintainers.  
> **Status:** Authoritative Blueprint & Runtime Reference  
> **Repository:** `EHMahi9/NoboGhat-Bangladesh`

---

## 1. System Overview & Core Domain Purpose

**NoboGhat** (Bengali: নোবো ঘাট - "The New River Port") is an inland water logistics and river cargo booking engine designed to digitize freight transportation across Bangladesh's river networks.

### Primary Domain Stakeholders
1. **Cargo Providers (`FARMER` / `TRADER`):** Search scheduled river journeys, inspect real-time vessel payload capacity, reserve space for agricultural/commercial cargo, compute automated corridor fares, track booking lifecycle, and settle payments.
2. **Vessel Operators (`BOAT_OWNER`):** Register vessels with capacity limits (kg), schedule single or weekly recurring voyages, inspect cargo manifests, and accept/reject cargo reservation requests.
3. **Logistics Administrators (`ADMIN`):** Manage national navigable corridors/routes, set per-kg tariffs, oversee user accounts, manage automated recurring schedules, and monitor national freight metrics.

---

## 2. End-to-End Connectivity & System Architecture

```
                                 ┌────────────────────────────────────────┐
                                 │            WEB BROWSER CLIENT          │
                                 │                                        │
                                 │  HTML5 + Vanilla CSS + Modular JS      │
                                 │  • assets/js/config.js (API Base URL)  │
                                 │  • assets/js/api.js (Fetch & Refresh)  │
                                 │  • assets/js/session.js (State Store)  │
                                 │  • assets/js/websocket.js (SockJS)     │
                                 └───────────┬────────────────┬───────────┘
                                             │                │
                        HTTPS / JSON REST    │                │  WSS / STOMP
                        (Bearer Token)       │                │  (SockJS Endpoint)
                                             ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SPRING BOOT APPLICATION (PORT 8080)                         │
│                                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              SPRING SECURITY FILTER CHAIN                             │  │
│  │  1. CorsConfigurationSource (Allowed Origins & Patterns)                              │  │
│  │  2. JwtRequestFilter (Extracts 'Authorization: Bearer <JWT>', validates & sets auth)  │  │
│  │  3. DaoAuthenticationProvider (BCryptPasswordEncoder, UserService)                    │  │
│  │  4. OAuth2LoginAuthenticationFilter (Google OAuth2 Success Handler)                   │  │
│  └───────────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                              │                                              │
│                                              ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                  CONTROLLER LAYER                                     │  │
│  │  • AuthController (/api/auth/*)         • BookingController (/api/bookings/*)         │  │
│  │  • TripController (/api/trips/*)        • BoatController (/api/boats/*)               │  │
│  │  • RouteController (/api/routes/*)      • ProfileController (/api/users/*)            │  │
│  │  • AdminController (/api/admin/*)       • NotificationController (/api/notifications) │  │
│  │  • PaymentController (/api/payments)    • FileUploadController (/api/files/*)         │  │
│  │  • RecurringTripScheduleController     • ApiExceptionHandler (@RestControllerAdvice) │  │
│  └───────────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                              │                                              │
│                                              ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              SERVICE LAYER (BUSINESS LOGIC)                           │  │
│  │  • UserService (BCrypt, Registration, Role Transition, Password Reset Tokens)         │  │
│  │  • BookingService (Pessimistic Lock, Cargo Capacity Calculations, Status Mutations)   │  │
│  │  • TripService (Trip scheduling, dynamic capacity aggregation)                        │  │
│  │  • NotificationService (WebSocket SimpMessagingTemplate push notifications)           │  │
│  │  • PaymentService (Transaction generation, Webhook resolution)                        │  │
│  │  • LocalFileStorageService (Multipart avatar/file IO to /uploads)                     │  │
│  │  • RecurringTripScheduleService (Weekly timetable definitions)                        │  │
│  └───────────────────────────────────────────┬───────────────────────────────────────────┘  │
│                                              │                                              │
│                                              ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                DATA ACCESS LAYER (JPA)                                │  │
│  │  • UserRepository                      • TripRepository (Pessimistic Locking)         │  │
│  │  • BookingRepository                   • BoatRepository                               │  │
│  │  • RouteRepository                     • NotificationRepository                       │  │
│  │  • PaymentTransactionRepository        • RecurringTripScheduleRepository              │  │
│  └───────────────────────────────────────────┬───────────────────────────────────────────┘  │
└──────────────────────────────────────────────┼──────────────────────────────────────────────┘
                                               │ JDBC / Hibernate ORM
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       PERSISTENCE LAYER                                     │
│                                                                                             │
│   • Production: MySQL 8.0+ on Render / Cloud (InnoDB, UTF-8mb4, ddl-auto=update)            │
│   • Local Development: Fallback to in-memory H2 database if MySQL connection fails          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema, Entity Models & Invariants

### 3.1 Entity Model Specifications

#### A. `User` Entity (`users` table)
- **Inheritance:** Single-Table strategy (`@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`).
- **Discriminator Column:** `"role"` (Escaped with quotes to prevent SQL dialect collisions).
- **Subclasses:** `Farmer`, `Trader`, `BoatOwner`, `Admin`.
- **Fields:**
  - `userId` (Long, PK, Auto-increment)
  - `name` (String, Not Null)
  - `phone` (String, Unique, Length 20) — Primary local login credential
  - `email` (String, Unique, Length 320) — Used for Google OAuth2 and Password Reset
  - `passwordHash` (String, `@JsonIgnore`, BCrypt hashed)
  - `role` (String, Read-only mapped from Discriminator)
  - `isActive` (boolean, default `true`) — Soft deletion flag
  - `profilePictureUrl` (String, Length 1000)
  - `boats` (`List<Boat>`, `@OneToMany(mappedBy="owner")`, `@JsonIgnore`)

#### B. `Boat` Entity (`boats` table)
- **Fields:**
  - `boatId` (Long, PK)
  - `name` (String)
  - `capacity` (Double, in kilograms)
  - `owner` (`User`, `@ManyToOne`, `@JoinColumn(name="owner_id")`)

#### C. `Route` Entity (`routes` table)
- **Fields:**
  - `routeId` (Long, PK)
  - `source` (String, Not Null) — e.g. "Dhaka (Sadarghat)"
  - `destination` (String, Not Null) — e.g. "Barishal"
  - `pricePerKg` (Double, Optional/Corridor tariff rate in BDT)

#### D. `Trip` Entity (`trips` table)
- **Fields:**
  - `tripId` (Long, PK)
  - `route` (`Route`, `@ManyToOne`, `@JoinColumn(name="route_id")`, Not Null)
  - `boat` (`Boat`, `@ManyToOne`, `@JoinColumn(name="boat_id")`, Not Null)
  - `departureTime` (LocalDateTime, Not Null)
  - `recurringSchedule` (`RecurringTripSchedule`, `@ManyToOne`, Optional)

#### E. `Booking` Entity (`bookings` table)
- **Index:** `idx_booking_status` on column `status`
- **Fields:**
  - `bookingId` (Long, PK)
  - `user` (`User`, `@ManyToOne`, `@JoinColumn(name="user_id")`, Not Null)
  - `trip` (`Trip`, `@ManyToOne`, `@JoinColumn(name="trip_id")`, Not Null)
  - `cargoWeight` (Double, in kg)
  - `cargoType` (String) — e.g. "Paddy", "Jute", "Fish", "Manufactured Goods"
  - `totalFare` (Double) — Calculated as `cargoWeight × route.pricePerKg`
  - `status` (String: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`)
  - `bookedAt` (LocalDateTime, `@CreationTimestamp`, immutable)

#### F. `PaymentTransaction` Entity (`payment_transactions` table)
- **Fields:**
  - `transactionId` (Long, PK)
  - `transactionRef` (String, Unique, Not Null)
  - `booking` (`Booking`, `@ManyToOne`, FetchType.LAZY)
  - `amount` (Double, Not Null)
  - `status` (String: `PENDING`, `SUCCESS`, `FAILED`)
  - `gateway` (String: `bKash`, `SSLCommerz`)
  - `createdAt`, `updatedAt` (Audit timestamps)

#### G. `Notification` Entity (`notifications` table)
- **Fields:**
  - `notificationId` (Long, PK)
  - `user` (`User`, `@ManyToOne`, Not Null)
  - `message` (String, Length 500, Not Null)
  - `isRead` (boolean, default `false`)
  - `createdAt` (LocalDateTime), `readAt` (LocalDateTime)

#### H. `RecurringTripSchedule` Entity (`recurring_trip_schedules` table)
- **Fields:**
  - `scheduleId` (Long, PK)
  - `route` (`Route`, `@ManyToOne`, Not Null)
  - `boat` (`Boat`, `@ManyToOne`, Not Null)
  - `dayOfWeek` (`DayOfWeek` Enum: `MONDAY`, `TUESDAY`, etc.)
  - `departureTime` (LocalTime)
  - `active` (boolean, default `true`)

---

## 4. Critical Business Logic & Concurrency Control

### 4.1 Pessimistic Concurrency Locking in Bookings
To prevent race conditions and overbooking when multiple users attempt to reserve cargo space on the same vessel simultaneously:
```java
// BookingService.java
@Transactional
public Booking createBooking(BookingDto bookingDto, String username) {
    // 1. Acquire PESSIMISTIC_WRITE lock on the trip record
    Trip trip = tripRepository.findByIdWithLock(bookingDto.getTripId())
            .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

    // 2. Sum all existing reserved cargo weight for this trip
    Double reservedWeight = bookingRepository.sumReservedCargoWeight(trip.getTripId());
    if (reservedWeight == null) reservedWeight = 0.0;

    // 3. Strict Capacity Validation
    if (reservedWeight + bookingDto.getCargoWeight() > trip.getBoat().getCapacity()) {
        throw new BookingException("Booking exceeds boat capacity. Available: " 
            + (trip.getBoat().getCapacity() - reservedWeight) + " kg");
    }

    // 4. Calculate total fare
    Double fare = null;
    if (trip.getRoute().getPricePerKg() != null) {
        fare = bookingDto.getCargoWeight() * trip.getRoute().getPricePerKg();
    }

    // 5. Persist Booking entity
    Booking booking = new Booking();
    booking.setUser(user);
    booking.setTrip(trip);
    booking.setCargoWeight(bookingDto.getCargoWeight());
    booking.setCargoType(bookingDto.getCargoType());
    booking.setTotalFare(fare);
    booking.setStatus("PENDING");
    Booking savedBooking = bookingRepository.save(booking);

    // 6. Push real-time WebSocket alert to Boat Owner
    notificationService.notifyUser(trip.getBoat().getOwner().getUserId(),
        "New booking request (" + bookingDto.getCargoWeight() + " kg) for boat " + trip.getBoat().getName());

    return savedBooking;
}
```

### 4.2 Dynamic Capacity Calculation for Trip Search
When clients query `/api/trips`, the response maps to `TripWithCapacityDto`:
- `totalCapacity` = `trip.getBoat().getCapacity()`
- `reservedCapacity` = `sum(bookings where status in ['PENDING', 'CONFIRMED'])`
- `availableCapacity` = `totalCapacity - reservedCapacity`
- If `availableCapacity <= 0`, trip is flagged as full in UI.

---

## 5. Security & Authentication Architecture

### 5.1 Dual-Token Authentication Lifecycle
1. **Login Request:** Client sends `POST /api/auth/login` with `{emailOrPhone, password}`.
2. **Validation:** `AuthenticationManager` authenticates credentials against `UserService` and `BCryptPasswordEncoder`.
3. **Response Payload:**
   - **Access Token:** 24-hour expiration JWT containing `sub` (phone/email) and `role`. Returned in JSON body `{token: "..."}`.
   - **Refresh Token:** 7-day expiration JWT issued as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie on path `/api/auth/refresh`.
4. **Sliding Session / Auto-Refresh:**
   - Global `fetch` wrapper in `frontend/assets/js/api.js` intercepts any `401 Unauthorized` response.
   - Automatically issues background `POST /api/auth/refresh`.
   - On success, updates `localStorage.getItem("noboghatToken")` and transparently retries the failed request.

### 5.2 Google OAuth2 Integration
- Configured in `SecurityConfig.java` and `GoogleOAuth2SuccessHandler.java`.
- If user logs in via Google:
  - System extracts email, full name, and avatar picture.
  - Matches existing user by email or auto-provisions a new `User` with default role `FARMER`.
  - Generates JWT access token and redirects browser to `frontend/pages/login.html?token=...`.

### 5.3 Role-Based Access Control (RBAC)
- Method security enabled via `@EnableMethodSecurity`.
- Role hierarchy:
  - `ROLE_FARMER`, `ROLE_TRADER`: Create bookings, initiate payments, view owned bookings.
  - `ROLE_BOAT_OWNER`: Create/update/delete owned boats, create/delete trips, confirm/reject bookings on owned boats.
  - `ROLE_ADMIN`: Full system access, route creation, user moderation, analytics dashboard, recurring trip scheduling.

---

## 6. Real-Time WebSocket Infrastructure

- **Endpoint:** `/ws` (with SockJS fallback enabled in `WebSocketConfig.java`).
- **Broker Prefix:** `/topic` and `/user`.
- **App Destination Prefix:** `/app`.
- **Client Subscription:** `/topic/notifications/{userId}`.
- **Trigger Points:**
  - Boat owner accepts/cancels booking ➔ Cargo owner receives toast notification.
  - Farmer books trip ➔ Boat owner receives toast notification.
  - Admin schedules trip ➔ Broadcast to relevant subscribers.

---

## 7. Complete REST API Matrix

| Method | Path | Required Role | Request Body / Params | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `UserRegistrationDto` | `{userId, name, token, role}` |
| `POST` | `/api/auth/login` | Public | `LoginDto` | `{token, email, role}` |
| `POST` | `/api/auth/refresh` | Public (Cookie) | Cookie: `refreshToken` | `{token, role}` |
| `POST` | `/api/auth/forgot-password` | Public | `ForgotPasswordDto` | `{message, token}` |
| `POST` | `/api/auth/reset-password` | Public | `ResetPasswordDto` | `{message}` |
| `GET` | `/api/users/profile` | Authenticated | None | `{userId, name, phone, email, role, profilePictureUrl}` |
| `PUT` | `/api/users/profile` | Authenticated | `ProfileUpdateDto` | Updated profile map |
| `PUT` | `/api/users/update-role` | Authenticated | `UpdateRoleDto` | `{message, token, role}` |
| `DELETE`| `/api/users/profile` | Authenticated | None | `{message}` |
| `GET` | `/api/trips` | Public | `?source=&destination=&date=` | `List<TripWithCapacityDto>` |
| `POST` | `/api/trips` | Boat Owner / Admin | `TripDto` | `Trip` entity |
| `DELETE`| `/api/trips/{id}` | Boat Owner / Admin | None | 204 No Content |
| `GET` | `/api/bookings` | Authenticated | None | `List<BookingSummaryDto>` (Scoped by role) |
| `POST` | `/api/bookings` | Farmer / Trader | `BookingDto` | `BookingSummaryDto` |
| `GET` | `/api/bookings/{id}` | Authenticated | None | `Booking` entity |
| `PATCH`| `/api/bookings/{id}/status` | Boat Owner / Admin | `BookingStatusUpdateDto` | `BookingSummaryDto` |
| `DELETE`| `/api/bookings/{id}` | Authenticated | None | 204 No Content |
| `GET` | `/api/boats` | Authenticated | None | `List<Boat>` (Scoped by role) |
| `POST` | `/api/boats` | Boat Owner / Admin | `BoatCreationDto` | `Boat` entity |
| `PUT` | `/api/boats/{id}` | Boat Owner / Admin | `BoatCreationDto` | `Boat` entity |
| `DELETE`| `/api/boats/{id}` | Boat Owner / Admin | None | 204 No Content |
| `GET` | `/api/routes` | Public | None | `List<Route>` |
| `POST` | `/api/routes` | Admin | `RouteDto` | `Route` entity |
| `GET` | `/api/notifications` | Authenticated | None | `List<NotificationDto>` |
| `GET` | `/api/notifications/unread-count` | Authenticated | None | `{count: N}` |
| `PUT` | `/api/notifications/{id}/read` | Authenticated | None | `{message}` |
| `POST` | `/api/payments/initiate` | Farmer / Trader | `{bookingId, gateway}` | `PaymentTransaction` |
| `POST` | `/api/payments/webhook` | Public | `{transactionRef, status}` | `"Webhook received."` |
| `POST` | `/api/files/upload` | Authenticated | Multipart `file` | `{fileName, fileDownloadUri, size}` |
| `GET` | `/api/files/{fileName}` | Public | None | File Stream Binary |
| `GET` | `/api/admin/dashboard` | Admin | None | `AdminDashboardDto` (Totals stats) |
| `GET` | `/api/admin/users` | Admin | None | `List<UserAdminDto>` |
| `DELETE`| `/api/admin/users/{id}` | Admin | None | 204 No Content |
| `GET` | `/api/admin/recurring-trips` | Admin | None | `List<RecurringTripSchedule>` |
| `POST` | `/api/admin/recurring-trips` | Admin | `RecurringTripScheduleDto` | `RecurringTripSchedule` |
| `GET` | `/actuator/health` | Public | None | `{status: "UP"}` |

---

## 8. Frontend Script Hierarchy & Execution Flow

To avoid undefined variable errors, HTML pages in `frontend/pages/` MUST import JavaScript modules in this exact order:

```html
<!-- 1. Environment Configuration -->
<script src="../assets/js/config.js"></script>

<!-- 2. API Helper & Global Fetch Interceptor (handles JWT injection & 401 refresh) -->
<script src="../assets/js/api.js"></script>

<!-- 3. Session & Storage State Helper -->
<script src="../assets/js/session.js"></script>

<!-- 4. Third-Party WebSocket Libraries -->
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

<!-- 5. Real-Time Toast & Notification Client -->
<script src="../assets/js/websocket.js"></script>

<!-- 6. Page-Specific Business Logic -->
<script src="../assets/js/dashboard.js"></script> <!-- or admin.js / auth.js / routes.js -->
```

---

## 9. Environment Variables & Production Configuration

| Environment Variable | Default Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/noboghat` | MySQL Connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database Username |
| `SPRING_DATASOURCE_PASSWORD` | `""` | Database Password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Hibernate Schema Strategy |
| `JWT_SECRET` | Auto-generated dev key | Minimum 32-character secret for HMAC-SHA256 |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | Access token lifespan |
| `JWT_REFRESH_EXPIRATION_MS` | `604800000` (7 Days) | Refresh cookie lifespan |
| `FRONTEND_URL` | `https://noboghat-bangladesh.vercel.app` | Production frontend domain |
| `CORS_ALLOWED_ORIGINS` | Whitelist (localhost + Vercel) | Comma-separated CORS allowed origins |
| `ADMIN_EMAIL` | `""` | Optional initial admin email |
| `ADMIN_PASSWORD` | `""` | Optional initial admin password |
| `GOOGLE_CLIENT_ID` | `google-oauth-not-configured` | Google Cloud OAuth2 Client ID |
| `GOOGLE_CLIENT_SECRET` | `google-oauth-not-configured` | Google Cloud OAuth2 Client Secret |

---

## 10. Agent Modification Guardrails & Known Gotchas

1. **`open-in-view=false` is enforced:** Lazy loading outside transactional service boundaries will throw `LazyInitializationException`. Ensure repositories use `JOIN FETCH` or DTO projection if related entities are needed.
2. **Discriminator Column Quoting:** In `User.java`, `@DiscriminatorColumn(name = "\"role\"")` uses double quotes to avoid reserved keyword conflicts across MySQL, PostgreSQL, and H2 dialects. Do not remove the quotes.
3. **Pessimistic Lock Requirement:** Never remove `@Lock(LockModeType.PESSIMISTIC_WRITE)` from `TripRepository.findByIdWithLock`—it protects the fundamental capacity integrity of the entire platform.
4. **CORS Regex Patterns:** `SecurityConfig.java` dynamically permits preview deployments using `.setAllowedOriginPatterns()`. Do not replace with static `.setAllowedOrigins()` unless exact domains are known.
5. **No Flyway Strict Migrations on Production:** `spring.flyway.enabled=false` and `spring.jpa.hibernate.ddl-auto=update` are purposefully configured for zero-downtime schema evolution on Render free tier instances.
