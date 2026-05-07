create extension if not exists "pgcrypto";

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text not null,
  status text not null,
  commenced_at date,
  client text,
  category text,
  description text,
  image_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text not null unique,
  status text not null default 'Active',
  image_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.collaborators (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  expertise_type text not null,
  contact_email text not null,
  joint_projects integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  award_year integer not null,
  related_project text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id text primary key,
  studio_name text not null,
  contact_email text not null,
  phone_number text not null,
  office_address text not null,
  instagram_handle text,
  linkedin_url text,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.site_settings (
  id,
  studio_name,
  contact_email,
  phone_number,
  office_address,
  instagram_handle,
  linkedin_url
)
values (
  'default',
  'Tropical Line Design',
  'hello@tropical-line.com',
  '+62 812 3456 7890',
  'Jl. Raya Seminyak No. 123, Kuta, Badung, Bali 80361, Indonesia',
  '@tropicallinedesign',
  'https://www.linkedin.com'
)
on conflict (id) do nothing;
