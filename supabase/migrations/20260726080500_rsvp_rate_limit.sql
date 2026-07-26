drop policy if exists "public_rsvp_insert" on public.guests;
revoke insert on public.guests from anon;

create table if not exists public.rsvp_rate_limits (
  id bigint generated always as identity primary key,
  fingerprint text not null,
  created_at timestamptz not null default now()
);
alter table public.rsvp_rate_limits enable row level security;
revoke all on public.rsvp_rate_limits from anon, authenticated;
create index if not exists rsvp_rate_limits_lookup_idx on public.rsvp_rate_limits(fingerprint, created_at);

create or replace function public.submit_rsvp(
  target_invitation uuid, guest_name text, response_status text,
  guest_count integer default 1, guest_note text default null
) returns void language plpgsql security definer set search_path = '' as $$
declare fingerprint text;
begin
  fingerprint := encode(extensions.digest(
    coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', 'unknown')
    || ':' || target_invitation::text, 'sha256'), 'hex');
  if (select count(*) from public.rsvp_rate_limits
      where fingerprint = submit_rsvp.fingerprint and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Too many responses. Please try again later.';
  end if;
  if length(btrim(guest_name)) not between 2 and 100
     or response_status not in ('attending','declined')
     or guest_count not between 1 and 10
     or length(coalesce(guest_note,'')) > 500 then
    raise exception 'Invalid response details.';
  end if;
  if not exists (select 1 from public.invitations where id=target_invitation
    and status='published' and deleted_at is null
    and event_date >= (now() at time zone 'Asia/Tashkent')::date - 14) then
    raise exception 'Invitation is unavailable.';
  end if;
  insert into public.guests(invitation_id,name,party_size,attending_count,rsvp_status,note,responded_at)
  values(target_invitation,btrim(guest_name),guest_count,
    case when response_status='attending' then guest_count else 0 end,response_status,nullif(btrim(guest_note),''),now());
  insert into public.rsvp_rate_limits(fingerprint) values(fingerprint);
end; $$;
revoke all on function public.submit_rsvp(uuid,text,text,integer,text) from public;
grant execute on function public.submit_rsvp(uuid,text,text,integer,text) to anon, authenticated;
