create or replace function public.enforce_owner_invitation_limit()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin' then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(new.owner_id::text, 0)
  );

  if exists (
    select 1 from public.invitations
    where owner_id = new.owner_id
      and deleted_at is null
  ) then
    raise exception 'Only one active invitation is allowed for this account.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_owner_invitation_limit_trigger on public.invitations;
create trigger enforce_owner_invitation_limit_trigger
before insert on public.invitations
for each row execute function public.enforce_owner_invitation_limit();

revoke all on function public.enforce_owner_invitation_limit() from public, anon, authenticated;
