-- VitaNaija database schema. Run in Supabase → SQL Editor, then run seed.sql.
-- The app talks to Supabase only from the server with the service role key,
-- so RLS is enabled with no public policies (the anon key can read nothing).

create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  image text,
  google_id text,
  phone text,
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

create table if not exists products (
  slug text primary key,
  name text not null,
  subtitle text not null default '',
  price integer not null check (price >= 0),          -- naira, whole units
  size text not null,
  count integer not null,
  tint text not null,
  goal text not null,
  short text not null,
  long text not null,
  features text[] not null default '{}',
  usage text not null default '',
  warnings text not null default '',
  in_stock boolean not null default true,
  best_seller boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  email text not null,
  name text not null,
  phone text not null,
  address_line1 text not null,
  city text not null,
  state text not null,
  notes text not null default '',
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  payment_method text not null default 'pay_on_delivery',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists orders_email_idx on orders (email, created_at desc);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null references products(slug),
  name text not null,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 20)
);
create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists subscribers (
  email text primary key,
  source text not null default 'home',
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text references products(slug) on delete set null,
  name text not null,
  city text not null default '',
  rating integer not null check (rating between 1 and 5),
  text text not null,
  approved boolean not null default false,          -- only approved reviews appear on the site
  created_at timestamptz not null default now()
);

alter table customers enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscribers enable row level security;
alter table contact_messages enable row level security;
alter table reviews enable row level security;

-- Creates an order and its items in one transaction. Returns the new order id.
create or replace function create_order(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into orders (number, customer_id, email, name, phone, address_line1, city, state, notes,
                      subtotal, delivery_fee, total)
  values (
    payload->>'number',
    nullif(payload->>'customer_id', '')::uuid,
    lower(payload->>'email'),
    payload->>'name',
    payload->>'phone',
    payload->>'address_line1',
    payload->>'city',
    payload->>'state',
    coalesce(payload->>'notes', ''),
    (payload->>'subtotal')::int,
    (payload->>'delivery_fee')::int,
    (payload->>'total')::int
  )
  returning id into new_id;

  insert into order_items (order_id, product_slug, name, unit_price, quantity)
  select new_id, i->>'product_slug', i->>'name', (i->>'unit_price')::int, (i->>'quantity')::int
  from jsonb_array_elements(payload->'items') as i;

  return new_id;
end;
$$;

revoke all on function create_order(jsonb) from public, anon, authenticated;
