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

alter table public.portfolios
  add column if not exists gallery_layout text not null default 'D';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_gallery_layout_check'
      and conrelid = 'public.portfolios'::regclass
  ) then
    alter table public.portfolios
      add constraint portfolios_gallery_layout_check
      check (gallery_layout in ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'));
  end if;
end
$$;
