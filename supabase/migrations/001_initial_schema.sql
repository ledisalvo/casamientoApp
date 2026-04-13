-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Guests ────────────────────────────────────────────────────
create table guests (
  id         uuid primary key default gen_random_uuid(),
  code       text not null,
  name       text not null,
  email      text,
  max_seats  int  not null default 1,
  created_at timestamptz not null default now(),

  constraint guests_code_unique unique (code)
);

create index guests_code_lower_idx on guests (lower(code));

-- ── RSVP Responses ────────────────────────────────────────────
create table rsvp_responses (
  id           uuid primary key default gen_random_uuid(),
  guest_id     uuid not null references guests (id) on delete cascade,
  attending    boolean not null,
  seat_count   int,
  dietary      text not null check (dietary in ('ninguna','vegetariano','vegano','sin-gluten','sin-lactosa','otro')),
  responded_at timestamptz not null default now(),

  constraint rsvp_responses_guest_unique unique (guest_id)
);

-- ── App Config ────────────────────────────────────────────────
create table app_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Seed default RSVP deadline (1 month before wedding)
insert into app_config (key, value)
values ('rsvp_deadline', '2025-10-15T23:59:59Z');
