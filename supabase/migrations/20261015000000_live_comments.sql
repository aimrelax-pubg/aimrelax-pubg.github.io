create table if not exists public.live_comments (id uuid primary key default gen_random_uuid(), stream_id uuid not null, user_id uuid not null references auth.users(id) on delete cascade, author_name text not null default 'Viewer', message text not null check (char_length(message) between 1 and 300), created_at timestamptz not null default now());
alter table public.live_comments enable row level security;
create policy "Anyone can read LIVE comments" on public.live_comments for select using (true);
create policy "Signed-in users can post LIVE comments" on public.live_comments for insert to authenticated with check (auth.uid() = user_id);

do $$
begin
  alter publication supabase_realtime add table public.live_comments;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
