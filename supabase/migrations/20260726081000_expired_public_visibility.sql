drop policy if exists "published_invitations_public_read" on public.invitations;
create policy "published_invitations_public_read"
on public.invitations for select to anon
using (status = 'published' and deleted_at is null
  and event_date >= (now() at time zone 'Asia/Tashkent')::date - 14);
