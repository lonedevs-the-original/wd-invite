drop index if exists public.invitations_one_active_per_owner_idx;

create or replace function public.submit_rsvp(
  target_invitation uuid, guest_name text, response_status text,
  guest_count integer default 1, guest_note text default null
) returns void language plpgsql security definer set search_path = '' as $$
begin
  if length(btrim(guest_name)) not between 2 and 100
     or response_status not in ('attending','declined')
     or guest_count not between 1 and 10
     or length(coalesce(guest_note,'')) > 500 then
    raise exception 'Invalid response details.';
  end if;
  if not exists (
    select 1 from public.invitations
    where id=target_invitation and status='published' and deleted_at is null
      and event_date >= (now() at time zone 'Asia/Tashkent')::date - 14
  ) then
    raise exception 'Invitation is unavailable.';
  end if;
  insert into public.guests(
    invitation_id,name,party_size,attending_count,rsvp_status,note,responded_at
  ) values (
    target_invitation,btrim(guest_name),guest_count,
    case when response_status='attending' then guest_count else 0 end,
    response_status,nullif(btrim(guest_note),''),now()
  );
end; $$;

drop table if exists public.rsvp_rate_limits;
