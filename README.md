# kart-frontend

Next.js storefront for the Kart API: landing page, menu, cart, and checkout via a server-side proxy to the backend.

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local`:

   | Variable                   | Description |
   |----------------------------|-------------|
   | `API_BASE_URL`             | Backend URL for **`POST /api/order`** proxy (server-only). |
   | `API_KEY`                  | `api_key` for orders — **server-only** (`app/api/order/route.ts`). |
   | `NEXT_PUBLIC_API_BASE_URL` | Same base URL for **browser** catalog requests (`GET /product`). The backend must allow your site via **`CORS_ORIGINS`** (see kart-backend README). |

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Import the repo and set env vars in **Project → Settings → Environment Variables**:
   - `API_BASE_URL` — production backend URL (order proxy)
   - `NEXT_PUBLIC_API_BASE_URL` — same URL for catalog (exposed to the browser by design)
   - `API_KEY` — secret; encrypted in Vercel

2. On the **backend** (e.g. Render), set `CORS_ORIGINS` to your Vercel origin(s) and `http://localhost:3000` for local dev.

3. Redeploy after changing variables.

Catalog **`GET /product`** runs in the **browser** (visible in DevTools Network). Checkout uses **`POST /api/order`** on Next.js, which forwards to the backend with `API_KEY`.

## Scripts

- `npm run dev` — development
- `npm run build` — production build (`API_BASE_URL` / `API_KEY` for order route)
- `npm run start` — run production build locally
- `npm run lint` — ESLint

## Stack

Next.js (App Router), React, Tailwind CSS v4, TypeScript.
