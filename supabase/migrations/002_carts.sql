-- Migration 002: synced carts for signed-in customers (web + mobile app).
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists carts (
  email text primary key,
  items jsonb not null default '[]'::jsonb,   -- [{ "slug": "multivitamin", "qty": 2 }, ...]
  updated_at timestamptz not null default now()
);

alter table carts enable row level security;
