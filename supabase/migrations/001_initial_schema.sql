-- Hapylo — Initial Database Schema
-- Run this in Supabase SQL Editor → New Query

-- ─── Profiles (extends auth.users) ────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'customer' check (role in ('customer','admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Categories ────────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text
);

alter table categories enable row level security;

-- Public read
drop policy if exists "Categories are publicly readable" on categories;
create policy "Categories are publicly readable" on categories
  for select using (true);

-- Admin write only (via service-role in API routes)

-- ─── Products ──────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id),
  price numeric not null,
  compare_at_price numeric,
  stock int not null default 0,
  images text[],
  rating numeric default 0,
  review_count int default 0,
  badge text check (badge in ('bestseller','sale','eco','new')),
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Public read (active products only)
drop policy if exists "Active products are publicly readable" on products;
create policy "Active products are publicly readable" on products
  for select using (is_active = true);

-- ─── Addresses ─────────────────────────────────────────────────────────────
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  line1 text,
  line2 text,
  city text,
  state text,
  pincode text,
  is_default boolean default false
);

alter table addresses enable row level security;

drop policy if exists "Users see own addresses" on addresses;
create policy "Users see own addresses" on addresses
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own addresses" on addresses;
create policy "Users insert own addresses" on addresses
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own addresses" on addresses;
create policy "Users update own addresses" on addresses
  for update using (auth.uid() = user_id);

drop policy if exists "Users delete own addresses" on addresses;
create policy "Users delete own addresses" on addresses
  for delete using (auth.uid() = user_id);

-- ─── Orders ────────────────────────────────────────────────────────────────
create table if not exists orders (
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

alter table orders enable row level security;

drop policy if exists "Users see own orders" on orders;
create policy "Users see own orders" on orders
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own orders" on orders;
create policy "Users insert own orders" on orders
  for insert with check (auth.uid() = user_id);

-- ─── Order Items ───────────────────────────────────────────────────────────
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null,
  unit_price numeric not null  -- snapshot price at purchase — never join live price
);

alter table order_items enable row level security;

drop policy if exists "Users see own order items" on order_items;
create policy "Users see own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Users insert own order items" on order_items;
create policy "Users insert own order items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- ─── Helper: generate order number ────────────────────────────────────────
create or replace function generate_order_number()
returns text as $$
begin
  return 'HAP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 9999 + 1)::text, 4, '0');
end;
$$ language plpgsql;
