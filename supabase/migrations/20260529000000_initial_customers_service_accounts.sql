create schema if not exists riztama_business;

create extension if not exists pgcrypto;

create or replace function riztama_business.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists riztama_business.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_label text,
  phone text,
  email text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customers_status_check
    check (status in ('active', 'inactive', 'archived'))
);

create index if not exists customers_status_idx
  on riztama_business.customers (status);

create index if not exists customers_name_idx
  on riztama_business.customers (name);

drop trigger if exists set_customers_updated_at on riztama_business.customers;

create trigger set_customers_updated_at
before update on riztama_business.customers
for each row
execute function riztama_business.set_updated_at();

create table if not exists riztama_business.service_accounts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  service_name text not null,
  account_identifier text,
  credential_reference text,
  total_slots integer not null default 0,
  used_slots integer not null default 0,
  status text not null default 'active',
  renewal_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint service_accounts_status_check
    check (status in ('active', 'full', 'maintenance', 'inactive', 'archived')),
  constraint service_accounts_total_slots_check
    check (total_slots >= 0),
  constraint service_accounts_used_slots_check
    check (used_slots >= 0),
  constraint service_accounts_used_slots_capacity_check
    check (used_slots <= total_slots)
);

create index if not exists service_accounts_status_idx
  on riztama_business.service_accounts (status);

create index if not exists service_accounts_service_name_idx
  on riztama_business.service_accounts (service_name);

drop trigger if exists set_service_accounts_updated_at on riztama_business.service_accounts;

create trigger set_service_accounts_updated_at
before update on riztama_business.service_accounts
for each row
execute function riztama_business.set_updated_at();

alter table riztama_business.customers enable row level security;
alter table riztama_business.service_accounts enable row level security;

create policy customers_read_all
  on riztama_business.customers
  for select
  using (true);

create policy service_accounts_read_all
  on riztama_business.service_accounts
  for select
  using (true);


