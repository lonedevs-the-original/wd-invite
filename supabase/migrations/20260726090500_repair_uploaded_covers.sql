update public.invitations
set cover_url = gallery_urls[1]
where (cover_url is null or cover_url !~ '^https?://')
  and coalesce(array_length(gallery_urls,1),0) > 0;
