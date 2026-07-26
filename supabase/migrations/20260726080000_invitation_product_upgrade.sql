alter table public.invitations
  add column if not exists card_number text,
  add column if not exists card_holder text,
  add column if not exists theme_style text not null default 'classic',
  add column if not exists cover_url text,
  add column if not exists gallery_urls text[] not null default '{}',
  add column if not exists music_url text,
  add column if not exists expires_at timestamptz;

alter table public.invitations drop constraint if exists invitations_card_number_check;
alter table public.invitations add constraint invitations_card_number_check
  check (card_number is null or card_number ~ '^[0-9 ]{12,23}$');
alter table public.invitations drop constraint if exists invitations_theme_style_check;
alter table public.invitations add constraint invitations_theme_style_check
  check (theme_style in ('classic', 'garden', 'midnight'));

create unique index if not exists invitations_one_active_per_owner_idx
on public.invitations(owner_id) where deleted_at is null;

create policy "public_rsvp_insert" on public.guests for insert to anon
with check (
  rsvp_status in ('attending', 'declined')
  and length(btrim(name)) between 2 and 100
  and party_size between 1 and 10
  and length(coalesce(note, '')) <= 500
  and exists (
    select 1 from public.invitations i
    where i.id = invitation_id and i.status = 'published' and i.deleted_at is null
      and i.event_date >= (now() at time zone 'Asia/Tashkent')::date - 14
  )
);
grant insert on public.guests to anon;

create or replace function public.cleanup_expired_invitations()
returns integer language plpgsql security invoker set search_path = '' as $$
declare removed integer;
begin
  delete from public.invitations
  where event_date < (now() at time zone 'Asia/Tashkent')::date - 14;
  get diagnostics removed = row_count;
  return removed;
end; $$;
revoke all on function public.cleanup_expired_invitations() from public, anon;
grant execute on function public.cleanup_expired_invitations() to authenticated;

create or replace function public.permanently_delete_invitation(target_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Administrator access required';
  end if;
  delete from public.invitations where id = target_id and deleted_at is not null;
end; $$;
revoke all on function public.permanently_delete_invitation(uuid) from public, anon;
grant execute on function public.permanently_delete_invitation(uuid) to authenticated;
