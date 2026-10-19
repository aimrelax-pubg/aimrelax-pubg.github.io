-- Send Android push notifications when a new LIVE stream is created.
-- Uses the existing Vault secret and existing aimrelax-push-send Edge Function.
-- Run once in Supabase SQL Editor. No APK rebuild is required.

create or replace function public.aimrelax_dispatch_live_push()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault
as $$
declare
  v_push_secret text;
begin
  if lower(coalesce(new.status, '')) <> 'live' then
    return new;
  end if;

  select decrypted_secret
    into v_push_secret
    from vault.decrypted_secrets
   where name = 'aimrelax_push_api_key'
   limit 1;

  if v_push_secret is null or length(v_push_secret) < 20 then
    raise warning 'AIMRELAX LIVE push is not configured: check Vault secret aimrelax_push_api_key.';
    return new;
  end if;

  perform net.http_post(
    url := 'https://hvhlrbfjloiahbqmnrly.supabase.co/functions/v1/aimrelax-push-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-push-secret', v_push_secret
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'event', 'INSERT',
      'schema', 'public',
      'table', 'live_streams',
      'record', to_jsonb(new),
      'old_record', '{}'::jsonb
    ),
    timeout_milliseconds := 5000
  );

  return new;
exception
  when undefined_table then
    raise warning 'AIMRELAX LIVE push needs Supabase Vault and pg_net enabled.';
    return new;
  when others then
    raise warning 'AIMRELAX LIVE push dispatch failed: %', sqlerrm;
    return new;
end;
$$;

drop trigger if exists aimrelax_push_live_stream_started on public.live_streams;
create trigger aimrelax_push_live_stream_started
  after insert on public.live_streams
  for each row
  when (lower(coalesce(new.status, '')) = 'live')
  execute function public.aimrelax_dispatch_live_push();
