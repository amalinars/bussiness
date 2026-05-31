create table if not exists riztama_business.service_account_costs (
  id uuid primary key default gen_random_uuid(),
  service_account_id uuid not null
    references riztama_business.service_accounts(id)
    on delete restrict,
  cost_date date not null,
  period_start date not null,
  period_end date not null,
  amount integer not null,
  status text not null default 'paid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint service_account_costs_amount_check
    check (amount >= 0),
  constraint service_account_costs_period_order_check
    check (period_end >= period_start),
  constraint service_account_costs_status_check
    check (status in ('paid', 'planned', 'cancelled'))
);

create index if not exists service_account_costs_service_account_id_idx
  on riztama_business.service_account_costs(service_account_id);

create index if not exists service_account_costs_cost_date_idx
  on riztama_business.service_account_costs(cost_date);

create index if not exists service_account_costs_period_idx
  on riztama_business.service_account_costs(period_start, period_end);

create trigger set_service_account_costs_updated_at
before update on riztama_business.service_account_costs
for each row
execute function riztama_business.set_updated_at();

alter table riztama_business.service_account_costs enable row level security;

create policy "Temporary dev read service account costs"
on riztama_business.service_account_costs
for select
using (true);

create policy "Temporary dev insert service account costs"
on riztama_business.service_account_costs
for insert
with check (true);

create policy "Temporary dev update service account costs"
on riztama_business.service_account_costs
for update
using (true)
with check (true);
