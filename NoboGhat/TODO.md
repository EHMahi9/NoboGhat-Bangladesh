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

## Task 6: DataSeeder Production-Safe
- [x] DataSeeder: try-catch around DB wipe (never crash startup)
- [x] DataSeeder: remove @Transactional from run()
- [x] DataSeeder: FK-safe deletion order (token → booking → trip → boat → notification → route → user)
- [x] DataSeeder: guaranteed ADMIN creation
- [x] Compile + push to origin

## Task 7: Navbar Routing & Button Aesthetics (UI/UX)
- [x] navbar.js: dynamic base path — fixes 404 on `/pages/*` subpages (Login/Register/Dashboard links)
- [x] navbar.js: logout redirects to correct home path (`../index.html` on subpages, `index.html` on root)
- [x] navbar.js: `.auth-btn-nav` container uses `gap: 10px` flex spacing
- [x] navbar.js: Login = outlined/ghost button (`.nav-auth-btn.btn-outline`), Register = solid (`.nav-auth-btn.btn-primary`)
- [x] navbar.css: new `.nav-auth-btn` styles + `.auth-btn-nav` gap
- [x] index.html / routes.html: static auth nav markup aligned to new classes
- [x] buttons.css: `.btn-outline` now has proper color, padding, hover state

## Task 8: About Us Page Overhaul
- [x] about.html: full redesign — hero, Mission & Vision, The Problem We Solve, Who We Serve, CTA
- [x] about.html: uses global navbar.js (auth-aware) + standard site footer
- [x] about.css: new page styles (hero, MV cards, problem cards, persona cards, CTA)
- [x] Mission: "Reduce transport barriers for rural communities through accessible technology"
- [x] Vision: "To become Bangladesh's trusted digital platform for inland water logistics and shared cargo transport."
- [x] Problem section: fragmented communication, broker reliance, underutilized boats
- [x] Who We Serve: 3 persona cards (Farmers / Small Traders / Boat Owners)

## Final Verification
- [x] Backend compiles (`./mvnw -q compile`) — PASSES
- [x] Frontend fetch() URLs all map to existing @RestController endpoints
- [x] Navbar JS syntax valid (node --check)
- [x] Frontend static serving verified (all pages return 200)

