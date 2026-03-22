# CouncilCode — Environment Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Redis instance (Upstash free tier recommended)
- Stripe account
- API keys for all 5 AI providers

---

## 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/councilcode-main.git
cd councilcode-main
npm install
cp .env.local.example .env.local
```

---

## 2. Database setup

### MongoDB (Atlas)
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user with read/write permissions
3. Get your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/councilcode`
4. Whitelist 0.0.0.0/0 for Vercel (or use Vercel's IP ranges)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/councilcode
```

### Redis (Upstash — recommended)
1. Create a free database at https://upstash.com
2. Copy the Redis URL from the dashboard

```
REDIS_URL=rediss://default:token@endpoint.upstash.io:6379
```

---

## 3. Authentication (NextAuth)

### Generate secret
```bash
openssl rand -base64 32
```

```
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Email provider (Resend — recommended)
1. Sign up at https://resend.com
2. Get your API key
3. Use SMTP format: `smtp://resend:your-api-key@smtp.resend.com:465`

```
EMAIL_SERVER=smtp://resend:your-api-key@smtp.resend.com:465
EMAIL_FROM=noreply@yourdomain.com
```

---

## 4. AI Model API Keys

### Anthropic (Claude Opus 4.6)
https://console.anthropic.com → API Keys

```
ANTHROPIC_API_KEY=sk-ant-...
```

### OpenAI (GPT-5.4)
https://platform.openai.com → API Keys

```
OPENAI_API_KEY=sk-proj-...
```

### Mistral (Codestral)
https://console.mistral.ai → API Keys

```
MISTRAL_API_KEY=your-mistral-key
```

### Google (Gemini 3.1 Pro)
https://aistudio.google.com → Get API Key

```
GOOGLE_AI_API_KEY=AIza...
```

### Perplexity (Sonar Pro)
https://www.perplexity.ai/settings/api → API Keys

```
PERPLEXITY_API_KEY=pplx-...
```

---

## 5. Stripe setup

### Create products in Stripe dashboard
1. Go to https://dashboard.stripe.com/products
2. Create two products:

**CouncilCode Pro**
- Price: $29/month recurring
- Copy the Price ID (starts with `price_`)

**CouncilCode Teams**
- Price: $99/month recurring
- Copy the Price ID

```
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAMS_PRICE_ID=price_...
```

### Set up webhook
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

---

## 6. App URL + Cron secret

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
CRON_SECRET=generate-a-random-secret-here
```

Generate cron secret:
```bash
openssl rand -hex 32
```

---

## 7. Local development
```bash
npm run dev
```

Visit http://localhost:3000

For Stripe webhook testing locally:
```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

---

## 8. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B — GitHub integration
1. Push repo to GitHub
2. Import project at https://vercel.com/new
3. Add all environment variables in Vercel dashboard
4. Deploy

### Environment variables in Vercel
Go to Project Settings → Environment Variables and add every variable from your .env.local

---

## 9. Post-deploy checklist

- [ ] Visit /api/health — confirm mongodb and redis show "ok"
- [ ] Test Google sign-in flow end to end
- [ ] Create a test project and run a council session
- [ ] Trigger a test Stripe webhook with `stripe trigger checkout.session.completed`
- [ ] Confirm usage increments in /dashboard/billing
- [ ] Verify cron job appears in Vercel dashboard (Settings → Crons)

---

## Architecture overview

```
User
→ Next.js App Router
→ NextAuth (session)
→ Orchestrator API
→ Task Classifier + Router
→ Hallucination Firewall (Perplexity)
→ Model Adapters (Claude, GPT, Codestral, Gemini, Perplexity)
→ Cross-model Review Pipeline
→ Arbitration (Claude)
→ ProjectState (Redis + MongoDB)
→ ReviewLog (MongoDB)
→ Stripe (billing)
→ UsageLog (MongoDB)
```
