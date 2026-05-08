alter table public.portfolios
  add column if not exists architect text,
  add column if not exists landscape_consultant text,
  add column if not exists project_size text;
