# Servorix — Enterprise Business Management & AI-Powered Booking SaaS

<p align="center">
  <img src="./public/servorixLogoAnimated.svg" alt="Servorix Animated Logo" width="280" />
</p>

> **Next-Generation Appointment Scheduling, Business Intelligence, and Autonomous AI Operations for Salons & Gyms.**

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-4169E1?style=flat-square&logo=postgresql)
![Google AI](https://img.shields.io/badge/Google_AI_Studio-Gemini_Flash-8E44AD?style=flat-square&logo=google)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [About Servorix](#-about-servorix)
- [Live Demo](#-live-demo)
- [Source Code](#-source-code)
- [Project Demonstration](#-project-demonstration)
- [Screenshots](#-screenshots)
- [Demo Accounts](#-demo-accounts)
- [Preloaded Sample Data](#-preloaded-sample-data)
- [Suggested AI Prompts](#-suggested-ai-prompts)
- [Feature Status Overview](#-feature-status-overview)
- [Key Features](#-key-features)
  - [Public Portal](#-public-portal)
  - [Customer Dashboard](#-customer-dashboard)
  - [Business Owner Dashboard](#-business-owner-dashboard)
  - [Admin Dashboard](#-admin-dashboard)
  - [AI Suite](#-ai-suite)
  - [Authentication & Access Control](#-authentication--access-control)
  - [Booking Engine & Payments](#-booking-engine--payments)
  - [Analytics & Reports](#-analytics--reports)
- [AI Architecture & Personas](#-ai-architecture--personas)
  - [AI System Prompt Philosophy](#-ai-system-prompt-philosophy)
  - [Multi-Key Provider Manager & Failover](#-multi-key-provider-manager--failover)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Security & Compliance](#-security--compliance)
- [Performance & Optimization](#-performance--optimization)
- [Future Enhancements](#-future-enhancements)
- [Developer Info](#-developer-info)
- [Reviewer Notes](#-reviewer-notes)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🚀 About Servorix

**Servorix** is an enterprise-grade, multi-tenant SaaS application designed to revolutionize appointment management for service-based businesses such as barbershops, hair salons, spas, fitness studios, and gyms.

### The Problem It Solves
Traditional scheduling software relies on manual record-keeping, static forms, and rigid interfaces that fail to engage customers or provide actionable business insights. Salon and gym owners frequently lose revenue to schedule conflicts, unoptimized pricing, manual customer support, and unengaged leads.

### The Servorix Solution
Servorix integrates automated real-time booking, role-based dashboards, and a sophisticated multi-persona **AI Suite**. Powered by Google AI Studio's Gemini Flash models and Vercel AI SDK, Servorix features an autonomous Multi-Key Provider Manager that delivers 100% uptime with automatic HTTP 429 failover, real-time database queries, intent routing, and intelligent marketing automation.

---

## 🌐 Live Demo

**Production Deployment:** [https://servorix.vercel.app](https://servorix.vercel.app)

---

## 📂 Source Code

**Public Repository:** [https://github.com/Wajih-Gakhar/servorix](https://github.com/Wajih-Gakhar/servorix)

---

## 🎥 Project Demonstration

A complete video walkthrough of the Servorix platform is available demonstrating real-time booking flows, multi-tenant dashboards, intent-driven AI interactions, and administration tooling.

**Demo Video Walkthrough:**  

> https://github.com/user-attachments/assets/577efcd5-57c4-4269-81e1-f66cbc3771ee

The demonstration highlights:
- **Landing Page & Public AI Concierge**
- **Customer Portal:** Appointments, rescheduling, profile management, and Customer AI Assistant
- **Business Owner Operations Matrix:** Enterprise switcher, service CRUD, working hours, revenue analytics, and Owner AI Suite
- **Platform Administration Panel:** Global statistics, business verification auditing, category taxonomy management, and Admin AI Intelligence
- **Multi-Key Failover:** Resilient AI response generation across Google AI Studio provider keys

---

## 📸 Screenshots

<details>
  <summary><b>🏠 Landing Page </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/landing-page/LandingPage1.PNG" alt="Landing Page 1" /></td>
      <td width="50%"><img src="assets/landing-page/LandingPage2.PNG" alt="Landing Page 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/landing-page/LandingPage3.PNG" alt="Landing Page 3" /></td>
      <td width="50%"><img src="assets/landing-page/LandingPage4.PNG" alt="Landing Page 4" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/landing-page/LandingPage5.PNG" alt="Landing Page 5" /></td>
      <td width="50%"><img src="assets/landing-page/LandingPage6.PNG" alt="Landing Page 6" /></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>🔍 Explore Page </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/explore-page/ExplorePage1.PNG" alt="Explore Page 1" /></td>
      <td width="50%"><img src="assets/explore-page/ExplorePage2.PNG" alt="Explore Page 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/explore-page/ExplorePage3.PNG" alt="Explore Page 3" /></td>
      <td width="50%"></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>👤 Customer Dashboard </b></summary>
  <br />
  <table>
    <tr>
      <td width="100%"><img src="assets/customer-dashboard/CustomerPage1.PNG" alt="Customer Dashboard" /></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>💼 Owner Dashboard </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/owner-dashboard/OwnerPage1.PNG" alt="Owner Page 1" /></td>
      <td width="50%"><img src="assets/owner-dashboard/OwnerPage2.PNG" alt="Owner Page 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/owner-dashboard/OwnerPage3.PNG" alt="Owner Page 3" /></td>
      <td width="50%"><img src="assets/owner-dashboard/OwnerPage4.PNG" alt="Owner Page 4" /></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>⚙️ Admin Dashboard </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/admin-dashboard/AdminPage1.PNG" alt="Admin Page 1" /></td>
      <td width="50%"><img src="assets/admin-dashboard/AdminPage2.PNG" alt="Admin Page 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/admin-dashboard/AdminPage3.PNG" alt="Admin Page 3" /></td>
      <td width="50%"></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>🤖 AI Assistants </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/ai-assistants/Assistant1.PNG" alt="Assistant 1" /></td>
      <td width="50%"><img src="assets/ai-assistants/Assistant2.PNG" alt="Assistant 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/ai-assistants/Assistant3.PNG" alt="Assistant 3" /></td>
      <td width="50%"><img src="assets/ai-assistants/Assistant4.PNG" alt="Assistant 4" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/ai-assistants/Assistant5.PNG" alt="Assistant 5" /></td>
      <td width="50%"><img src="assets/ai-assistants/Assistant6.PNG" alt="Assistant 6" /></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>⚡ AI Assistants Demo </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking1.PNG" alt="AI Working 1" /></td>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking2.PNG" alt="AI Working 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking3.PNG" alt="AI Working 3" /></td>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking4.PNG" alt="AI Working 4" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking5.PNG" alt="AI Working 5" /></td>
      <td width="50%"><img src="assets/ai-assistant-demo/AIWorking6.PNG" alt="AI Working 6" /></td>
    </tr>
  </table>
</details>

<details>
  <summary><b>📅 Booking Flow </b></summary>
  <br />
  <table>
    <tr>
      <td width="50%"><img src="assets/booking-flow/BookingFlow1.PNG" alt="Booking Flow 1" /></td>
      <td width="50%"><img src="assets/booking-flow/BookingFlow2.PNG" alt="Booking Flow 2" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/booking-flow/BookingFlow3.PNG" alt="Booking Flow 3" /></td>
      <td width="50%"><img src="assets/booking-flow/BookingFlow4.PNG" alt="Booking Flow 4" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/booking-flow/BookingFlow5.PNG" alt="Booking Flow 5" /></td>
      <td width="50%"><img src="assets/booking-flow/BookingFlow6.PNG" alt="Booking Flow 6" /></td>
    </tr>
    <tr>
      <td width="50%"><img src="assets/booking-flow/BookingFlow7.PNG" alt="Booking Flow 7" /></td>
      <td width="50%"><img src="assets/booking-flow/BookingFlow8.PNG" alt="Booking Flow 8" /></td>
    </tr>
  </table>
</details>

---

## 🔑 Demo Accounts

These evaluation accounts are provided exclusively for academic review so evaluators can instantly test every user role (`ADMIN`, `OWNER`, `CUSTOMER`) without creating new accounts.

| Role | Email | Password | Dashboard Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `anawah6admins@outlook.com` | `AnawahAdmins123` | Global ecosystem metrics, business verification audits, category taxonomy, and Platform Intelligence AI |
| **Business Owner** | `jahan627@gmail.com` | `Jahan123` | Multi-business switcher, service management, schedule hours, analytics, and Owner AI Suite |
| **Customer** | `zaryab7896@gmail.com` | `Zaryab123` | Active booking history, profile settings, user-to-owner chat, and Customer AI Assistant |

---

## 📊 Preloaded Sample Data

To facilitate comprehensive evaluation, the live deployment environment is pre-populated with realistic demonstration data:
- **Registered Enterprise Businesses:** Pre-configured salons and fitness centers with operating hours and staff services.
- **Service Catalog:** Structured services with defined durations, categories, and pricing tiers.
- **Appointment History:** Historical and upcoming bookings spanning `PENDING`, `APPROVED`, `COMPLETED`, and `CANCELLED` statuses.
- **User & Customer Profiles:** Pre-configured customer credentials and executive owner profiles.
- **Revenue Analytics:** Historical transaction records supporting Recharts analytics graphs and financial calculations.
- **AI-Ready Context:** Populated database records enabling real-time tool execution during AI queries.

---

## 🤖 Suggested AI Prompts

Reviewers can execute the following role-specific prompts to evaluate the AI Suite's intent-routing and database tool invocation:

### 👤 Customer Persona
- *"Show my previous bookings."*
- *"Recommend a salon under Rs. 2,000."*
- *"How do I cancel or reschedule a booking?"*

### 🏢 Business Owner Persona
- *"Summarize my booking analytics."*
- *"How can I improve bookings?"*
- *"Write an Instagram promotion for my business."*

### 🛡️ Platform Admin Persona
- *"Provide gross revenue and platform fee analytics."*
- *"How many businesses are registered?"*
- *"Summarize platform performance."*

---

## 📊 Feature Status Overview

| Feature Module | Implementation Status |
| :--- | :---: |
| **Authentication & Session Tokens** | ✅ Completed |
| **Role-Based Access Control (RBAC)** | ✅ Completed |
| **Business Discovery & Multi-Filtering** | ✅ Completed |
| **Real-Time Appointment Booking Engine** | ✅ Completed |
| **Multi-Persona AI Suite (6 Personas)** | ✅ Completed |
| **Customer Portal & Bookings History** | ✅ Completed |
| **Business Owner Operations Matrix** | ✅ Completed |
| **Platform Administrator Dashboard** | ✅ Completed |
| **Business Analytics & Revenue Visualizers** | ✅ Completed |
| **AI Marketing Campaign Generator** | ✅ Completed |
| **Glassmorphic Responsive UI (Mobile & Desktop Lock)** | ✅ Completed |
| **Production Deployment (Vercel + Neon PostgreSQL)** | ✅ Completed |

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

## 🧠 AI Architecture & Personas

Servorix equips users with **6 Specialized AI Personas**, built on top of Google AI Studio's Gemini Flash model and Vercel AI SDK:

1. **Public Concierge:** Assists site visitors with platform navigation, service discovery, and general questions.
2. **Customer Assistant:** Helps logged-in customers view active bookings, retrieve appointment histories, and discover open slots.
3. **Business Advisor:** Provides owners with data-backed revenue strategies, service optimizations, and pricing models.
4. **Analytics Intelligence:** Analyzes booking trends, peak hours, and customer retention metrics.
5. **Marketing Studio:** Generates tailored promotional copy, social posts, and discount campaigns.
6. **Platform Intelligence:** Empowers platform admins with global ecosystem metrics, business verification counts, and user growth insights.

### AI System Prompt Philosophy

The Servorix AI Suite is built on a disciplined system prompt philosophy:
- **Strict Role Containment:** Instructs the AI to operate strictly within its designated persona and user permissions (`CUSTOMER`, `OWNER`, `ADMIN`, or `PUBLIC`).
- **Direct FAQ & Informational Responses:** Answers general product questions and how-to guides directly without executing unnecessary database tool calls.
- **Intent-Based Tool Invocation:** Triggers backend Prisma tools only when personal user data or live database metrics are required.
- **Data Privacy & Security:** Protects sensitive system credentials, user tokens, and password hashes from exposure.
- **Natural Language Synthesis:** Formats tool outputs into clear, professional GFM Markdown summaries with zero technical noise.
- **Resource Efficiency:** Eliminates repetitive tool loops and unnecessary API key consumption.

### Multi-Key Provider Manager & Failover

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
| **Deployment** | Vercel | Cloud hosting and continuous integration deployment |
| **Styling** | Vanilla CSS & Tailwind CSS | Dark glassmorphism design system and dynamic utilities |
| **Icons** | Lucide React | Clean, accessible SVG vector icon suite |
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
| `NEXT_PUBLIC_APP_URL` | Canonical production URL | `https://servorix.vercel.app` |
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

## 🚀 Deployment

Servorix is natively deployed on **Vercel** with a serverless **Neon PostgreSQL** database:

- **Hosting Platform:** Vercel
- **Production URL:** [https://servorix.vercel.app](https://servorix.vercel.app)
- **Database:** Neon Serverless PostgreSQL

### Deployment Steps:
1. Import your GitHub repository into Vercel.
2. Configure Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`).
3. Set build script to `prisma generate && next build` (automated via `package.json`).
4. Deploy!

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

## ✅ Reviewer Notes

- **Production Deployment:** The application is fully deployed and accessible live on [Vercel](https://servorix.vercel.app) backed by a serverless [Neon PostgreSQL](https://neon.tech) database.
- **Open-Source Codebase:** Complete source code is available in the public [GitHub Repository](https://github.com/Wajih-Gakhar/servorix).
- **Autonomous AI Operations:** AI tools execute live database queries with automatic multi-key failover handling.
- **Security & Access Control:** Role-Based Access Control (`CUSTOMER`, `OWNER`, `ADMIN`) is strictly enforced via server-side JOSE JWT tokens.
- **Zero Initial Setup:** Pre-seeded demonstration accounts and sample data allow immediate evaluation without registration steps.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

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
- [Lucide React](https://lucide.dev/)
