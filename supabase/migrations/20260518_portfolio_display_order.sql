alter table public.portfolios
  add column if not exists display_order integer not null default 0;

alter table public.portfolios
  drop constraint if exists portfolios_display_order_check;

alter table public.portfolios
  add constraint portfolios_display_order_check
    check (display_order >= 0);

with ordered_portfolios as (
  select
    id,
    row_number() over (
      order by commenced_at desc nulls last, created_at desc
    ) - 1 as next_display_order
  from public.portfolios
)
update public.portfolios p
set display_order = ordered_portfolios.next_display_order
from ordered_portfolios
where p.id = ordered_portfolios.id
  and p.display_order = 0;
