create table if not exists riztama_business.rental_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_days integer not null,
  default_price integer not null,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint rental_packages_duration_days_check
    check (duration_days > 0),
  constraint rental_packages_default_price_check
    check (default_price >= 0),
  constraint rental_packages_status_check
    check (status in ('active', 'archived'))
);

create index if not exists rental_packages_status_idx
  on riztama_business.rental_packages (status);

create unique index if not exists rental_packages_name_idx
  on riztama_business.rental_packages (name);

drop trigger if exists set_rental_packages_updated_at on riztama_business.rental_packages;

create trigger set_rental_packages_updated_at
before update on riztama_business.rental_packages
for each row
execute function riztama_business.set_updated_at();

create table if not exists riztama_business.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references riztama_business.customers(id) on delete restrict,
  service_account_id uuid not null references riztama_business.service_accounts(id) on delete restrict,
  service_account_profile_id uuid not null references riztama_business.service_account_profiles(id) on delete restrict,
  rental_package_id uuid not null references riztama_business.rental_packages(id) on delete restrict,
  package_name_snapshot text not null,
  duration_days_snapshot integer not null,
  price_snapshot integer not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'booked',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint subscriptions_duration_days_snapshot_check
    check (duration_days_snapshot > 0),
  constraint subscriptions_price_snapshot_check
    check (price_snapshot >= 0),
  constraint subscriptions_date_order_check
    check (end_date >= start_date),
  constraint subscriptions_status_check
    check (status in ('booked', 'completed', 'cancelled', 'archived'))
);

create index if not exists subscriptions_customer_id_idx
  on riztama_business.subscriptions (customer_id);

create index if not exists subscriptions_service_account_id_idx
  on riztama_business.subscriptions (service_account_id);

create index if not exists subscriptions_service_account_profile_id_idx
  on riztama_business.subscriptions (service_account_profile_id);

create index if not exists subscriptions_rental_package_id_idx
  on riztama_business.subscriptions (rental_package_id);

create index if not exists subscriptions_status_idx
  on riztama_business.subscriptions (status);

create index if not exists subscriptions_start_date_idx
  on riztama_business.subscriptions (start_date);

create index if not exists subscriptions_end_date_idx
  on riztama_business.subscriptions (end_date);

drop trigger if exists set_subscriptions_updated_at on riztama_business.subscriptions;

create trigger set_subscriptions_updated_at
before update on riztama_business.subscriptions
for each row
execute function riztama_business.set_updated_at();

alter table riztama_business.rental_packages enable row level security;
alter table riztama_business.subscriptions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'rental_packages'
      and policyname = 'rental_packages_read_all'
  ) then
    create policy rental_packages_read_all
      on riztama_business.rental_packages
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'rental_packages'
      and policyname = 'rental_packages_insert_all'
  ) then
    create policy rental_packages_insert_all
      on riztama_business.rental_packages
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'rental_packages'
      and policyname = 'rental_packages_update_all'
  ) then
    create policy rental_packages_update_all
      on riztama_business.rental_packages
      for update
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'subscriptions'
      and policyname = 'subscriptions_read_all'
  ) then
    create policy subscriptions_read_all
      on riztama_business.subscriptions
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'subscriptions'
      and policyname = 'subscriptions_insert_all'
  ) then
    create policy subscriptions_insert_all
      on riztama_business.subscriptions
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'subscriptions'
      and policyname = 'subscriptions_update_all'
  ) then
    create policy subscriptions_update_all
      on riztama_business.subscriptions
      for update
      using (true)
      with check (true);
  end if;
end $$;
