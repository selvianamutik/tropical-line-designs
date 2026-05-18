alter table public.site_settings
  add column if not exists footer_heading text,
  add column if not exists footer_description text;

update public.site_settings
set
  footer_heading = coalesce(footer_heading, 'Holistic tropical landscape design shaped for Bali and beyond.'),
  footer_description = coalesce(
    footer_description,
    'As a landscape design company based in Bali, a tropical paradise in Indonesia, Tropical Line Design focuses on creating landscape designs with a natural and tropical ambiance combined with elegance to fulfill clients'' expectations.'
  )
where id = 'default';
