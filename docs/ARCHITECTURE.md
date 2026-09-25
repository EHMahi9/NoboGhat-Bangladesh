# NoboGhat architecture

NoboGhat is a three-layer river-cargo booking application.

```text
Browser (static HTML/CSS/JavaScript)
        | HTTPS / JSON + Bearer JWT
        v
Spring Boot REST API
  controllers -> services -> JPA repositories
        |                     |
        |                     v
        +-----------------> MySQL database
```

## Frontend

`frontend/` is a framework-free static website. `assets/js/api.js` selects the local Spring Boot URL during development and the Render backend URL in production.

## Backend

`backend/` is a Spring Boot API. Controllers expose `/api/*`; services hold booking and capacity rules; repositories use Spring Data JPA. The important entities are `User`, `Boat`, `Route`, `Trip`, and `Booking`.

Security uses BCrypt password hashes, JWT bearer tokens, role checks, and consistent JSON `401`/`403` responses. Public visitors can browse trips. Creating bookings and viewing a personal profile needs a token. `/api/admin/**` is restricted to the `ADMIN` role.

## Data model

* A user can own boats and make bookings.
* A boat belongs to one owner and has a cargo capacity.
* A trip joins a boat and a route at a departure time.
* A booking joins a user and a trip with cargo weight and status.
* Booking creation locks the trip and checks existing reserved cargo, preventing capacity overbooking.

The user table uses single-table inheritance for `FARMER`, `TRADER`, `BOAT_OWNER`, and `ADMIN`. Local accounts use `phone`; Google accounts use `email`.

## Deployment

For local development, the static frontend runs on port 5500 and the API on 8080. In production, Render serves the frontend as a static site and the backend as a Docker container. MySQL credentials are environment variables, never frontend code or Git.

## Known scope boundary

The standard dashboard layout still contains sample booking-card text. Authentication, profile data, API security, and admin analytics are live; replacing the remaining sample cards with user-specific booking data is a suitable next feature.
