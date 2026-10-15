-- AIMRELAX LIVE repair: safe to run more than once in Supabase SQL Editor.
-- Fixes duplicate publication-membership errors, pause/resume status updates,
-- and permissions/realtime for LIVE comments.

create table if not exists public.live_comments (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null references public.live_streams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default 'Viewer',
  message text not null check (char_length(message) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.live_comments enable row level security;
alter table public.live_comments replica identity full;
alter table public.live_streams replica identity full;

drop policy if exists "Anyone can read LIVE comments" on public.live_comments;
create policy "Anyone can read LIVE comments"
  on public.live_comments for select using (true);

drop policy if exists "Signed-in users can post LIVE comments" on public.live_comments;
create policy "Signed-in users can post LIVE comments"
  on public.live_comments for insert to authenticated
  with check (auth.uid() = user_id);

grant select on public.live_comments to anon, authenticated;
grant insert on public.live_comments to authenticated;
grant select on public.live_streams to authenticated;
grant update on public.live_streams to authenticated;

-- Only the streamer who owns a LIVE row may change its status.
drop policy if exists "Streamer can update own LIVE status" on public.live_streams;
create policy "Streamer can update own LIVE status"
  on public.live_streams for update to authenticated
  using (auth.uid() = streamer_id)
  with check (auth.uid() = streamer_id);

-- Avoid duplicate-value errors by checking publication membership first.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='live_streams') then
      alter publication supabase_realtime add table public.live_streams;
    end if;
    if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='live_comments') then
      alter publication supabase_realtime add table public.live_comments;
    end if;
    if to_regclass('public.live_likes') is not null
       and not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='live_likes') then
      alter publication supabase_realtime add table public.live_likes;
    end if;
  end if;
end $$;
