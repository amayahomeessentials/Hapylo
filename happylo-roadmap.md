# Happylo — Complete Build Roadmap & Project Structure
Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase + Razorpay + Vercel**

---

## 0. Guiding Principles

- Build in **vertical slices** (a full working flow), not horizontal layers. Ship "browse → PDP → cart → checkout" end-to-end before polishing admin.
- Never trust the client. All price calculations, stock checks, and payment verification happen **server-side**.
- One design-token source of truth (`tailwind.config.ts` + a `tokens.ts`) — every component pulls from it, nothing hardcoded.
- Treat Supabase as "just Postgres + Auth" — wrap all queries in a data-access layer so you're never locked in.

---

## 1. Roadmap (Phases)

### Phase 0 — Setup (Day 1)
- Init Next.js (TypeScript, App Router, Tailwind) repo
- Connect GitHub → Vercel (auto-deploy on push to `main`, preview deploys on PRs)
- Create Supabase project (choose region closest to your users, e.g. Mumbai/Singapore)
- Set up `.env.local` + matching Vercel environment variables (never commit secrets)
- Install: `@supabase/supabase-js`, `@supabase/ssr`, `razorpay`, `zod`, `react-hook-form`, `lucide-react`

### Phase 1 — Design System (Days 2–4)
- Build `tokens.ts` (colors, spacing, radius, shadows) from `/design/palette.md`
- Build core components: Button, Input, Select, Badge, Card, Modal, Drawer, BottomSheet, Toast, Skeleton, RatingStars
- Build the **ProductCard** component (single source used everywhere)
- Storybook-style test page (`/dev/components`) to visually QA before wiring real data — delete or gate before production

### Phase 2 — Database & Auth (Days 5–7)
- Write full Postgres schema (see §3 below) in Supabase SQL editor
- Enable **Row Level Security on every table** — this is non-negotiable
- Set up Supabase Auth (email/password to start; add OAuth later if needed)
- Build `middleware.ts` for session refresh + protected route guarding
- Seed database with realistic dummy products/categories

### Phase 3 — Storefront Core (Days 8–14)
- Header (desktop + mobile variants), Footer
- Home page: Hero, Categories, Best Sellers, Featured, Combo Kits, Why Happylo, Reviews, Final CTA
- Product Listing Page: filters (sidebar desktop / bottom sheet mobile), sort, pagination or infinite scroll
- Product Detail Page: gallery, info, quantity, add to cart, related products
- Search (debounced, server-side query against `products`)

### Phase 4 — Cart & Checkout (Days 15–19)
- Cart: local/session-persisted for guests, synced to DB for logged-in users
- Checkout: address form → order summary → Razorpay payment
- **Razorpay flow (critical)**:
  1. Client requests order creation → **server** creates Razorpay order (amount computed server-side from DB prices, never trust client total)
  2. Client opens Razorpay checkout widget with that order id
  3. Razorpay redirects/callbacks → **server webhook** verifies signature → only then mark order `paid` in DB
  4. Order confirmation page reads order status from DB, not from client-side payment response
- Order confirmation, empty states, payment-failed state

### Phase 5 — Account Area (Days 20–22)
- Login / Signup / Forgot password (Supabase Auth)
- Account page: profile, addresses, settings, logout
- Order history + order detail with status timeline

### Phase 6 — Admin Panel (Days 23–28)
- Route-group `(admin)` with role-gated middleware (`role = 'admin'` check server-side, not just hidden UI)
- Dashboard: sales/orders charts (Recharts), low-stock alerts
- Products: table + add/edit form + image upload to Supabase Storage
- Orders: table + status management + order detail

### Phase 7 — Hardening (Days 29–31)
- Full RLS policy audit (try accessing another user's data via API directly)
- Rate-limit auth and checkout endpoints (Vercel Edge Config or Upstash Redis)
- Add error boundaries, 404/500 pages, logging (Vercel Logs or Sentry free tier)
- Lighthouse pass: images optimized (`next/image`), fonts subset, no layout shift
- Accessibility pass: contrast, focus states, alt text, keyboard nav

### Phase 8 — Launch
- Point custom domain at Vercel
- Move Razorpay from test mode → live mode (requires KYC/business docs)
- Set up Supabase daily backups (paid tier recommended once real orders exist)
- Monitor free-tier limits (Supabase pause-on-inactivity, Vercel bandwidth/function minutes)

---

## 2. Complete Folder Structure

```
happylo/
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   │   ├── page.tsx                     # Home
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx                 # Product Listing
│   │   │   │   └── [category]/page.tsx
│   │   │   ├── product/[slug]/page.tsx      # PDP
│   │   │   ├── search/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── confirmation/[orderId]/page.tsx
│   │   │   ├── account/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   └── orders/[orderId]/page.tsx
│   │   │   └── layout.tsx                   # storefront header/footer
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx                 # Dashboard
│   │   │   │   ├── products/page.tsx
│   │   │   │   ├── products/new/page.tsx
│   │   │   │   ├── products/[id]/edit/page.tsx
│   │   │   │   ├── orders/page.tsx
│   │   │   │   └── orders/[id]/page.tsx
│   │   │   └── layout.tsx                   # admin shell + role guard
│   │   │
│   │   ├── api/
│   │   │   ├── checkout/create-order/route.ts   # server-side Razorpay order creation
│   │   │   ├── webhooks/razorpay/route.ts       # payment verification
│   │   │   └── search/route.ts
│   │   │
│   │   ├── layout.tsx                       # root layout (fonts, providers)
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                              # Button, Input, Card, Modal, Toast...
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   └── ProductGrid.tsx
│   │   ├── layout/
│   │   │   ├── HeaderDesktop.tsx
│   │   │   ├── HeaderMobile.tsx
│   │   │   └── Footer.tsx
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                    # browser client
│   │   │   ├── server.ts                    # server client (cookies)
│   │   │   └── admin.ts                     # service-role client, SERVER-ONLY, never imported client-side
│   │   ├── razorpay.ts
│   │   ├── validators/                      # zod schemas per form
│   │   └── utils.ts
│   │
│   ├── data/                                # data-access layer (the "swap DB later" insurance)
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── cart.ts
│   │   └── users.ts
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useAuth.ts
│   │
│   ├── types/
│   │   └── database.types.ts                # generated via `supabase gen types typescript`
│   │
│   ├── styles/
│   │   └── tokens.ts
│   │
│   └── middleware.ts                        # session refresh + admin route guard
│
├── public/
│   └── images/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 3. Core Database Schema (Supabase / Postgres)

```sql
-- profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id),
  price numeric not null,
  compare_at_price numeric,
  stock int not null default 0,
  images text[],
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  line1 text, line2 text, city text, state text, pincode text,
  is_default boolean default false
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references profiles(id),
  status text default 'created' check (status in ('created','confirmed','processing','shipped','delivered','cancelled')),
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed')),
  razorpay_order_id text,
  razorpay_payment_id text,
  subtotal numeric not null,
  shipping numeric default 0,
  discount numeric default 0,
  total numeric not null,
  address_id uuid references addresses(id),
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null,
  unit_price numeric not null   -- snapshot price at purchase time, do not join live price
);

-- RLS (example pattern — repeat per table)
alter table orders enable row level security;
create policy "Users see own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users insert own orders" on orders
  for insert with check (auth.uid() = user_id);
-- Admin bypass via service-role key used only in server routes, never RLS-bypassed from client
```

Apply the same enable-RLS + owner-scoped-policy pattern to `addresses`, `order_items` (via order ownership), and `profiles`. `products` and `categories` can be public-read, admin-write only.

---

## 4. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never NEXT_PUBLIC_
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=              # server-only
RAZORPAY_WEBHOOK_SECRET=          # server-only
NEXT_PUBLIC_SITE_URL=
```

---

## 5. Pre-Launch Security Checklist

- [ ] RLS enabled on every table (double-check — this is the #1 Supabase leak cause)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only referenced in server files, never bundled to client
- [ ] Razorpay webhook signature verified before marking any order `paid`
- [ ] Order total recomputed server-side from DB prices, never accepted from client
- [ ] Admin routes check `role` server-side in middleware, not just hidden nav items
- [ ] Rate limiting on `/api/checkout` and auth endpoints
- [ ] Zod validation on every form submission, both client and server
- [ ] `next/image` used for all product photos, no raw `<img>`
- [ ] Free-tier limits noted in a calendar reminder (Supabase pause-on-inactivity, Vercel bandwidth)

---

## 6. Suggested Order of Work (condensed)

1. Design tokens + core UI components
2. Schema + RLS + seed data
3. Home + PLP + PDP (read-only, no cart yet)
4. Cart (client-side first, then persist to DB)
5. Checkout + Razorpay + webhook verification
6. Auth + Account + Order history
7. Admin panel
8. Hardening + Lighthouse + accessibility pass
9. Deploy, domain, go live
