# Servorix AI Subsystem Architecture Documentation

## Overview

**Servorix AI** is a native, role-aware artificial intelligence ecosystem integrated into the Servorix SaaS platform. It leverages Google Gemini via the Vercel AI SDK (`ai` & `@ai-sdk/google`) wrapped in a modular abstraction layer to deliver role-specific capabilities for Public visitors, Customers, Business Owners, and Platform Administrators.

---

## 1. Directory & File Structure

```text
src/
  lib/
    ai/
      config.ts       # Central AI parameters (provider, temperature, tokens, branding)
      provider.ts     # Abstraction layer over @ai-sdk/google (Gemini model builder)
      guard.ts        # RBAC security guard & prompt injection validator
      registry.ts     # Central prompt registry exporting system instructions
      formatter.ts    # Normalizes responses and strips provider references
      logger.ts       # Telemetry logging (latency, success/fail rates, tools used)
      tools.ts        # Server-side tool execution (zod-typed database queries)
      context.ts      # Context builders generating lightweight summaries
      engine.ts       # Core AI request router & orchestrator
      prompts/
        public.ts     # AI Concierge instructions
        customer.ts   # AI Booking Assistant instructions
        owner/
          business.ts # AI Business Advisor instructions
          analytics.ts# AI Analytics Intelligence instructions
          marketing.ts# AI Marketing Studio instructions
        admin.ts      # AI Platform Intelligence instructions
  components/
    ai/
      AIAvatar.tsx           # Branding avatar component (🤖 Servorix AI)
      AIMessageBubble.tsx    # Message container for user & assistant responses
      SuggestedPrompts.tsx   # Empty state prompt cards
      AIChatInput.tsx        # Chat input form with loading & streaming state
      AIChatWindow.tsx       # Main chat container
      PublicConciergeWidget.tsx # Floating public widget
  app/
    actions/
      aiPublicActions.ts   # Public server action
      aiCustomerActions.ts # Customer server action
      aiOwnerActions.ts    # Owner server action (Advisor, Analytics, Marketing)
      aiAdminActions.ts    # Admin server action
    dashboard/
      customer/ai/page.tsx # Dedicated Customer AI route
      owner/ai/page.tsx    # Dedicated Owner AI route with persona tabs
      admin/ai/page.tsx    # Dedicated Admin AI route
```

---

## 2. Request Lifecycle Pipeline

```text
User Request
     │
     ▼
Server Action (aiPublicActions / aiCustomerActions / aiOwnerActions / aiAdminActions)
     │
     ▼
AI Guard (guard.ts) [Validates Auth & Role Permissions]
     │
     ▼
AI Engine Router (engine.ts)
     ├── 1. Prompt Registry (registry.ts) -> Fetches persona prompt
     ├── 2. Context Builder (context.ts) -> Generates structured DB summary
     ├── 3. Server Tools (tools.ts) -> Executes Zod-typed queries
     └── 4. Provider (provider.ts) -> Calls Google Gemini LLM
     │
     ▼
Response Formatter (formatter.ts) [Applies Servorix AI branding & normalizes format]
     │
     ▼
Telemetry Logger (logger.ts) [Logs execution time & tool usage]
     │
     ▼
AIConversation & AIMessage DB Persistence
     │
     ▼
Frontend (🤖 Servorix AI)
```

---

## 3. Role-Based AI Personas & Data Boundaries

| Role | Persona Name | Dedicated Route / Location | Allowed Data Boundaries |
| :--- | :--- | :--- | :--- |
| **Public** | AI Concierge | Floating Widget on Landing Page (`/`) | Public business details, service catalogs, categories, location. |
| **Customer** | AI Booking Assistant | `/dashboard/customer/ai` | Customer's profile, booking history, available slots, public services. |
| **Owner** | AI Business Advisor | `/dashboard/owner/ai` (Advisor Tab) | Owner's business bookings, services, and customer retention metrics. |
| **Owner** | AI Analytics Intelligence | `/dashboard/owner/ai` (Analytics Tab) | Owner's financial totals, peak booking hours, performance trends. |
| **Owner** | AI Marketing Studio | `/dashboard/owner/ai` (Marketing Tab) | Owner's business service info to generate social/WhatsApp/email campaigns. |
| **Admin** | AI Platform Intelligence | `/dashboard/admin/ai` | Platform-wide aggregates, user counts, financial fees, business approvals. |

---

## 4. Security & Safety Principles

1. **Branding Integrity**: All responses strictly identify as `🤖 Servorix AI`. Provider names (Gemini, Google AI) are dynamically sanitized out.
2. **Data Isolation**: Context builders construct aggregated summaries rather than dumping raw database tables.
3. **No Breaking Modifications**: All AI additions are 100% additive; existing routing, authentication, and booking logic remain untouched.
4. **Resilience**: API failures or network rate limits fail gracefully with sanitized user messages without crashing the application.
