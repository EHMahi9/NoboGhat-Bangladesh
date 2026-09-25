# Project presentation notes

## One-minute description

NoboGhat is a web-based inland waterway cargo coordination platform for Bangladesh. Farmers and traders can find boat trips and reserve cargo capacity, while boat owners can publish the transport resources that make those trips possible. The system prevents cargo bookings from exceeding a boat's capacity.

## Problem and solution

River transport participants often coordinate availability manually. NoboGhat digitizes that workflow: it stores boats, routes, scheduled trips, users, and bookings in one database, then exposes them through a browser interface and REST API.

## Technical design

The frontend is static HTML, CSS, and JavaScript. The backend is Spring Boot with Spring Security and JPA/Hibernate. MySQL stores the normalized operational data. The frontend calls REST endpoints, and the backend follows Controller -> Service -> Repository layers. JWT protects private operations; role-based authorization protects administrative analytics.

## Demonstration flow

1. Start MySQL and the Spring Boot backend.
2. Register a Farmer, Trader, or Boat Owner account.
3. Sign in; the API returns a JWT and the user dashboard loads the real profile.
4. Browse public trips. Use an authenticated account to create protected records/bookings.
5. Configure `ADMIN_PHONE` and `ADMIN_PASSWORD`, restart once, then sign in with that account to show the admin analytics dashboard.
6. Optionally configure Google credentials and demonstrate Google sign-in.

## Important engineering decisions

* Passwords are BCrypt-hashed, never stored as plain text.
* The JWT signing secret is configuration-based, so tokens remain valid across restarts when the same secret is retained.
* Backend authorization is the source of truth. The browser additionally redirects non-admin users away from the admin page for a clean user experience.
* Booking capacity is checked in a transaction with a pessimistic trip lock, reducing concurrent overbooking risk.
