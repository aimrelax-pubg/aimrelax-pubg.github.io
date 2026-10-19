-- AiMRELAX: daily reminder for users whose nickname does not start with 『Aim』
-- Run once in Supabase Dashboard -> SQL Editor.
-- Uses the existing user_notifications table and its existing push trigger.

create or replace function public.aimrelax_send_nickname_tag_reminders()
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  inserted_count integer := 0;
begin
  insert into public.user_notifications
    (user_id, type, title, body, data, is_read)
  select
    p.id,
    'nickname_tag_reminder',
    '⚠️ Փոխիր քո նիկը',
    'Խնդրում ենք նիկիդ սկզբում ավելացնել 『Aim』 թեգը։ Օրինակ՝ 『Aim』Player։',
    jsonb_build_object(
      'url', 'https://aimrelax-pubg.github.io/',
      'required_prefix', '『Aim』'
    ),
    false
  from public.profiles p
  where coalesce(btrim(p.nickname), '') not like '『Aim』%'
    and not exists (
      select 1
      from public.user_notifications n
      where n.user_id = p.id
        and n.type = 'nickname_tag_reminder'
        and n.created_at >= date_trunc('day', now())
        and n.created_at < date_trunc('day', now()) + interval '1 day'
    );

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

-- Keep the function callable by the scheduler, not directly by anonymous users.
revoke all on function public.aimrelax_send_nickname_tag_reminders() from public;
revoke all on function public.aimrelax_send_nickname_tag_reminders() from anon, authenticated;

-- Supabase commonly has pg_cron enabled. Schedule at 05:00 UTC (09:00 Armenia time).
create extension if not exists pg_cron with schema pg_catalog;

do $$
declare
  existing_job_id bigint;
begin
  select jobid into existing_job_id
  from cron.job
  where jobname = 'aimrelax-nickname-tag-daily-reminder'
  limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'aimrelax-nickname-tag-daily-reminder',
    '0 5 * * *',
    $job$select public.aimrelax_send_nickname_tag_reminders();$job$
  );
end;
$$;

-- Run once immediately so the first reminder is not delayed until tomorrow.
select public.aimrelax_send_nickname_tag_reminders() as reminders_created;
