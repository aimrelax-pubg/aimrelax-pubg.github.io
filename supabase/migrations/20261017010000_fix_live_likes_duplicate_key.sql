-- Fix duplicate-key errors for TikTok-style LIVE likes.
-- Older schemas used PRIMARY KEY (stream_id, user_id), which allowed only one
-- like per user per stream. Use a unique row id so users can send repeated likes.

alter table public.live_likes
  add column if not exists id uuid default gen_random_uuid();

update public.live_likes
set id = gen_random_uuid()
where id is null;

alter table public.live_likes
  alter column id set default gen_random_uuid(),
  alter column id set not null;

do $$
declare
  c record;
  pk_is_id boolean;
begin
  -- Drop composite primary keys and unique constraints that prevent repeated likes.
  for c in
    select conname, contype
    from pg_constraint
    where conrelid = 'public.live_likes'::regclass
      and contype in ('p', 'u')
  loop
    if c.contype = 'u' then
      execute format('alter table public.live_likes drop constraint %I', c.conname);
    elsif c.contype = 'p' then
      select (
        array_agg(a.attname order by k.ordinality) = array['id']::name[]
      ) into pk_is_id
      from pg_constraint pc
      join unnest(pc.conkey) with ordinality as k(attnum, ordinality) on true
      join pg_attribute a on a.attrelid = pc.conrelid and a.attnum = k.attnum
      where pc.conrelid = 'public.live_likes'::regclass
        and pc.conname = c.conname;

      if not coalesce(pk_is_id, false) then
        execute format('alter table public.live_likes drop constraint %I', c.conname);
      end if;
    end if;
  end loop;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.live_likes'::regclass
      and contype = 'p'
  ) then
    alter table public.live_likes
      add constraint live_likes_pkey primary key (id);
  end if;
end $$;

create index if not exists live_likes_stream_id_idx
  on public.live_likes(stream_id);
