create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  constraint services_sort_order_check
    check (sort_order >= 0)
);

alter table public.services enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'services'
      and policyname = 'Admins can manage services'
  ) then
    create policy "Admins can manage services"
      on public.services
      for all
      to authenticated
      using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
      with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));
  end if;
end
$$;

insert into public.services (title, description, sort_order, is_active)
values
  ('Landscape Design', 'Comprehensive tropical landscape design for hospitality, residential, and commercial environments.', 0, true),
  ('Landscape Construction', 'Build execution for gardens, resort grounds, villas, and contextual tropical outdoor spaces.', 1, true),
  ('Site Consultation', 'Strategic consultation for planting, site planning, and tropical landscape development.', 2, true)
on conflict do nothing;
