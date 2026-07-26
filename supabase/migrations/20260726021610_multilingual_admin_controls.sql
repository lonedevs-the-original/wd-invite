alter table public.invitations
  add column if not exists default_language text not null default 'uz'
    check (default_language in ('uz', 'ru', 'en')),
  add column if not exists message_uz text,
  add column if not exists message_ru text,
  add column if not exists message_en text,
  add column if not exists created_by_email text,
  add column if not exists deleted_at timestamptz;

update public.invitations
set message_uz = nullif(message, '')
where message_uz is null;

drop policy if exists "invitations_owner_all" on public.invitations;
drop policy if exists "published_invitations_public_read" on public.invitations;
drop policy if exists "guests_owner_all" on public.guests;

create policy "invitations_owner_or_admin_all"
on public.invitations for all to authenticated
using (
  (select auth.uid()) = owner_id
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
)
with check (
  (select auth.uid()) = owner_id
  or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

create policy "published_invitations_public_read"
on public.invitations for select to anon
using (status = 'published' and deleted_at is null);

create policy "guests_owner_or_admin_all"
on public.guests for all to authenticated
using (
  exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id
      and (
        i.owner_id = (select auth.uid())
        or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
      )
  )
)
with check (
  exists (
    select 1 from public.invitations i
    where i.id = guests.invitation_id
      and (
        i.owner_id = (select auth.uid())
        or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
      )
  )
);

create index if not exists invitations_deleted_at_idx
on public.invitations(deleted_at)
where deleted_at is not null;
