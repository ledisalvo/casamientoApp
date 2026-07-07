-- Public RSVP flow (link genérico + confirmación en la landing).
-- El invitado se identifica con nombre libre; cualquiera con el link puede
-- confirmar (insert anónimo). La lectura y el borrado (moderación de colados)
-- quedan restringidos al admin autenticado.

create table public_rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  attending   boolean not null default true,
  seat_count  int not null default 1 check (seat_count >= 1),
  dietary     text not null default 'ninguna',
  created_at  timestamptz not null default now()
);

create index public_rsvps_created_at_idx
  on public_rsvps (created_at desc);

alter table public_rsvps enable row level security;

-- Anon puede confirmar (insert), pero NO leer ni borrar.
create policy "anon_insert_public_rsvps"
  on public_rsvps for insert
  to anon
  with check (true);

-- Admin (authenticated) tiene acceso total: listar y moderar (borrar).
create policy "admin_all_public_rsvps"
  on public_rsvps for all
  to authenticated
  using (true)
  with check (true);
