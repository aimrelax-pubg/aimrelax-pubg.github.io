-- AIMRELAX Android push delivery.
-- Before push sending can work, add the Supabase service-role key to Vault as
-- aimrelax_supabase_service_role_key and configure the Edge Function secrets:
--   FIREBASE_SERVICE_ACCOUNT_JSON = the Firebase service-account JSON
-- The service-role key is intentionally never stored in this repository.

create schema if not exists net;
create extension if not exists pg_net with schema net;

create table if not exists public.device_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android',
  updated_at timestamptz not null default now()
);

alter table public.device_push_tokens enable row level security;

drop policy if exists "Users can register own push tokens" on public.device_push_tokens;
create policy "Users can register own push tokens"
  on public.device_push_tokens for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can refresh own push tokens" on public.device_push_tokens;
create policy "Users can refresh own push tokens"
  on public.device_push_tokens for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove own push tokens" on public.device_push_tokens;
create policy "Users can remove own push tokens"
  on public.device_push_tokens for delete to authenticated
  using (auth.uid() = user_id);

grant insert, update, delete on public.device_push_tokens to authenticated;
grant select, insert, update, delete on public.device_push_tokens to service_role;

create or replace function public.aimrelax_dispatch_push()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  v_service_role_key text;
  v_old_record jsonb := '{}'::jsonb;
begin
  -- Never fail a website action just because push configuration is incomplete.
  select decrypted_secret
    into v_service_role_key
    from vault.decrypted_secrets
   where name = 'aimrelax_supabase_service_role_key'
   limit 1;

  if v_service_role_key is null or length(v_service_role_key) < 20 then
    raise warning 'AIMRELAX push is not configured: add the service-role key to Vault.';
    return new;
  end if;

  if tg_op = 'UPDATE' then
    v_old_record := to_jsonb(old);
  end if;

  perform net.http_post(
    url := 'https://hvhlrbfjloiahbqmnrly.supabase.co/functions/v1/aimrelax-push-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
    ),
    body := jsonb_build_object(
      'table', tg_table_name,
      'event', tg_op,
      'record', to_jsonb(new),
      'old_record', v_old_record
    ),
    timeout_milliseconds := 5000
  );

  return new;
exception
  when undefined_table then
    raise warning 'AIMRELAX push needs Supabase Vault and pg_net enabled.';
    return new;
  when others then
    raise warning 'AIMRELAX push dispatch failed: %', sqlerrm;
    return new;
end;
$$;

drop trigger if exists aimrelax_push_user_notifications on public.user_notifications;
create trigger aimrelax_push_user_notifications
  after insert on public.user_notifications
  for each row execute function public.aimrelax_dispatch_push();

drop trigger if exists aimrelax_push_friend_requests on public.friend_requests;
create trigger aimrelax_push_friend_requests
  after insert or update of status on public.friend_requests
  for each row execute function public.aimrelax_dispatch_push();

drop trigger if exists aimrelax_push_private_messages on public.private_messages;
create trigger aimrelax_push_private_messages
  after insert on public.private_messages
  for each row execute function public.aimrelax_dispatch_push();

drop trigger if exists aimrelax_push_clan_notifications on public.clan_notifications;
create trigger aimrelax_push_clan_notifications
  after insert on public.clan_notifications
  for each row execute function public.aimrelax_dispatch_push();
