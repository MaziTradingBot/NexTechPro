# NexTechPro 🛒⚡

A modern, fast, responsive **e‑commerce store for tech devices** (phones, laptops, gaming, audio, tablets, wearables, accessories, monitors) built with Next.js. Frontend **and** backend live in one app that deploys to **Vercel** with a single click.

Inspired by the shopping experience of Rozetka, built fresh with a clean, premium UI.

---

## ✨ What's included

- **Bilingual 🇺🇦 / 🇬🇧** — instant Ukrainian ⇄ English switching. Every label, button and message translates. Your choice is remembered (cookie).
- **Animated landing page** — hero slider, floating device graphics, category grid, trending tabs, promo banner, newsletter.
- **Catalog** — filter by category & brand, sort by price / rating / newest, live search.
- **Product pages** — gallery, colour options, full spec table (translated), add‑to‑cart, buy‑now, related products.
- **Compare** — side‑by‑side spec comparison of up to 4 products.
- **Per‑user cart** — every account (and guests) has its **own** cart. Two different users never see each other's items.
- **Accounts** — sign in / register with a 👁 **show / hide password** toggle, plus a **“Continue with Google”** button. Includes order history.
- **Guest checkout** — order **without an account**. Just fill in delivery details.
- **Delivery** — **Nova Poshta** & **Meest**, all Ukrainian regions, 1–5 day estimate.
- **Payment options** — **Card 15% prepayment** (rest on delivery), **cash on delivery**, or **card in full**. The 15% split is calculated automatically.
- **Order confirmation** with an order number.

> ℹ️ **Demo mode:** Accounts, carts and orders are stored **in your browser** (localStorage) so everything works instantly with zero setup. Payment and Google login are simulated. See **“Going live”** below to connect the real services.

---

## 🚀 Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Build for production (this is what Vercel runs):

```bash
npm run build
npm start
```

---

## 🗂️ Project structure

```
src/
├─ app/                      # Pages (each folder = a route/URL)
│  ├─ page.tsx               # Home
│  ├─ catalog/               # Product listing + filters
│  ├─ product/[slug]/        # Product detail
│  ├─ cart/                  # Cart
│  ├─ checkout/              # Guest checkout + success page
│  ├─ login/ register/       # Auth (password show/hide + Google)
│  ├─ compare/ account/ support/
│  └─ layout.tsx             # App shell (reads language cookie)
├─ components/               # Header, Footer, product cards, home sections…
└─ lib/
   ├─ data/products.ts       # 👉 Your product catalog (edit this!)
   ├─ i18n/dictionaries.ts   # 👉 All EN / UA text (edit this!)
   └─ store/                 # Cart, auth, compare, orders (Zustand)
```

### Common edits for a beginner
- **Add / change products** → `src/lib/data/products.ts`
- **Change any text or translations** → `src/lib/i18n/dictionaries.ts`
- **Change brand colours** → `src/app/globals.css` (the `--color-brand-*` values)
- **Real product photos** → drop images in `public/` and render an `<img>` in
  `src/components/product/ProductImage.tsx` (currently uses generated artwork).

---

## ☁️ Deploy to Vercel (free)

1. Push this folder to a **GitHub** repo.
2. Go to **vercel.com → Add New → Project**, import the repo.
3. Framework preset is auto‑detected (**Next.js**). Click **Deploy**.
4. Done — you get a live URL. Every `git push` redeploys automatically.

No configuration is needed for the demo. When you add the real services below, put their keys in **Vercel → Project → Settings → Environment Variables**.

---

## 🔌 Going live (connect real services)

These need accounts **you** create. The UI is already built — you just wire in the real backend.

### 1. Google login & real accounts — [Auth.js (NextAuth)](https://authjs.dev)
- Create an OAuth client at [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- Add env vars: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`.
- Replace the demo auth store (`src/lib/store/auth.ts`) with Auth.js sessions.

### 2. Payments (Ukraine) — for real Visa/Mastercard + the 15% prepayment
- Options: **LiqPay**, **WayForPay**, or **Fondy** (Ukraine), or **Stripe** (international).
- Create a merchant account, add the API keys as env vars.
- Trigger the charge in `src/app/checkout/page.tsx` where the order is placed
  (currently a simulated 0.7s delay).
- ⚠️ Never hard‑code card numbers or secrets — always use environment variables.

### 3. Delivery rates & branches — Nova Poshta / Meest
- Get a free API key from the [Nova Poshta developer portal](https://developers.novaposhta.ua/).
- Use it to auto‑complete cities and list real branch numbers on the checkout page.

### 4. A real database (persist carts & orders across devices)
- **Vercel Postgres** (Neon) or **Vercel KV** — both are in the Vercel dashboard.
- Move the Zustand stores in `src/lib/store/` to server routes backed by the DB.

---

## 🧰 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Motion · lucide‑react.

Built to run entirely on **Vercel** — frontend and backend in one project.
