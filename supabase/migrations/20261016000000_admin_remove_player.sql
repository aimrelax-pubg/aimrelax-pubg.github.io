-- Allow only site owners/admins to remove a player from the roster and voting choices.
-- The player row remains in the database (active=false), preserving historical votes.
create or replace function public.admin_remove_player(p_player_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  caller_role := lower(coalesce(public.get_my_site_role(), ''));
  if auth.uid() = '5f1c951f-1e76-4f82-9849-46becf038b55'::uuid then
    caller_role := 'owner';
  end if;
  if caller_role not in ('owner', 'admin') then
    raise exception 'Only site admins can remove players';
  end if;
  update public.players
     set active = false
   where id = p_player_id;
  if not found then
    raise exception 'Player not found';
  end if;
end;
$$;

revoke all on function public.admin_remove_player(uuid) from public;
grant execute on function public.admin_remove_player(uuid) to authenticated;
