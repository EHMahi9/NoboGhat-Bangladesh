# NoboGhat Implementation Tasks — COMPLETED

## Task 1: Frontend Cleanup & Navbar Fixes
- [x] navbar.js: Fix logout redirect to `/`
- [x] navbar.js: Remove button styling from Dashboard/Logout (plain text links)
- [x] navbar.js: Login/Register as solid `btn btn-primary` buttons
- [x] main.js: Delete dead `registrationForm` listener
- [x] Delete `frontend/pages/register.html`

## Task 2: Unify Login to Email, Admin Seeder & Soft Delete
- [x] login.html / auth.js: phone → email fields/payloads
- [x] LoginDto.java: `phone` → `email`
- [x] UserService.loadUserByUsername(): fetch by email, throw DisabledException if inactive
- [x] User entity: add `isActive` field
- [x] Create DataSeeder (CommandLineRunner) with conditional DB wipe + ADMIN creation
- [x] Delete AdminInitializer.java
- [x] ProfileController: `DELETE /api/users/profile` (soft delete)
- [x] dashboard.html + dashboard.js: "Deactivate Account" button

## Task 3: Password Recovery Flow (Mock/Console)
- [x] Create PasswordResetToken entity + repository
- [x] Create ForgotPasswordDto + ResetPasswordDto
- [x] AuthController: `POST /api/auth/forgot-password` + `POST /api/auth/reset-password`
- [x] UserService: token generation + reset logic (console output)
- [x] login.html + auth.js: "Recover account" modal UI

## Task 4: Security Filter Crash & Exception Handling
- [x] JwtRequestFilter: try-catch around loadUserByUsername
- [x] ApiExceptionHandler: DateTimeParseException → 400
- [x] TripDto: `@NotNull` → `@NotBlank` on departureTime
- [x] BookingController: delete obsolete `PATCH /api/bookings/admin/{id}/status`

## Task 5: Controller Role Regression & Capacity Logic
- [x] BookingController: @PreAuthorize on getBooking/cancelBooking includes ADMIN
- [x] TripService: getAllTripsWithCapacity() computing remaining capacity
- [x] TripController: `GET /api/trips` returns TripWithCapacityDto
- [x] routes.js: display actual remaining capacity (flat DTO fields)

## Final
- [x] Compile backend (`./mvnw -q compile`) — PASSES
- [x] Verify frontend references consistent — all 25 fetch() URLs map to existing @RestController endpoints

