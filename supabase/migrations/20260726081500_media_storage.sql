insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('wedding-media','wedding-media',true,5242880,array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4'])
on conflict(id) do update set public=true,file_size_limit=5242880;
create policy "wedding_media_public_read" on storage.objects for select to public using (bucket_id='wedding-media');
create policy "wedding_media_owner_insert" on storage.objects for insert to authenticated
with check (bucket_id='wedding-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "wedding_media_owner_update" on storage.objects for update to authenticated
using (bucket_id='wedding-media' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check (bucket_id='wedding-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "wedding_media_owner_delete" on storage.objects for delete to authenticated
using (bucket_id='wedding-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
