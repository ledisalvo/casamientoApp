-- ── Guest Members ─────────────────────────────────────────────
-- One row per individual within a guest group (family)
create table guest_members (
  id         uuid primary key default gen_random_uuid(),
  guest_id   uuid not null references guests (id) on delete cascade,
  name       text not null,
  email      text,
  created_at timestamptz not null default now()
);

create index guest_members_guest_id_idx on guest_members (guest_id);

-- RLS
alter table guest_members enable row level security;

create policy "admin_all_guest_members"
  on guest_members for all
  to authenticated
  using (true)
  with check (true);
