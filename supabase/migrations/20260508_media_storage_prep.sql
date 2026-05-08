create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public can read site media'
  ) then
    create policy "Public can read site media"
      on storage.objects
      for select
      to public
      using (bucket_id = 'site-media');
  end if;
end
$$;

alter table public.portfolios
  add column if not exists image_bucket text not null default 'site-media',
  add column if not exists image_path text,
  add column if not exists image_mime_type text,
  add column if not exists image_size_bytes bigint;

alter table public.team_members
  add column if not exists image_bucket text not null default 'site-media',
  add column if not exists image_path text,
  add column if not exists image_mime_type text,
  add column if not exists image_size_bytes bigint;

alter table public.collaborators
  add column if not exists image_bucket text not null default 'site-media',
  add column if not exists image_path text,
  add column if not exists image_mime_type text,
  add column if not exists image_size_bytes bigint;

alter table public.awards
  add column if not exists image_bucket text not null default 'site-media',
  add column if not exists image_path text,
  add column if not exists image_mime_type text,
  add column if not exists image_size_bytes bigint;

update public.portfolios
set image_path = regexp_replace(image_url, '^/+', 'legacy/')
where image_path is null
  and image_url like '/%';

alter table public.portfolios
  add constraint portfolios_status_check
    check (status in ('Planning', 'Design', 'Construction', 'Completed', 'On Hold')),
  add constraint portfolios_image_bucket_check
    check (image_bucket = 'site-media'),
  add constraint portfolios_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  add constraint portfolios_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0);

alter table public.team_members
  add constraint team_members_status_check
    check (status in ('Active', 'On Leave', 'Inactive')),
  add constraint team_members_image_bucket_check
    check (image_bucket = 'site-media'),
  add constraint team_members_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  add constraint team_members_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0);

alter table public.collaborators
  add constraint collaborators_joint_projects_check
    check (joint_projects >= 0),
  add constraint collaborators_image_bucket_check
    check (image_bucket = 'site-media'),
  add constraint collaborators_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  add constraint collaborators_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0);

alter table public.awards
  add constraint awards_year_check
    check (award_year between 1900 and 2100),
  add constraint awards_image_bucket_check
    check (image_bucket = 'site-media'),
  add constraint awards_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  add constraint awards_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0);
