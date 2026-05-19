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

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text not null,
  status text not null,
  commenced_at date,
  client text,
  category text,
  architect text,
  landscape_consultant text,
  project_size text,
  display_order integer not null default 0,
  description text,
  image_url text,
  image_bucket text not null default 'site-media',
  image_path text,
  image_mime_type text,
  image_size_bytes bigint,
  gallery_layout text not null default 'D',
  constraint portfolios_status_check
    check (status in ('Planning', 'Design', 'Construction', 'Completed', 'On Hold')),
  constraint portfolios_gallery_layout_check
    check (gallery_layout in ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J')),
  constraint portfolios_display_order_check
    check (display_order >= 0),
  constraint portfolios_image_bucket_check
    check (image_bucket = 'site-media'),
  constraint portfolios_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint portfolios_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  object_path text not null unique,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint media_assets_bucket_check
    check (bucket = 'site-media'),
  constraint media_assets_object_path_check
    check (object_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint media_assets_size_check
    check (size_bytes is null or size_bytes >= 0)
);

create table if not exists public.portfolio_gallery_items (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  caption text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint portfolio_gallery_items_sort_order_check
    check (sort_order >= 0),
  constraint portfolio_gallery_items_portfolio_media_unique
    unique (portfolio_id, media_asset_id),
  constraint portfolio_gallery_items_portfolio_sort_unique
    unique (portfolio_id, sort_order)
);

create index if not exists portfolio_gallery_items_portfolio_sort_idx
  on public.portfolio_gallery_items (portfolio_id, sort_order);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text not null unique,
  status text not null default 'Active',
  image_url text,
  image_bucket text not null default 'site-media',
  image_path text,
  image_mime_type text,
  image_size_bytes bigint,
  constraint team_members_status_check
    check (status in ('Active', 'On Leave', 'Inactive')),
  constraint team_members_image_bucket_check
    check (image_bucket = 'site-media'),
  constraint team_members_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint team_members_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.collaborators (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  expertise_type text not null,
  contact_email text not null,
  joint_projects integer not null default 0,
  image_bucket text not null default 'site-media',
  image_path text,
  image_mime_type text,
  image_size_bytes bigint,
  constraint collaborators_joint_projects_check
    check (joint_projects >= 0),
  constraint collaborators_image_bucket_check
    check (image_bucket = 'site-media'),
  constraint collaborators_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint collaborators_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  award_year integer not null,
  related_project text,
  description text,
  image_bucket text not null default 'site-media',
  image_path text,
  image_mime_type text,
  image_size_bytes bigint,
  constraint awards_year_check
    check (award_year between 1900 and 2100),
  constraint awards_image_bucket_check
    check (image_bucket = 'site-media'),
  constraint awards_image_path_check
    check (image_path is null or image_path ~ '^[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint awards_image_size_check
    check (image_size_bytes is null or image_size_bytes >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  image_1_bucket text not null default 'site-media',
  image_1_path text,
  image_1_mime_type text,
  image_1_size_bytes bigint,
  image_2_bucket text not null default 'site-media',
  image_2_path text,
  image_2_mime_type text,
  image_2_size_bytes bigint,
  created_at timestamptz not null default timezone('utc', now()),
  constraint services_sort_order_check
    check (sort_order >= 0),
  constraint services_image_1_bucket_check
    check (image_1_bucket = 'site-media'),
  constraint services_image_1_path_check
    check (image_1_path is null or image_1_path ~ '^/?[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint services_image_1_size_check
    check (image_1_size_bytes is null or image_1_size_bytes >= 0),
  constraint services_image_2_bucket_check
    check (image_2_bucket = 'site-media'),
  constraint services_image_2_path_check
    check (image_2_path is null or image_2_path ~ '^/?[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint services_image_2_size_check
    check (image_2_size_bytes is null or image_2_size_bytes >= 0)
);

do $$
declare
  design_description text := 'We embody and harmonize our clients'' passion with the beauty of art wrapped in a 2-dimensional design. The design process goes through five stages: Conceptual Design, Design Development, Document for Tender, Document for Construction, and Construction Supervision.';
  build_description text := 'Not only do we embody the beauty of landscape art into 2-dimensional media, but we also dedicate ourselves to build the beauty into reality, which can be enjoyed directly. With the support of our complete set of construction equipment and planting nursery that has a wide variety of plants exclusively taken care of for our projects, we aim to build beautifully designed landscape architecture into life.';
begin
  if not exists (select 1 from public.services where upper(title) = 'DESIGN') then
    insert into public.services (title, description, sort_order, is_active, image_1_path, image_2_path)
    values ('DESIGN', design_description, 0, true, '/sofitel/so-1.jpg', '/anantara/an-1.jpg');
  end if;

  if not exists (select 1 from public.services where upper(title) = 'BUILD') then
    insert into public.services (title, description, sort_order, is_active, image_1_path, image_2_path)
    values ('BUILD', build_description, 1, true, '/bajo-well/bw-1.jpg', '/st-regis-bali/stb-1.png');
  end if;

  update public.services
  set
    image_1_path = coalesce(image_1_path, '/sofitel/so-1.jpg'),
    image_2_path = coalesce(image_2_path, '/anantara/an-1.jpg')
  where upper(title) = 'DESIGN';

  update public.services
  set
    image_1_path = coalesce(image_1_path, '/bajo-well/bw-1.jpg'),
    image_2_path = coalesce(image_2_path, '/st-regis-bali/stb-1.png')
  where upper(title) = 'BUILD';
end
$$;

create table if not exists public.site_settings (
  id text primary key,
  studio_name text not null,
  contact_email text not null,
  phone_number text not null,
  office_address text not null,
  instagram_handle text,
  linkedin_url text,
  footer_heading text,
  footer_description text,
  about_principal_image_bucket text not null default 'site-media',
  about_principal_image_path text,
  about_principal_image_mime_type text,
  about_principal_image_size_bytes bigint,
  contact_image_bucket text not null default 'site-media',
  contact_image_path text default '/sofitel/so-1.jpg',
  contact_image_mime_type text,
  contact_image_size_bytes bigint,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_settings_about_principal_image_bucket_check
    check (about_principal_image_bucket = 'site-media'),
  constraint site_settings_about_principal_image_path_check
    check (about_principal_image_path is null or about_principal_image_path ~ '^/?[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint site_settings_about_principal_image_size_check
    check (about_principal_image_size_bytes is null or about_principal_image_size_bytes >= 0),
  constraint site_settings_contact_image_bucket_check
    check (contact_image_bucket = 'site-media'),
  constraint site_settings_contact_image_path_check
    check (contact_image_path is null or contact_image_path ~ '^/?[A-Za-z0-9][A-Za-z0-9/_\\.-]*$'),
  constraint site_settings_contact_image_size_check
    check (contact_image_size_bytes is null or contact_image_size_bytes >= 0)
);

insert into public.site_settings (
  id,
  studio_name,
  contact_email,
  phone_number,
  office_address,
  instagram_handle,
  linkedin_url,
  footer_heading,
  footer_description
)
values (
  'default',
  'Tropical Line Design',
  'hello@tropical-line.com',
  '+62 812 3456 7890',
  'Jl. Raya Seminyak No. 123, Kuta, Badung, Bali 80361, Indonesia',
  '@tropicallinedesign',
  'https://www.linkedin.com',
  'Holistic tropical landscape design shaped for Bali and beyond.',
  'As a landscape design company based in Bali, a tropical paradise in Indonesia, Tropical Line Design focuses on creating landscape designs with a natural and tropical ambiance combined with elegance to fulfill clients'' expectations.'
)
on conflict (id) do nothing;
