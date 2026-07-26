alter table public.site_settings alter column creator_name set default 'Yaratuvchi';
update public.site_settings set creator_name='Yaratuvchi',updated_at=now()
where id='creator_support' and lower(creator_name)='lonedevs';
