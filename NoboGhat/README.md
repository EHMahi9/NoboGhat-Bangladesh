# NoboGhat: River Cargo Booking Platform

A modern, full-stack web application for managing river cargo transport coordination in Bangladesh. NoboGhat digitizes the informal process of connecting farmers and traders (cargo providers) with boat owners (transport providers) for inland waterway logistics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [For Lecturers](#for-lecturers)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**NoboGhat** (নোবো ঘাট - "New Riverbank/Port") is a Desktop & Web Programming Lab project solving river transport coordination challenges in Bangladesh.

### Problem
- Farmers/traders struggle to find boat capacity
- Boat owners lack visibility into cargo demand
- Manual coordination is inefficient and error-prone
- No central platform for booking and tracking

### Solution
- **Unified marketplace** connecting cargo providers with boat owners
- **Capacity-aware booking** preventing overbooking
- **Role-based access** for different user types
- **Administrative oversight** with analytics dashboard

---

## ✨ Key Features

- 🔐 Secure authentication (BCrypt + JWT + Google OAuth2)
- 👤 Role-based accounts (Farmer, Trader, Boat Owner, Admin)
- 🔍 Trip discovery and browsing
- 📦 Capacity-aware booking with real-time validation
- 📊 Admin analytics dashboard
- 📱 Responsive design for all devices
- 🎨 Modern UI with vanilla JavaScript

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 4.1.0, Java 25, JPA/Hibernate |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Database** | MySQL 8.0+ |
| **Security** | Spring Security, JWT, BCrypt |
| **Auth** | Local + Google OAuth2 |
| **DevOps** | Render (backend & frontend) |

---

## 🏗 Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────┐
│   Presentation (Frontend)       │
│ HTML/CSS/JS → Static Website    │
└──────────────┬──────────────────┘
               │ API + JWT
┌──────────────▼──────────────────┐
│  Business Logic (Spring Boot)   │
│ Controllers → Services →        │
│ Repositories → Entities         │
└──────────────┬──────────────────┘
               │ JDBC
┌──────────────▼──────────────────┐
│   Data (MySQL)                  │
│ Users, Boats, Routes, Trips,    │
│ Bookings, Payments              │
└─────────────────────────────────┘
```

### Data Flow

```
1. User on frontend.html enters credentials
2. JavaScript sends: POST /api/auth/login
3. Spring Boot AuthController receives request
4. UserService validates phone & password (BCrypt)
5. JwtUtil generates JWT token
6. Token returned to frontend
7. Stored in localStorage
8. Included in all future API requests (Authorization header)
9. Each request validated by Spring Security filter
10. Response processed and displayed in browser
```

---

## 🚀 Quick Start

### Prerequisites
- Java 25+
- MySQL 8.0+
- Maven 3.8.1+ (bundled with `mvnw`)

### Setup (5 minutes)

```bash
# 1. Clone project
git clone <url>
cd NoboGhat

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env: set DB_USERNAME, DB_PASSWORD, JWT_SECRET

# 3. Start backend
./mvnw spring-boot:run
# Running on http://localhost:8080

# 4. Start frontend (new terminal)
cd frontend
python -m http.server 5500
# Running on http://localhost:5500

# 5. Open browser
# Visit: http://localhost:5500
# Register → Login → Explore!
```

---

## 📁 Project Structure

```
NoboGhat/
├── backend/
│   ├── src/main/java/.../
│   │   ├── config/              # Spring configuration
│   │   ├── controller/          # REST endpoints (/api/*)
│   │   ├── service/             # Business logic
│   │   ├── model/               # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── repository/          # Database access
│   │   └── security/            # JWT & authentication
│   ├── pom.xml                  # Maven dependencies
│   └── .env.example             # Configuration template
├── frontend/
│   ├── index.html               # Landing page
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── admin.html
│   │   └── routes.html
│   └── assets/
│       ├── css/                 # Stylesheets
│       ├── js/                  # JavaScript files
│       └── images/              # SVGs, icons, images
├── database/
│   ├── schema.sql               # Database structure
│   └── migration-v2-auth.sql    # OAuth migration
└── docs/
    ├── ARCHITECTURE.md          # Technical design
    ├── GOOGLE_LOGIN_SETUP.md    # OAuth configuration
    └── PRESENTATION_NOTES.md    # Demo script
```

---

## 🔌 API Endpoints

### Public
```
GET  /api/trips              # List all trips
GET  /api/routes             # List all routes
POST /api/auth/register      # Create account
POST /api/auth/login         # Login
```

### Authenticated (Requires JWT in Authorization header)
```
GET  /api/profile            # User profile
POST /api/bookings           # Create booking
GET  /api/bookings           # User's bookings
POST /api/boats              # Create boat (boat owner)
```

### Admin Only
```
GET  /api/admin/dashboard    # Analytics
```

---

## 🔄 How It Works

### 1. User Registration
```
User Form (register.html)
  ↓
POST /api/auth/register {name, phone, password, role}
  ↓
UserService.registerNewUser()
  - Validate phone not already registered
  - Hash password with BCrypt
  - Create User entity with appropriate role (Farmer/Trader/Owner)
  ↓
Save to MySQL users table
  ↓
Response: userId, name, role
  ↓
Frontend redirects to login
```

### 2. User Login
```
Login Form (login.html)
  ↓
POST /api/auth/login {phone, password}
  ↓
Spring Security AuthenticationManager
  - Find user by phone
  - Compare password with BCrypt hash
  ↓
JwtUtil.generateToken(userDetails)
  - Create JWT with phone as subject
  - Sign with HS256 + secret key
  ↓
Response: {token, phone, role}
  ↓
session.js saves token to localStorage
  ↓
Frontend redirects to dashboard.html
```

### 3. Booking Creation (Capacity Check)
```
Booking Form (dashboard.html)
  ↓
POST /api/bookings {tripId, cargoWeight}
Header: Authorization: Bearer <jwt_token>
  ↓
BookingController validates JWT
  ↓
BookingService.createBooking()
  - Lock trip with PESSIMISTIC_WRITE lock
  - Query existing bookings: SELECT SUM(cargoWeight) FROM bookings
    WHERE trip_id = ? AND status IN ('PENDING', 'CONFIRMED')
  - Calculate: reserved = sum of existing bookings
  - Check: reserved + newWeight ≤ boat.capacity
  ↓
  If valid:
    - Save Booking with status=PENDING
    - Unlock trip
    - Return success
  Else:
    - Throw BookingException
    - Return 400 Bad Request
  ↓
Frontend displays success/error message
```

### 4. Admin Dashboard
```
Admin user visits /pages/admin.html
  ↓
dashboard.js sends: GET /api/admin/dashboard
Header: Authorization: Bearer <admin_token>
  ↓
Spring Security checks:
  - Token valid?
  - User has ROLE_ADMIN?
  ↓
AdminService.getDashboardStats()
  - Count total users
  - Count total boats
  - Count total bookings
  - Sum total cargo weight
  ↓
Response: {totalUsers, totalBoats, totalBookings, totalCargoWeight}
  ↓
Frontend renders analytics charts
```

---

## 🗄 Database Schema

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | userId (PK), name, phone (UNIQUE), email, passwordHash, role |
| boats | Vessels | boatId (PK), name, capacity (kg), owner_id (FK) |
| routes | Geographic paths | routeId (PK), source, destination |
| trips | Scheduled journeys | tripId (PK), route_id (FK), boat_id (FK), departure_time |
| bookings | Cargo reservations | bookingId (PK), user_id (FK), trip_id (FK), cargoWeight, status |
| payments | Transactions | paymentId (PK), booking_id (FK), amount |

### Relationships
```
User (1) ──owns──→ (many) Boat
Boat (1) ──scheduled──→ (many) Trip
Route (1) ──uses──→ (many) Trip
Trip (1) ──has──→ (many) Booking
User (1) ──creates──→ (many) Booking
Booking (1) ──associated──→ (one) Payment
```

### Booking Capacity Logic
```
Scenario: Boat capacity = 5000 kg

Booking 1: 1500 kg → Reserved: 1500 kg ✅
Booking 2: 2000 kg → Reserved: 3500 kg ✅
Booking 3: 1500 kg → Reserved: 5000 kg ✅ (at limit)
Booking 4: 100 kg → Reserved would be: 5100 kg ❌ REJECTED

Check: SELECT SUM(cargoWeight) FROM bookings 
       WHERE trip_id = ? AND status IN ('PENDING', 'CONFIRMED')
Result + newWeight > capacity → REJECT
```

---

## 🔐 Security

### Authentication Methods

**1. Local Authentication**
- Username: Phone number
- Password: BCrypt-hashed (10 rounds)
- Storage: MySQL users table
- Validation: Spring Security AuthenticationManager

**2. JWT (JSON Web Tokens)**
- Generation: POST /api/auth/login
- Content: {phone, issued_at, expiration}
- Signature: HS256 with secret key
- Expiration: 10 hours (configurable)
- Storage: Browser localStorage
- Transmission: Authorization: Bearer <token>

**3. OAuth2 (Google Login) - Optional**
- Setup: Google Cloud Console OAuth credentials
- Process: Redirect → Google → Authorization Code → JWT
- User Creation: Auto-created by email if not exists
- Default Role: FARMER

### Password Security
```java
// NEVER store plain text
passwordHash = new BCryptPasswordEncoder().encode(rawPassword);

// Validation
encoder.matches(inputPassword, storedHash) // returns true/false
```

### JWT Security
```
Secret Key: Minimum 32 characters
Algorithm: HS256 (HMAC with SHA-256)
Expiration: Tokens expire and require re-login
Transmission: Only over HTTPS in production
Storage: localStorage (vulnerable to XSS, but no alternative for SPA)
```

### Role-Based Authorization
```
Public:     Anyone can browse trips/routes
Authenticated: Need valid JWT for bookings/profile
Admin:      Need JWT + ADMIN role for analytics
```

---

## 🎓 For Lecturers: Project Description

### What This Project Teaches

| Concept | Implementation |
|---------|-----------------|
| **Three-Tier Architecture** | Presentation (HTML/JS) → Logic (Spring) → Data (MySQL) |
| **REST API Design** | HTTP methods, status codes, JSON payloads |
| **Database Design** | Normalization, foreign keys, relationships |
| **Security** | Password hashing (BCrypt), JWT tokens, role-based access |
| **Frontend-Backend** | CORS, Fetch API, async/await, localStorage |
| **ORM & JPA** | Entity mapping, repositories, JPQL queries |
| **Dependency Injection** | Spring constructor injection, service layer |
| **Transaction Management** | Pessimistic locking, JDBC transactions |
| **DevOps** | Environment configuration, cloud deployment |

### How to Present (5-10 minutes)

1. **Problem** (1 min): Manual river transport coordination inefficient
2. **Solution** (1 min): Digital platform connecting all stakeholders
3. **Architecture** (2 min): Show three-layer diagram, explain flow
4. **Demo** (3 min): Register → Login → Browse trips → Create booking
5. **Tech Stack** (2 min): Spring Boot backend, vanilla JS frontend, MySQL
6. **Key Features** (1 min): JWT auth, capacity checking, admin dashboard
7. **Deployment** (1 min): Render backend & frontend

### Interview Answer

> "NoboGhat is a full-stack web application that connects cargo providers with boat owners for river transport in Bangladesh. The backend is built with Spring Boot 4.1 and Java 25, implementing a REST API with JWT authentication and role-based authorization. I used JPA/Hibernate for ORM, with a MySQL database using normalized schema. The frontend is vanilla JavaScript with HTML5/CSS3, making async API calls via Fetch. Key implementation includes BCrypt password hashing, pessimistic locking for capacity validation, and Google OAuth2 integration. I deployed it on Render for both the backend and frontend. The project demonstrates three-tier architecture, RESTful design, security best practices, and full-stack development."

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8080 already in use**
```bash
# Windows: Find & kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in .env: SERVER_PORT=8081
```

**MySQL Connection Failed**
```
✓ MySQL server running (Services → MySQL80)
✓ .env credentials match (DB_USERNAME, DB_PASSWORD)
✓ Database created (auto-created if not exists)
✓ Connection string correct in application.properties
```

**JWT Signature Mismatch**
```
Cause: JWT_SECRET changed between restarts
Fix: Use same JWT_SECRET value in .env
Note: In production, handle token rotation properly
```

### Frontend Issues

**CORS Error: "Access to XMLHttpRequest blocked"**
```
Check:
1. Backend running on http://localhost:8080
2. Frontend on http://localhost:5500
3. CORS_ALLOWED_ORIGINS includes http://localhost:5500
4. Backend restarted after changing config
```

**"Cannot find token" - Stuck on login page**
```
Debug:
1. DevTools → Application → localStorage → "jwtToken"
2. Check login response contains "token" field
3. Verify session.js storing token correctly
```

**API returns 401 Unauthorized**
```
Possible causes:
- JWT expired (default 10 hours) → login again
- Token not sent in Authorization header
- User deleted after token issued
- Token tampered or corrupted
```

---

## 📈 Future Enhancements

- **Phase 2**: Payment gateway, real-time notifications, GPS tracking
- **Mobile**: React Native app for iOS/Android
- **Advanced**: Microservices, caching (Redis), analytics dashboards

---

## 📞 Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical design details
- [GOOGLE_LOGIN_SETUP.md](./docs/GOOGLE_LOGIN_SETUP.md) - OAuth configuration
- [PRESENTATION_NOTES.md](./docs/PRESENTATION_NOTES.md) - Demo walkthrough

---

## ✅ Quick Verification Checklist

- [ ] Java 25 installed
- [ ] MySQL running locally
- [ ] Backend `.env` configured
- [ ] Backend starts on port 8080
- [ ] Frontend accessible on port 5500
- [ ] Can register and login
- [ ] Can browse trips
- [ ] Can create booking
- [ ] Admin dashboard works

---

**Project Status**: ✅ Complete & Production-Ready  
**Version**: 1.0.0  
**Last Updated**: July 2024  
**Semester**: Desktop & Web Programming Lab (SE 236)
