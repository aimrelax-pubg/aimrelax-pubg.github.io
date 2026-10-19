-- Add a player to the shared roster from the website or Android WebView.
-- Run this migration once in Supabase SQL Editor.
create or replace function public.admin_add_player(p_nickname text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  clean_nickname text;
  existing_id uuid;
  new_id uuid;
begin
  caller_role := lower(coalesce(public.get_my_site_role(), ''));
  if auth.uid() = '5f1c951f-1e76-4f82-9849-46becf038b55'::uuid then
    caller_role := 'owner';
  end if;
  if caller_role not in ('owner', 'admin') then
    raise exception 'Only site admins can add players';
  end if;

  clean_nickname := btrim(coalesce(p_nickname, ''));
  if clean_nickname = '' then
    raise exception 'Nickname cannot be empty';
  end if;
  if char_length(clean_nickname) > 80 then
    raise exception 'Nickname must be 80 characters or fewer';
  end if;

  select id into existing_id
  from public.players
  where lower(btrim(nickname)) = lower(clean_nickname)
  order by active desc nulls last
  limit 1;

  if existing_id is not null then
    update public.players
       set active = true
     where id = existing_id;
    return existing_id;
  end if;

  insert into public.players (nickname, active)
  values (clean_nickname, true)
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.admin_add_player(text) from public;
grant execute on function public.admin_add_player(text) to authenticated;
