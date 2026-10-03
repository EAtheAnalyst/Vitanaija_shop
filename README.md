# VitaNaija Shop

A smooth, calm supplements store for Nigeria, built from `../shopping-website-template/agent.md`
and the Shopping Website PRD.

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Lenis** smooth scroll + CSS reveal system (fade-and-rise, staggered groups) + Motion for the drawer/menu
- **Supabase** (Postgres) for products, orders, customers, subscribers, messages and reviews
- **Auth.js + Google** sign-in
- **Mailgun** order confirmation emails
- **Pay on delivery** checkout with Nigerian states, naira pricing and delivery fees

Without any keys the site still runs: data goes to `.data/db.json`, emails print to the terminal,
and Google sign-in shows a "not set up yet" note. Add keys one at a time as you get them.

**Mobile app backend:** this site also serves the Android app (`../vitanaija-mobile`) through
`/api/v1/*`, and handles its Google sign-in at `/mobile/auth`. Web and app share one database,
one order pipeline (`lib/orders.ts`) and, for signed-in customers, one cart. That needs
`supabase/migrations/002_carts.sql` to be run once. See the mobile README for the full API table.
Optional env: `MOBILE_ALLOW_EXPO_GO=true` lets Expo Go sign in against the live site while testing.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `.env.local` already has a development `AUTH_SECRET`. Copy any missing
variables from `.env.example`.

## 1. Supabase (database)

1. Create a project at https://supabase.com (region: closest to Nigeria, e.g. `eu-west`).
2. **SQL Editor →** paste and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. **Project Settings → API:** copy the Project URL and the `service_role` key into `.env.local`:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
   The service role key is used only on the server. Never put it in a `NEXT_PUBLIC_` variable.
4. Restart `npm run dev`. Products now load from the `products` table and orders are saved there.

Managing the shop in the Supabase Table Editor:
- **orders:** change `status` (pending → confirmed → shipped → delivered). Customers see it on their order page.
- **products:** edit prices, copy, and `in_stock`.
- **reviews:** add real customer reviews and set `approved = true` to show them on the site.
  Production never shows the sample reviews used in development.

## 2. Google sign-in (Google Cloud Console)

1. https://console.cloud.google.com → create or select a project.
2. **APIs & Services → OAuth consent screen:** choose External, add the app name, support email and logo,
   and the scopes `email`, `profile` and `openid`.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.**
   - Authorised JavaScript origins: `http://localhost:3000` and your production URL
   - Authorised redirect URIs:
     `http://localhost:3000/api/auth/callback/google` and
     `https://YOUR-DOMAIN/api/auth/callback/google`
4. Copy the client ID and secret into `.env.local`:
   ```
   AUTH_GOOGLE_ID=xxxx.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=GOCSPX-...
   ```
5. In production, set a new `AUTH_SECRET` (`npx auth secret`) and `NEXT_PUBLIC_SITE_URL`.

Signed-in customers are saved to the `customers` table. Checkout pre-fills their name and email,
and `/account` lists their orders.

## 3. Mailgun (confirmation emails)

1. https://mailgun.com → **Sending → Domains → Add domain** (e.g. `mg.yourdomain.ng`). Add the DNS records it shows and wait until it's verified.
2. **API Security → Create API key.**
3. Add the values to `.env.local`:
   ```
   MAILGUN_API_KEY=key-...
   MAILGUN_DOMAIN=mg.yourdomain.ng
   MAILGUN_API_BASE=https://api.mailgun.net      # or https://api.eu.mailgun.net for EU domains
   MAILGUN_FROM="VitaNaija <orders@mg.yourdomain.ng>"
   ORDER_NOTIFY_EMAIL=you@yourdomain.ng          # optional: new-order alerts for your team
   ```
   On Mailgun's sandbox domain you can only send to "authorised recipients" that you add in the dashboard.

Every order gets a branded HTML and plain-text confirmation. `orders.email_sent_at` records when it was sent.
If an email fails, the order is still saved and the error is logged.

## Deploy (Vercel)

1. Push the `vitanaija-shop` folder to GitHub and import it in Vercel.
2. Add all the variables from `.env.local` under **Settings → Environment Variables**, with `NEXT_PUBLIC_SITE_URL` set to the live URL.
3. Add the live callback URL in Google Cloud Console.

The local file store doesn't work on serverless hosts, so **Supabase keys are required in production**.

## Before launch (placeholders to replace)

- [ ] Brand name, logo and colours: `content/brand.ts`, `app/globals.css`
- [ ] Copy marked `[CLAIM — needs evidence]` in `content/`: health claims and NAFDAC numbers
- [ ] Lifestyle photos: replace `PhotoSlot` with real `next/image` photos (agent.md §12)
- [ ] Real reviews in Supabase (sample reviews show only in development)
- [ ] Terms, Returns and Privacy pages reviewed by a lawyer (NDPA 2023)
- [ ] Delivery fees and areas in `content/delivery.ts`

## Project map

```
app/                 pages, server actions (checkout/actions.ts, actions.ts), auth route
components/sections  homepage sections in the reference order
components/motion    SmoothScroll (Lenis) + Reveal / RevealGroup
components/commerce  cart provider, drawer, product card, add-to-cart
components/art       SVG bottle, hero scene, textures, photo placeholders
content/             all copy, products, delivery rules: the only files to change per brand
lib/db               Supabase store + local fallback store
lib/email.ts         Mailgun sender + order confirmation template
supabase/            schema.sql, seed.sql
```
