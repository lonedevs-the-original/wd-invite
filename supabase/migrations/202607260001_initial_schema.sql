-- Taklif: multi-wedding invitations, guests, and RSVP responses.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  partner_one text not null,
  partner_two text not null,
  event_date date not null,
  event_time time not null,
  venue text not null,
  address text not null default '',
  map_url text not null default '',
  message text not null default '',
  theme jsonb not null default '{"accent":"#a4775a","style":"classic"}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  phone text,
  access_code text not null default encode(gen_random_bytes(8), 'hex'),
  party_size integer not null default 1 check (party_size between 1 and 20),
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending','attending','declined')),
  attending_count integer check (attending_count between 0 and 20),
  note text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (invitation_id, access_code)
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.guests enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "invitations_owner_all" on public.invitations for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "published_invitations_public_read" on public.invitations for select to anon using (status = 'published');
create policy "guests_owner_all" on public.guests for all to authenticated
  using (exists (select 1 from public.invitations i where i.id = guests.invitation_id and i.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.invitations i where i.id = guests.invitation_id and i.owner_id = (select auth.uid())));

grant select on public.invitations to anon;
grant select, insert, update, delete on public.profiles, public.invitations, public.guests to authenticated;

create index if not exists invitations_owner_id_idx on public.invitations(owner_id);
create index if not exists guests_invitation_id_idx on public.guests(invitation_id);
create index if not exists guests_access_code_idx on public.guests(access_code);
