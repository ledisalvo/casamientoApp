-- Enable RLS on all tables
alter table guests        enable row level security;
alter table rsvp_responses enable row level security;
alter table app_config    enable row level security;

-- ── guests ────────────────────────────────────────────────────
-- Anon cannot read guests directly (Edge Function uses service_role)
-- Authenticated (admin) has full access
create policy "admin_all_guests"
  on guests for all
  to authenticated
  using (true)
  with check (true);

-- ── rsvp_responses ────────────────────────────────────────────
-- Anon can insert (submit RSVP)
create policy "anon_insert_rsvp"
  on rsvp_responses for insert
  to anon
  with check (true);

-- Authenticated (admin) has full access
create policy "admin_all_rsvp"
  on rsvp_responses for all
  to authenticated
  using (true)
  with check (true);

-- ── app_config ────────────────────────────────────────────────
-- Anon can read (to get rsvp_deadline)
create policy "anon_read_config"
  on app_config for select
  to anon
  using (true);

-- Authenticated (admin) has full access
create policy "admin_all_config"
  on app_config for all
  to authenticated
  using (true)
  with check (true);
