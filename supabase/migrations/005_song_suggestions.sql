create table song_suggestions (
  id               uuid primary key default gen_random_uuid(),
  spotify_track_id text not null,
  track_name       text not null,
  artist_name      text not null,
  album_name       text not null,
  album_image_url  text,
  preview_url      text,
  suggested_at     timestamptz not null default now()
);

alter table song_suggestions enable row level security;

-- Anon can suggest and read (to show count + avoid dupes)
create policy "anon_insert_songs"
  on song_suggestions for insert
  to anon
  with check (true);

create policy "anon_read_songs"
  on song_suggestions for select
  to anon
  using (true);

-- Admin full access
create policy "admin_all_songs"
  on song_suggestions for all
  to authenticated
  using (true)
  with check (true);
