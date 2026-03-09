# Talons Agent

Talons Agent is a full-stack Next.js web app for **AI-powered crypto market analysis**.

It is **not** a trading bot.

The app lets a user:

- search a coin by symbol or name
- view current market data and recent chart context
- run an AI analysis using the OpenAI Responses API
- receive structured output:
  - market bias
  - confidence score
  - support zone
  - resistance zone
  - invalidation level
  - momentum summary
  - suggested scenarios
  - risks
  - reasoning
- save coins to a local watchlist
- review previous analyses in local history

The MVP keeps persistence simple by using **browser localStorage** for watchlist and history.

---

## What this app does not do

Talons Agent does **not**:

- place trades
- connect wallets
- request private keys
- automate trading
- promise profits

It is an analysis assistant only.

---

## Tech stack

- **Next.js** with App Router
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui-style components**
- **Lucide React**
- **OpenAI JavaScript SDK**
- **OpenAI Responses API**
- **CoinGecko public API / demo key support**
- **Recharts** for price charts
- **Zod** for validation
- **Sonner** for toasts
- **next-themes** for dark/light mode

---

## Project structure

```txt
/app
  /(marketing)/page.tsx
  /dashboard/page.tsx
  /watchlist/page.tsx
  /history/page.tsx
  /settings/page.tsx
  /api/health/route.ts
  /api/coins/search/route.ts
  /api/market/[symbol]/route.ts
  /api/analyze/route.ts
  /api/config-status/route.ts

/components
  /charts
  /dashboard
  /layout
  /providers
  /shared
  /ui

/lib
  /ai
  /config
  /market
  /rate-limit
  /schemas
  /storage
  /utils

/config
  local.secrets.ts
  local.secrets.example.ts
```

---

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Add your local secrets

Open this file:

```txt
config/local.secrets.ts
```

Fill it in like this:

```ts
export const localSecrets = {
  OPENAI_API_KEY: 'sk-your-openai-key-here',
  OPENAI_MODEL: 'gpt-5-mini',
  COINGECKO_DEMO_API_KEY: '',
} as const;

export default localSecrets;
```

### 3) Start the app

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

---

## How config works

Talons Agent uses a small server-only config helper.

### In local development

It reads secrets from:

```txt
config/local.secrets.ts
```

### In production on Vercel

It reads secrets from environment variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `COINGECKO_DEMO_API_KEY` (optional)

### Priority order

- In production: Vercel environment variables are used
- In development: env vars are used first if present, otherwise local config is used

---

## Required secrets

### Required

- `OPENAI_API_KEY`

### Optional but recommended

- `COINGECKO_DEMO_API_KEY`

The market data layer works with CoinGecko public endpoints, but a demo key can improve reliability depending on your usage.

### Default model

This repo defaults to:

```txt
gpt-5-mini
```

You can change that in local config or Vercel env vars.

---

## How to run type checks and lint

```bash
npm run typecheck
npm run lint
```

---

## How to push to GitHub

After unzipping the project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/talons-agent.git
git push -u origin main
```

### Important

`config/local.secrets.ts` is listed in `.gitignore`, so it should not be committed.

---

## How to deploy to Vercel

### Option 1: from GitHub

1. Push the repo to GitHub
2. Import the repository into Vercel
3. Add environment variables in the Vercel project settings:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional, default is `gpt-5-mini`)
   - `COINGECKO_DEMO_API_KEY` (optional)
4. Deploy

### Option 2: from CLI

```bash
npm i -g vercel
vercel
```

Then add the same environment variables in Vercel.

---

## Architecture overview

### Frontend pages

- **Landing page**: overview and CTA
- **Dashboard**: search, chart, metrics, AI analysis
- **Watchlist**: local saved coins
- **History**: previous analyses stored locally
- **Settings**: config status + theme toggle

### Server routes

- `GET /api/health`
- `GET /api/config-status`
- `GET /api/coins/search?q=`
- `GET /api/market/[symbol]`
- `POST /api/analyze`

### AI flow

`POST /api/analyze` does the following:

1. validates the request body with Zod
2. fetches market data from the market service
3. builds a server-side prompt
4. calls OpenAI using the Responses API
5. extracts JSON from the model output
6. validates the final output with Zod
7. returns structured JSON

### Persistence

For the MVP, these are stored in browser localStorage:

- watchlist
- analysis history
- simple UI preferences

---

## Limitations of the MVP

- no user accounts
- no shared cloud persistence
- no portfolio tracking
- no push alerts
- no trade execution
- market data comes from a single provider layer by default
- localStorage means data is tied to the current browser/device
- the AI output is only as good as the input market context and prompt discipline

---

## Future improvements

- add authentication
- move watchlist/history to a database
- add multi-source market data providers
- add optional news context
- add server-side persistence
- add alerting / notifications
- add richer chart overlays
- add saved layouts and advanced UI preferences
- add stronger rate limiting with Redis or a hosted KV store

---

## Notes for beginners

If analysis is failing, check these first:

1. make sure your `OPENAI_API_KEY` is correct
2. make sure your local config file is filled in
3. restart the dev server after editing secrets
4. check `/api/config-status` in the browser
5. check the browser console and terminal logs for route errors

---

## Why this stack

Next.js App Router is the built-in full-stack routing model for modern Next.js apps, Route Handlers live inside the `app` directory, and Vercel supports server-side environment variables for production deployments. OpenAI’s official JavaScript SDK recommends the Responses API as the primary API for model interaction, and the current model catalog includes `gpt-5-mini` as a faster, lower-cost GPT-5 option. citeturn0search0turn0search2turn0search5turn7view0turn6search0

CoinGecko’s official docs expose `/search`, `/coins/markets`, and `/coins/{id}/market_chart` style endpoints for market lookup and historical chart data, which is why the market service is structured around those endpoints. citeturn8search0turn8search1turn8search3turn8search8
