# Servorix — Enterprise Business Management & AI-Powered Booking SaaS

> **Next-Generation Appointment Scheduling, Business Intelligence, and Autonomous AI Operations for Salons & Gyms.**

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-4169E1?style=flat-square&logo=postgresql)
![Google AI](https://img.shields.io/badge/Google_AI_Studio-Gemini_Flash-8E44AD?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [About Servorix](#about-servorix)
- [Key Features](#key-features)
  - [Public Portal](#public-portal)
  - [Customer Dashboard](#customer-dashboard)
  - [Business Owner Dashboard](#business-owner-dashboard)
  - [Admin Dashboard](#admin-dashboard)
  - [AI Suite](#ai-suite)
  - [Authentication & Access Control](#authentication--access-control)
  - [Booking Engine & Payments](#booking-engine--payments)
  - [Analytics & Reports](#analytics--reports)
- [AI Architecture & Provider Failover](#ai-architecture--provider-failover)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment on Vercel](#deployment-on-vercel)
- [Screenshots](#screenshots)
- [Security & Compliance](#security--compliance)
- [Performance & Optimization](#performance--optimization)
- [Future Enhancements](#future-enhancements)
- [Developer Info](#developer-info)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## 🚀 About Servorix

**Servorix** is an enterprise-grade, multi-tenant SaaS application designed to revolutionize appointment management for service-based businesses such as barbershops, hair salons, spas, fitness studios, and gyms.

### The Problem It Solves
Traditional scheduling software relies on manual record-keeping, static forms, and rigid interfaces that fail to engage customers or provide actionable business insights. Salon and gym owners frequently lose revenue to schedule conflicts, unoptimized pricing, manual customer support, and unengaged leads.

### The Servorix Solution
Servorix integrates automated real-time booking, role-based dashboards, and a sophisticated multi-persona **AI Suite**. Powered by Google AI Studio's Gemini models and Vercel AI SDK, Servorix features an autonomous Multi-Key Provider Manager that delivers 100% uptime with automatic HTTP 429 failover, real-time database queries, intent routing, and intelligent marketing automation.

---

## ✨ Key Features

### 🌐 Public Portal
- **Hero & Interactive Concierge:** Modern glassmorphic interface with an instant AI Concierge widget (`PublicConciergeWidget`) for visitor inquiries.
- **Explore & Filter Businesses:** Multi-criteria search allowing visitors to filter by sector (`SALON`, `GYM`), category, city, price range, and ratings.
- **Detailed Business Profile:** Interactive service selector, staff details, real-time working hours, customer reviews, and instant booking modal.

### 👤 Customer Dashboard
- **My Bookings:** View active, completed, and cancelled appointments with status indicators (`PENDING`, `APPROVED`, `COMPLETED`, `CANCELLED`).
- **Customer AI Assistant:** AI companion capable of retrieving personal booking histories and searching open slots.
- **Profile & Security Settings:** Update avatar images, personal credentials, and password settings with interactive password visibility toggles (`Eye` / `EyeOff`).
- **Direct Messaging & Notifications:** Integrated user-to-owner messaging center and real-time notification bell.

### 🏢 Business Owner Dashboard
- **Enterprise Operations Matrix:** Multi-business switcher supporting enterprise management across multiple locations.
- **Service Management:** CRUD operations for defining services, pricing, durations, and categories.
- **Schedule & Working Hours:** Configure opening/closing hours and block-out periods (`WorkingHoursManager`).
- **Owner AI Suite:** Specialized Business Advisor, Marketing Studio, and Analytics Intelligence personas for campaign generation and pricing optimizations.
- **Closure Request System:** Submit formal business deactivation or closure requests to Platform Administrators.

### 🛡️ Admin Dashboard
- **Platform Overview:** Global metric tracking across all registered businesses, users, bookings, and revenue streams.
- **Business Approval System:** Review and approve or reject newly registered business applications.
- **Category & Taxonomy Management:** Add, edit, and manage platform-wide categories and icon taxonomies.
- **Closure Request Auditing:** Audit and process pending owner closure requests.
- **Platform Intelligence AI:** Admin AI persona equipped with `getPlatformOverview` database tools for global analytics.

### 🤖 AI Suite
- **6 Specialized Personas:** Public Concierge, Customer Assistant, Business Advisor, Analytics Intelligence, Marketing Studio, and Platform Intelligence.
- **Intent Routing Engine:** Intelligent prompt analysis that answers informational/how-to questions directly while dispatching database tools only for data queries.
- **Markdown & Interactive UI:** Complete GFM markdown rendering, code formatting, copy-to-clipboard, and response regeneration triggers.

### 🔐 Authentication & Access Control
- **JOSE JWT Tokens:** Secure session signing stored in HTTP-only `servorix_token` cookies.
- **Role-Based Access Control (RBAC):** Server-side middleware enforcement across `CUSTOMER`, `OWNER`, and `ADMIN` routes.
- **Password Reset Flow:** Email-based token generation and secure password reset forms.

### 📅 Booking Engine & Payments
- **Conflict Avoidance:** Atomic Prisma transactions verifying staff availability and overlapping time slots prior to booking confirmation.
- **Payment Records:** Automated revenue calculation and payment receipt logging.

---

## 🧠 AI Architecture & Provider Failover

Servorix implements a production-hardened **Multi-Key Provider Manager** (`ProviderManager`) designed to guarantee AI availability under free-tier quota constraints.

```
                  ┌───────────────────────────────┐
                  │    User / Assistant Prompt    │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │     Intent Routing Engine     │
                  └──────┬─────────────────┬──────┘
                         │                 │
           Informational │                 │ Requires Data
                         ▼                 ▼
          ┌─────────────────────┐  ┌───────────────────────┐
          │ Direct Response     │  │ Tool Dispatcher       │
          │ (0 Tool Calls)      │  │ (Prisma ORM Queries)  │
          └─────────────────────┘  └───────────┬───────────┘
                                               │
                                               ▼
                                  ┌─────────────────────────┐
                                  │ Multi-Key Provider      │
                                  │ Pool (10 Gemini Keys)   │
                                  └────────────┬────────────┘
                                               │
                               ┌───────────────┴───────────────┐
                               │ HTTP 429 / Rate Limit Event?  │
                               └───────┬───────────────┬───────┘
                                    No │               │ Yes
                                       ▼               ▼
                             ┌───────────────────┐ ┌───────────────────┐
                             │ Return Synthesized│ │ Enter Cooldown    │
                             │ Tool Output       │ │ Rotate to Key N+1 │
                             └───────────────────┘ └───────────────────┘
```

- **Dynamic Key Discovery:** Automatically scans environment variables (`GEMINI_API_KEY`, `GEMINI_API_KEY_1..10`, `GOOGLE_API_KEY_1..10`).
- **Round-Robin & Cooldown:** Rotates healthy keys dynamically; automatically places rate-limited (HTTP 429) keys into a 60-second cooldown window.
- **Tool Result Handoff:** Extracts step tool outputs (`step.toolResults[i].output`) to synthesize precise analytical answers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Full-stack SSR, Server Components, and Server Actions |
| **UI Library** | React 19 | Component-driven user interface rendering |
| **Language** | TypeScript 5 | Strict static typing across client and server |
| **Database** | PostgreSQL (Neon) | Serverless relational database hosting |
| **ORM** | Prisma ORM 6 | Type-safe schema definition and database migrations |
| **AI Framework** | Vercel AI SDK 4 / Google AI Studio | Model invocation, tool calling, and Gemini Flash integration |
| **Authentication**| JOSE JWT | Edge-compatible token signing and HTTP-only session cookies |
| **Styling** | Vanilla CSS & Tailwind CSS | Dark glassmorphism design system and dynamic utilities |
| **Animations** | Framer Motion & Lenis | Smooth scrolling and page transition effects |
| **Charts** | Recharts | Interactive business analytics and revenue visualizers |

---

## 🏗️ Project Architecture

```
                               ┌────────────────────────────────┐
                               │     Browser / Client Layer     │
                               └───────────────┬────────────────┘
                                               │ HTTP / Server Actions
                                               ▼
                               ┌────────────────────────────────┐
                               │    Next.js 16 App Router       │
                               │  (SSR, Middleware, Actions)    │
                               └───────┬────────────────┬───────┘
                                       │                │
                      RBAC / Auth Check│                │ Query Execution
                                       ▼                ▼
                       ┌───────────────────┐  ┌───────────────────┐
                       │ JOSE JWT Guard    │  │ Prisma ORM        │
                       └───────────────────┘  └─────────┬─────────┘
                                                        │
                                                        ▼
                                              ┌───────────────────┐
                                              │ Neon PostgreSQL   │
                                              └───────────────────┘
```

---

## 📁 Folder Structure

```
servorix/
├── prisma/
│   └── schema.prisma         # Database schema (User, Business, Service, Booking, Review, etc.)
├── public/                   # SVGs, brand assets, logos, and public icons
├── src/
│   ├── app/
│   │   ├── actions/          # Next.js Server Actions (auth, booking, business, profile)
│   │   ├── admin/            # Platform administration routes
│   │   ├── api/              # API endpoints & webhooks
│   │   ├── businesses/       # Explore businesses & business detail pages
│   │   ├── dashboard/        # Customer, Owner, and Admin dashboards
│   │   ├── error.tsx         # Global branded 500 error boundary
│   │   ├── globals.css       # Design tokens, glassmorphism, & responsive utility media queries
│   │   ├── layout.tsx        # Root layout, Navbar, OpenGraph metadata
│   │   ├── not-found.tsx     # Branded 404 page
│   │   └── page.tsx          # Main landing page & Footer
│   ├── components/
│   │   ├── ai/               # AIChatWindow, AIMessageBubble, AIChatInput, AIAvatar
│   │   ├── chat/             # MessageBubble, MessageInput, ConversationList, MessageBell
│   │   ├── AnimatedStagger.tsx
│   │   ├── ChangePasswordForm.tsx
│   │   ├── Footer.tsx        # Developer info & social links
│   │   ├── Navbar.tsx        # Header & session context
│   │   └── SmoothScroll.tsx  # Lenis smooth scrolling wrapper
│   └── lib/
│       ├── ai/               # ProviderManager, engine, tools, prompts, guard
│       ├── auth.ts           # JOSE JWT token signing and verification
│       └── prisma.ts         # Prisma Client singleton
├── .env.example              # Environment variable template
├── .gitignore                # Production repository git exclusions
├── package.json
├── README.md
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Wajih-Gakhar/servorix.git
   cd servorix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize the database with Prisma:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

| Environment Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-xyz.neon.tech/servorix` |
| `JWT_SECRET` | Secret key for signing session JWT tokens | `super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | `super-secret-refresh-key` |
| `NEXT_PUBLIC_APP_URL` | Canonical production URL | `https://servorix.com` |
| `GEMINI_API_KEY` | Primary Google AI Studio API key | `AIzaSy...` |
| `GEMINI_API_KEY_1..5` | Multi-key failover pool keys | `AIzaSy...` |

---

## 💻 Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ☁️ Deployment on Vercel

Servorix is natively optimized for Vercel deployment:

1. Import your repository into Vercel.
2. Configure Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`).
3. Set the build command to `npm run build`.
4. Deploy! Next.js App Router and Prisma serverless connections will configure automatically.

---

## 📸 Screenshots

*(Placeholders — Replace with actual application screenshots)*

- **Landing Page:** `![Servorix Landing Page](public/servorixLogo.svg)`
- **Customer Dashboard:** `![Customer Dashboard](public/servorixIcon.svg)`
- **Owner Dashboard:** `![Owner Dashboard](public/servorixIcon.svg)`
- **AI Suite:** `![AI Suite](public/servorixIconAnimated.svg)`

---

## 🔒 Security & Compliance

- **HTTP-Only Cookies:** Auth JWT tokens are stored in strict HTTP-only cookies to prevent XSS vulnerability attacks.
- **Server-Side Validation:** All Server Actions validate input payloads before executing Prisma database queries.
- **RBAC Guards:** Middleware verifies token signatures and redirects unauthorized role access attempts.
- **Secret Isolation:** Environment secrets are accessed exclusively on the server layer.

---

## ⚡ Performance & Optimization

- **Server-First Data Fetching:** Dashboard data and business listings are rendered on the server to minimize client bundle sizes.
- **Prisma Connection Pooling:** Singleton client instantiation prevents serverless lambda connection leaks.
- **Responsive Media Scoping:** Custom `@media (max-width: 768px)` CSS rules refine mobile layouts without affecting desktop presentations.

---

## 🔮 Future Enhancements

- [ ] Mobile Application (React Native / Expo)
- [ ] Push Notifications via WebPush API
- [ ] Multi-Language Support (i18n)
- [ ] Advanced Revenue Analytics & Custom Export Formats
- [ ] Automated SMS Appointment Reminders via Twilio

---

## 👨‍💻 Developer Info

**Muhammad Wajih Ul Hassan**  
*Founder & Full Stack Developer*

- **GitHub:** [Wajih-Gakhar](https://github.com/Wajih-Gakhar)
- **LinkedIn:** [wajih2206](https://linkedin.com/in/wajih2206)
- **Email:** [wajihgakhar2006@gmail.com](mailto:wajihgakhar2006@gmail.com)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [Neon Database](https://neon.tech/)
- [Google AI Studio](https://aistudio.google.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
