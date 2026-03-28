# VerityFlow — Project Memory

## What this is
A multi-model AI vibe coding SaaS. Five AI models collaborate as a structured engineering team to build user projects. Models share a living ProjectState document, critique each other via a cross-model review layer, and resolve conflicts via a structured arbitration protocol.

## Core promises
- Zero hallucinations (Perplexity pre-checks all APIs/libs, GPT-5.4 post-checks all generated code)
- Persistent context across complex full-stack builds (ProjectState in Redis + MongoDB)
- Code quality that never drifts (cross-model review on every output)

## Model roles
- Claude Opus 4.6 → Architect (system design, data models, logic decisions, conflict arbitration)
- GPT-5.4 → Generalist (API integrations, broad implementation, post-generation review)
- Codestral latest → Implementer (raw code generation, speed tasks, FIM)
- Gemini 3.1 Pro Preview → Refactor (full-codebase context sweeps, consistency enforcement)
- Perplexity Sonar Pro → Researcher (live docs, package versions, API verification, hallucination firewall)

## Live model strings (verified March 2026)
- Claude Architect: claude-opus-4-6
- GPT Generalist/Reviewer: gpt-5.4 (OpenAI Responses API)
- Codestral Implementer: codestral-latest
- Gemini Refactor: gemini-3.1-pro-preview
- Perplexity Researcher: sonar-pro

## Stack
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS with CSS variable theming (dark-first)
- MongoDB via Mongoose (durable storage)
- Redis via ioredis with cc: prefix (fast ProjectState reads)
- NextAuth v5 with Google + email providers
- Stripe (checkout, portal, webhooks)
- Vercel deployment with cron jobs

## Folder conventions
- /src/app → Next.js App Router pages and API routes
- /src/components/ui → shared primitives
- /src/components/council → model feed, review log, session UI
- /src/components/dashboard → project management + billing UI
- /src/components/landing → marketing pages
- /src/lib/db → database clients (mongoose, redis, mongoClient)
- /src/lib/models → Mongoose schemas
- /src/lib/orchestrator → core engine (router, adapters, review pipeline)
- /src/lib/stripe.ts → Stripe client + plan definitions
- /src/lib/utils → stateless helpers (projectState, retry, errors, usageLogger)
- /src/types → all shared TypeScript interfaces

## Coding conventions
- All components: functional, typed props interface, no `any`
- API routes: always return typed responses with explicit status codes
- MongoDB models: always include createdAt and updatedAt timestamps
- Redis keys: always prefixed with cc: (e.g. cc:projectstate:{projectId})
- Never hardcode secrets — always use process.env
- All orchestrator functions: async with try/catch + structured error types
- Retry logic: use withRetry() from utils/retry for all model adapter calls
- Imports: use @/ alias for all internal imports

## ProjectState structure
The ProjectState is the shared memory across all model calls.
- Stored in Redis for fast reads (key: cc:projectstate:{projectId})
- Synced to MongoDB for durability
- Each model receives only a task-relevant slice via sliceStateForTask()
- Gemini receives the full document for refactor/consistency tasks

## Orchestration flow
1. User submits prompt → classifyTask() determines TaskType
2. Hallucination firewall fires if task touches external libs (Perplexity pre-check)
3. Primary model executes with verified dependency context
4. Cross-model reviewer checks output (approved / patched / escalated)
5. If conflict detected → Claude arbitrates with written rationale
6. ReviewLog persisted to MongoDB + ProjectState
7. Final reviewed/arbitrated output returned to user

## Plan tiers
- Free: 50 model calls/month
- Pro: 2000 model calls/month ($29/mo)
- Teams: 10000 model calls/month ($99/mo)

## API routes
- POST /api/orchestrator — main council session entry point
- GET/POST /api/project — project CRUD
- GET/POST /api/project/state — ProjectState read/write
- GET /api/project/reviews — review log fetch
- POST /api/billing/checkout — Stripe checkout session
- POST /api/billing/portal — Stripe billing portal
- POST /api/billing/webhook — Stripe webhook handler
- GET /api/billing/usage — usage stats
- POST /api/billing/reset-usage — monthly usage reset (cron)
- GET /api/health — health check (MongoDB + Redis)

## Build phases — ALL COMPLETE
✅ Phase 1 — Foundation (scaffold, schemas, auth)
✅ Phase 2 — Orchestration Engine (ProjectState, router, 5 live adapters)
✅ Phase 3 — Review & Safety Layer (review pipeline, firewall, arbitration)
✅ Phase 4 — UI (landing, auth, dashboard, session, review log)
✅ Phase 5 — Billing (Stripe, plan tiers, usage metering)
✅ Phase 6 — Hardening & Deploy (error handling, retry, Vercel config)

## Current status
✅ ALL CHUNKS COMPLETE — production build passing
🚀 Ready to deploy

## Next steps post-launch
- Add streaming responses to council session UI (SSE)
- Add project file tree viewer
- Add session history browser
- Add team collaboration (shared projects)
- Add webhook notifications (Slack, email on session complete)
- Consider VerityFlow API for developers to run council sessions programmatically
