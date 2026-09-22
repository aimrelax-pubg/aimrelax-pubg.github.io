-- AIMRELAX-PUBG — ADMIN DELETE USER ACCOUNT
-- Supabase SQL Editor
--
-- Adds a secure RPC:
--   public.delete_site_user(target_user_id uuid)
--
-- Rules:
--   • Only Owner/Admin can call it.
--   • Nobody can delete their own account through this RPC.
--   • Owner account is protected.
--   • Admin can delete regular users.
--   • Owner can delete regular users and admins.
--   • The actual account deletion is done from auth.users server-side.
--     Existing foreign-key ON DELETE CASCADE rules clean up linked data.

create or replace function public.delete_site_user(target_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  caller_id uuid := auth.uid();
  caller_role text;
  target_role text;
  deleted_count integer;
begin
  -- Must be logged in.
  if caller_id is null then
    raise exception 'Մուտք գործած օգտատեր չկա։';
  end if;

  -- Read the caller's existing site role.
  select lower(coalesce(public.get_my_site_role(), 'user'))
    into caller_role;

  if caller_role not in ('owner', 'admin') then
    raise exception 'Դուք չունեք օգտատեր ջնջելու իրավունք։';
  end if;

  -- Never allow deleting yourself.
  if target_user_id = caller_id then
    raise exception 'Դուք չեք կարող ջնջել ձեր սեփական հաշիվը։';
  end if;

  -- Protect the permanent Owner account.
  if target_user_id = '5f1c951f-1e76-4f82-9849-46becf038b55'::uuid then
    raise exception 'Owner հաշիվը հնարավոր չէ ջնջել։';
  end if;

  -- Read the target role using the site's existing admin-user RPC.
  select lower(coalesce(u.role, 'user'))
    into target_role
  from public.list_site_users() u
  where u.id = target_user_id
  limit 1;

  if target_role is null then
    raise exception 'Օգտատերը չի գտնվել։';
  end if;

  -- Admins may delete only regular users.
  if caller_role = 'admin' and target_role <> 'user' then
    raise exception 'Admin-ը կարող է ջնջել միայն սովորական օգտատերերի հաշիվները։';
  end if;

  -- Owner may delete users/admins, but not Owner (protected above).
  delete from auth.users
  where id = target_user_id;

  get diagnostics deleted_count = row_count;

  if deleted_count = 0 then
    raise exception 'Օգտատերը չի գտնվել կամ արդեն ջնջված է։';
  end if;

  return 'Օգտատիրոջ հաշիվը հաջողությամբ ջնջվեց։';
end;
$$;

-- Do not expose the function to anonymous users.
revoke all on function public.delete_site_user(uuid) from public;
revoke all on function public.delete_site_user(uuid) from anon;

-- Logged-in users can call it, but the function itself enforces Owner/Admin rights.
grant execute on function public.delete_site_user(uuid) to authenticated;
