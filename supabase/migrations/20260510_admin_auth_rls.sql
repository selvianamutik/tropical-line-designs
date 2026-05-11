alter table public.portfolios enable row level security;
alter table public.team_members enable row level security;
alter table public.collaborators enable row level security;
alter table public.awards enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.portfolio_gallery_items enable row level security;

do $$
declare
  tables text[] := array[
    'portfolios',
    'team_members',
    'collaborators',
    'awards',
    'site_settings',
    'media_assets',
    'portfolio_gallery_items'
  ];
  table_name text;
begin
  foreach table_name in array tables
  loop
    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = table_name
        and policyname = 'Admins can manage ' || table_name
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (coalesce((auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean, false)) with check (coalesce((auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean, false));',
        'Admins can manage ' || table_name,
        table_name
      );
    end if;
  end loop;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can upload site media'
  ) then
    create policy "Admins can upload site media"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'site-media'
        and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can update site media'
  ) then
    create policy "Admins can update site media"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'site-media'
        and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
      )
      with check (
        bucket_id = 'site-media'
        and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can delete site media'
  ) then
    create policy "Admins can delete site media"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'site-media'
        and coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
      );
  end if;
end
$$;
