create or replace function public.list_platform_accounts()
returns table (
  user_id uuid,
  email text,
  full_name text,
  role text,
  registered_at timestamptz,
  last_sign_in_at timestamptz,
  invitation_count bigint,
  active_invitation_count bigint,
  deleted_invitation_count bigint,
  guest_response_count bigint
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce((select auth.jwt())->'app_metadata'->>'role','') <> 'admin' then
    raise exception 'Administrator access required';
  end if;
  return query
  select
    u.id,
    u.email::text,
    p.full_name,
    coalesce(u.raw_app_meta_data->>'role','user')::text,
    u.created_at,
    u.last_sign_in_at,
    count(distinct i.id),
    count(distinct i.id) filter (where i.deleted_at is null),
    count(distinct i.id) filter (where i.deleted_at is not null),
    count(g.id)
  from auth.users u
  left join public.profiles p on p.id=u.id
  left join public.invitations i on i.owner_id=u.id
  left join public.guests g on g.invitation_id=i.id
  group by u.id,u.email,p.full_name,u.raw_app_meta_data,u.created_at,u.last_sign_in_at
  order by u.created_at desc;
end;
$$;
revoke all on function public.list_platform_accounts() from public,anon;
grant execute on function public.list_platform_accounts() to authenticated;
