-- Add an independent voting switch per player.
alter table public.players
  add column if not exists voting_enabled boolean not null default true;

create or replace function public.admin_set_player_voting_enabled(
  p_player_id uuid,
  p_enabled boolean
)
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
    raise exception 'Only site admins can change player voting';
  end if;

  update public.players
     set voting_enabled = p_enabled
   where id = p_player_id;
  if not found then
    raise exception 'Player not found';
  end if;
end;
$$;

revoke all on function public.admin_set_player_voting_enabled(uuid, boolean) from public;
grant execute on function public.admin_set_player_voting_enabled(uuid, boolean) to authenticated;
