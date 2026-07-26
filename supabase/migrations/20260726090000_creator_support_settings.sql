create table if not exists public.site_settings (
  id text primary key check (id = 'creator_support'),
  creator_name text not null default 'LoneDevs',
  card_number text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
insert into public.site_settings(id,creator_name) values('creator_support','LoneDevs')
on conflict(id) do nothing;
create policy "site_settings_public_read" on public.site_settings
for select to anon, authenticated using (true);
create policy "site_settings_admin_update" on public.site_settings
for update to authenticated
using (coalesce((select auth.jwt())->'app_metadata'->>'role','')='admin')
with check (coalesce((select auth.jwt())->'app_metadata'->>'role','')='admin');
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
