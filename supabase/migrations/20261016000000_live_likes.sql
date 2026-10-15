-- TikTok-style likes for each live stream.
create table if not exists public.live_likes (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid not null references public.live_streams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists live_likes_stream_id_idx
  on public.live_likes(stream_id);

alter table public.live_likes enable row level security;

drop policy if exists "Anyone can read LIVE likes" on public.live_likes;
create policy "Anyone can read LIVE likes"
  on public.live_likes
  for select
  using (true);

drop policy if exists "Signed-in users can send LIVE likes" on public.live_likes;
create policy "Signed-in users can send LIVE likes"
  on public.live_likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select on public.live_likes to anon, authenticated;
grant insert on public.live_likes to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.live_likes;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
