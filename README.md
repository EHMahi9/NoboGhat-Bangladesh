# 🚢 NoboGhat (নবঘাট বাংলাদেশ) - Modern Inland Waterway Transport Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **NoboGhat** (নবঘাট বাংলাদেশ - *"The Modern Digital River Port"*) is a comprehensive, full-stack river logistics and inland waterway cargo reservation ecosystem designed to digitize, empower, and streamline river freight transport across Bangladesh. Connecting farmers, commodity traders, vessel owners, and port authorities, NoboGhat provides transparent scheduling, capacity-aware reservations, escrow payment protection, and multi-user governance across the nation's vital river arteries.

---

## 🌐 Live Deployments & Endpoints

| Service | Environment | URL |
|---|---|---|
| **Web Application** | Vercel Production | [https://noboghat-bangladesh.vercel.app](https://noboghat-bangladesh.vercel.app) |
| **API Gateway & Backend** | Render Production | [https://noboghat-bangladesh.onrender.com](https://noboghat-bangladesh.onrender.com) |
| **Backend Health Check** | Actuator Probe | [https://noboghat-bangladesh.onrender.com/actuator/health](https://noboghat-bangladesh.onrender.com/actuator/health) |

---

## 📋 Table of Contents

- [Core Problem & Solution](#-core-problem--solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Configuration](#-environment-configuration)
- [Local Development & Setup](#-local-development--setup)
- [API Gateway & Endpoints](#-api-gateway--endpoints)
- [Security & Data Isolation](#-security--data-isolation)
- [SRS & Documentation](#-srs--documentation)
- [Production Deployment](#-production-deployment)

---

## 🎯 Core Problem & Solution

### The Challenge
Inland water transport carries millions of metric tons of agricultural commodities, construction materials, and essential goods across Bangladesh's rivers daily. Traditionally, river logistics has suffered from:
- **Broker Exploitation & Opaque Pricing:** Farmers and traders face unstandardized freight charges and erratic middleman commissions.
- **Underutilized Vessel Capacity:** Boat operators endure empty return voyages and unpredictable cargo booking cycles.
- **Overloading & Navigational Risks:** Lack of verified draft checks and live capacity tracking leads to safety hazards.
- **Disjointed Booking Records:** Absence of standardized waybills, verifiable delivery PINs, or reliable payment records.

### The NoboGhat Solution
NoboGhat establishes a centralized, digital river logistics network:
1. **Dynamic Capacity Governance:** Real-time hold calculations prevent boat overloading and guarantee exact kilogram capacity limits.
2. **Standardized BIWTA Tariff Computation:** Regulated corridor pricing (`Cargo Weight (kg) × Route Price per kg`) with transparent tariff escrow.
3. **Strict Multi-User Isolation:** Comprehensive tenant isolation ensuring users only access their own cargo consignments, payments, and invoices.
4. **Bilingual Accessibility:** Instant one-click toggle between Bengali (বাংলা) and English across all interfaces and waybills.
5. **Interactive Consignment Waybills:** Deterministic 4-digit PIN verification system for cargo delivery handover at destination ghats.
6. **Simulated Escrow Payment Rails:** Seamless bKash and SSLCommerz payment integration with instant status reconciliation.

---

## ✨ Key Features

### 👤 Role-Based Portals & Capabilities
- **🌾 Farmers & Traders (কৃষক ও ব্যবসায়ী):**
  - Search river routes between major ghats (Sadarghat, Narayanganj, Chandpur, Barisal, Khulna, Bhola, etc.).
  - Inspect vessel hold capacity, departure schedules, and verified draft clearance before reserving.
  - Book cargo consignments with instant automated freight fare computation.
  - Track consignment lifecycle (`PENDING` ➔ `CONFIRMED` ➔ `IN TRANSIT` ➔ `DELIVERED`).
  - Generate official PDF/printable Consignment Waybills (চালান বিবরণী) with delivery PINs.
  - Make secure escrow payments via bKash or credit/debit cards.
- **⛵ Boat Owners & Masters (মাঝি ও নৌযান মালিক):**
  - Register vessels (dimensions, engine power, maximum hold capacity in kg).
  - Schedule sailing departures and define recurring waterway timetables.
  - Inspect manifests of booked cargo consignments and manage loading schedules.
- **🛡️ Port Administrators (সিস্টেম অ্যাডমিন):**
  - Unified operational dashboard with real-time river traffic, total cargo tonnage, and active vessel telemetry.
  - Full CRUD control over river corridors, navigational waypoints, and government-approved tariff rates.
  - User moderation, role assignment, and system-wide booking audit logging.

### 🌊 Maritime & River Navigational Features
- **BIWTA River Warning Signals:** Real-time navigational signal bar with safe channel indicators and river weather advisories.
- **Live Ghat-to-Ghat Tracking:** Visual journey progression showing source, transit checkpoints, and destination ports.
- **Zero-Flicker Bilingual Engine:** Instantaneous language switcher preserving user preference in persistent local storage.

---

## 🏗 System Architecture

NoboGhat utilizes a modern, resilient decoupled architecture:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                          │
│                                                                             │
│   Next.js 15 App Router  •  React 19  •  Tailwind CSS v4  •  Lucide Icons   │
│   [LanguageContext (BN/EN)] ── [AuthContext (JWT)] ── [Dashboard UI]        │
└───────────────────────┬─────────────────────────────────┬───────────────────┘
                        │ HTTPS (REST API)                │ Multipart Form Data
                        ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FULL-STACK API GATEWAY (PORT 3000)               │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │   /api/[...path]/route.ts (Proxy, Resilient Fallback & File Store)  │   │
│   │   • JWT Identity Extraction & Multi-Tenant Data Isolation           │   │
│   │   • Local JSON Storage Fallback (User Profiles, Bookings, Txns)     │   │
│   │   • Instant Avatar Upload & Direct Image Streaming Service          │   │
│   │   • Live System Statistics Aggregator (/api/stats)                  │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ Upstream Reverse Proxy
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE BACKEND SERVICE (PORT 8080)                   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Spring Boot 4.1.0 (Java 21)                  │   │
│   │   SecurityFilter (Stateless JWT) ➔ Controllers ➔ Services ➔ JPA      │   │
│   │   • Pessimistic Locking Concurrency for Vessel Hold Allocation      │   │
│   │   • Spring Boot Actuator Probes (/actuator/health)                  │   │
│   └──────────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ Hibernate ORM / JDBC
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PERSISTENCE TIER                               │
│                                                                             │
│   Production: MySQL 8.0+ (InnoDB Engine, UTF-8mb4 Character Set)            │
│   Local Dev:  In-Memory H2 Engine / SQLite / Local Storage JSON             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Technology Stack

| Layer | Technologies / Packages | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js `15.5.x`, React `19.1.x` | Modern App Router, Server Components & Client Hydration |
| **Language** | TypeScript `5.9.x` | End-to-end type safety, strict interface contracts |
| **Styling & UI** | Tailwind CSS `v4.0`, PostCSS, Lucide React | Glassmorphic design, responsive layouts, iconography |
| **Localization** | Custom Context Engine (`LanguageContext`) | Instant bilingual translation (Bengali & English) |
| **State & Auth** | Custom `AuthContext`, JWT Bearer Tokens | Secure session management, sliding token storage |
| **Backend Service** | Spring Boot `4.1.0`, Java `21 LTS` | Robust enterprise REST controllers, services & DTOs |
| **Database & ORM** | MySQL `8.0+`, Spring Data JPA, Hibernate 6 | Relational persistence, transactional safety |
| **Containerization**| Docker Multi-Stage (`eclipse-temurin:21`) | Containerized backend builds for cloud deployments |
| **Cloud Hosting** | Vercel (Frontend), Render (Backend Service) | Zero-configuration serverless web hosting & container runner |

---

## 📁 Project Directory Structure

```
NoboGhat/
├── backend/                             # Spring Boot Java 21 Enterprise Service
│   ├── src/main/java/com/noboghat/mahi/ # Controllers, Models, Repositories, Services
│   ├── src/main/resources/             # Application properties & SQL migrations
│   ├── Dockerfile                       # Multi-stage production container build
│   ├── pom.xml                          # Maven build dependencies
│   ├── .env.example                     # Backend environment template
│   └── mvnw, mvnw.cmd                   # Maven wrapper executables
├── docs/                                # Technical documentation & architecture
│   ├── srs/                             # Formal SRS and Project Proposal PDFs
│   ├── ARCHITECTURE.md                  # Detailed architectural decisions
│   ├── GOOGLE_LOGIN_SETUP.md            # OAuth2 integration walkthrough
│   └── PRESENTATION_NOTES.md            # Project presentation and evaluation notes
├── public/                              # Static public assets
│   ├── images/                          # NoboGhat branding logos, SVG icons, hero slides
│   └── uploads/                         # Avatar storage directory (.gitkeep tracked)
├── src/                                 # Next.js Application Source
│   ├── app/                             # Next.js App Router Pages & API Routes
│   │   ├── about/                       # About Us & Mission page
│   │   ├── admin/                       # Administrator Control Center
│   │   ├── api/[...path]/               # Full-Stack Reverse Proxy & Fallback Gateway
│   │   ├── dashboard/                   # User Consignment & Fleet Dashboard
│   │   ├── login/                       # Secure Sign-In page
│   │   ├── payment/                     # Escrow Payment Gateway & Receipt page
│   │   ├── privacy/                     # Privacy Policy page
│   │   ├── register/                    # User Registration page
│   │   ├── routes/                      # Waterway Route Browser & Booking page
│   │   ├── terms/                       # Terms of Service & River Safety Advisories
│   │   ├── layout.tsx                   # Root HTML Layout with Providers
│   │   ├── page.tsx                     # Landing Page with Hero Carousel & Live Stats
│   │   └── globals.css                  # Tailwind CSS theme & utilities
│   ├── components/                      # Reusable React UI Components
│   │   ├── Navbar.tsx                   # Sticky Header with Language Switcher & Profile
│   │   ├── Footer.tsx                   # Footer with Navigation Links & Disclaimers
│   │   ├── ProfileSection.tsx           # Multi-Tab Account Settings & Photo Uploader
│   │   └── RoleSelectionModal.tsx       # First-Time User Role Onboarding Dialog
│   ├── context/                         # Global State Context Providers
│   │   ├── AuthContext.tsx              # User Authentication & Token Management
│   │   └── LanguageContext.tsx          # Bilingual Dictionary & Translation Hooks
│   ├── lib/                             # Core Utilities
│   │   └── api.ts                       # Authenticated Fetch API Wrapper
│   └── middleware.ts                    # Edge Routing Middleware
├── .env.example                         # Client environment template
├── .gitignore                           # Comprehensive git ignore rules
├── next.config.ts                       # Next.js configuration
├── package.json                         # Node dependencies & npm scripts
├── render.yaml                          # Render infrastructure deployment blueprint
└── tsconfig.json                        # TypeScript compiler options
```

---

## ⚙️ Environment Configuration

### Next.js Frontend Configuration (`.env.local`)
Copy the template file to configure your local Next.js client:
```bash
cp .env.example .env.local
```

Contents of `.env.example`:
```env
# Client API Base URL (defaults to internal proxy /api)
NEXT_PUBLIC_API_URL=/api

# Upstream Spring Boot Backend URL
# Production: https://noboghat-bangladesh.onrender.com
# Local development with Spring Boot: http://localhost:8080
BACKEND_API_URL=https://noboghat-bangladesh.onrender.com

# Runtime Environment
NODE_ENV=development
```

### Spring Boot Backend Configuration (`backend/.env`)
Copy the backend template:
```bash
cp backend/.env.example backend/.env
```

Contents of `backend/.env.example`:
```env
# Database Configuration (Use H2 for zero-setup local dev)
DB_URL=jdbc:h2:mem:noboghatdb;DB_CLOSE_DELAY=-1;MODE=MySQL
DB_USERNAME=sa
DB_PASSWORD=
DB_PORT=3306

# Authentication Secrets
JWT_SECRET=generate-a-random-secure-secret-key-of-at-least-32-characters
SERVER_PORT=8080

# Initial Admin Credentials
ADMIN_EMAIL=admin@noboghat.com
ADMIN_PASSWORD=your-secure-admin-password
```

---

## 🚀 Local Development & Setup

### Prerequisites
- **Node.js:** `v18.18+` or `v20+` (LTS recommended)
- **npm:** `v9+` or `pnpm` / `yarn`
- **Java JDK:** `21 LTS` (Optional, if running local Spring Boot backend)

### Step 1: Clone Repository
```bash
git clone https://github.com/EHMahi9/NoboGhat-Bangladesh.git
cd NoboGhat-Bangladesh
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Run Next.js Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The application will start immediately with the resilient API gateway connected to the cloud service.

### Step 4 (Optional): Run Spring Boot Backend Locally
If you want to run the Java Spring Boot service locally:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows PowerShell, use `.\mvnw.cmd spring-boot:run`)*

---

## 🔌 API Gateway & Endpoints

All client requests route through the Next.js API Gateway (`/api/*`), which proxies to the upstream service and provides automatic failover:

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | No | Register new user (Farmer, Trader, Boat Owner) |
| `/api/auth/login` | `POST` | No | Authenticate user and issue JWT bearer token |
| `/api/auth/google` | `GET` | No | Initiate Google OAuth2 Single Sign-On flow |
| `/api/users/profile` | `GET` | Yes | Retrieve authenticated user profile & role |
| `/api/users/profile` | `PUT` | Yes | Update profile name, phone, email, or avatar |
| `/api/users/update-role` | `PUT` | Yes | Onboarding role assignment for Google users |
| `/api/files/upload` | `POST` | Yes | Upload avatar image (multipart form data) |
| `/api/files/:fileName` | `GET` | No | Stream avatar image directly |
| `/api/routes` | `GET` | No | Fetch list of active river corridors & tariffs |
| `/api/trips` | `GET` | No | Search scheduled river voyages & available capacity |
| `/api/bookings` | `GET` | Yes | Get user-isolated bookings (or all for Admin) |
| `/api/bookings` | `POST` | Yes | Create capacity-checked cargo reservation |
| `/api/bookings/:id/pay`| `POST` | Yes | Process escrow payment via bKash / cards |
| `/api/payments/webhook`| `POST` | No | Reconciliation webhook for payment callbacks |
| `/api/stats` | `GET` | No | Live platform statistics (routes, boats, users) |

---

## 🔒 Security & Data Isolation

1. **Strict Multi-Tenant Isolation:**
   - Every booking created is stamped with the caller's unique user identifier.
   - `GET /api/bookings` strictly scopes results to the authenticated user.
   - Users cannot view, modify, or pay for consignments belonging to another account.
2. **Stateless JWT Tokens:**
   - Bearer authentication using signed tokens.
   - User roles (`FARMER`, `TRADER`, `BOAT_OWNER`, `ADMIN`) are verified on every protected transaction.
3. **Pessimistic Hold Locking:**
   - Database transactions lock trip rows during reservation to guarantee that simultaneous bookings cannot exceed vessel cargo limits.
4. **Resilient Local File Storage:**
   - Avatars are streamed with strict MIME type checking, preventing malicious file execution.
5. **Credential Safety:**
   - All secret `.env` and `.env.local` files are strictly gitignored to prevent accidental exposure of production credentials.

---

## 📚 SRS & Documentation

Formal project requirements, architecture specifications, and design artifacts are located in [`docs/`](docs/):
- **[System Architecture](docs/ARCHITECTURE.md)**: Deep architectural overview and layer breakdown.
- **[SRS & Blueprints](docs/srs/)**: PDF specifications covering project proposals, requirements analysis, and system architecture blueprints.
- **[Google OAuth2 Walkthrough](docs/GOOGLE_LOGIN_SETUP.md)**: Guide for setting up Google Sign-In credentials.

---

## 🚢 Production Deployment

### Frontend (Vercel)
The Next.js application deploys seamlessly to Vercel:
1. Connect repository on [Vercel Dashboard](https://vercel.com).
2. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `/api`
   - `BACKEND_API_URL`: `https://noboghat-bangladesh.onrender.com`
3. Click **Deploy**.

### Backend (Render)
The Spring Boot service builds via the root [`render.yaml`](render.yaml) blueprint:
1. Create a Web Service on Render linked to this repository.
2. Render automatically builds the multi-stage [`backend/Dockerfile`](backend/Dockerfile).
3. Connect a Managed MySQL instance or use cloud database connection strings.

---

## 👥 Authors & Acknowledgments

- **Lead Developer:** [EHMahi9](https://github.com/EHMahi9)
- **Institution:** Daffodil International University (DIU)
- **Department:** Software Engineering
