create table if not exists riztama_business.service_account_profiles (
  id uuid primary key default gen_random_uuid(),
  service_account_id uuid not null
    references riztama_business.service_accounts(id)
    on delete cascade,
  profile_name text not null,
  profile_pin text,
  is_rentable boolean not null default true,
  status text not null default 'available',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint service_account_profiles_status_check
    check (status in ('available', 'occupied', 'reserved', 'maintenance', 'archived'))
);

create index if not exists service_account_profiles_account_id_idx
  on riztama_business.service_account_profiles (service_account_id);

create index if not exists service_account_profiles_status_idx
  on riztama_business.service_account_profiles (status);

create index if not exists service_account_profiles_is_rentable_idx
  on riztama_business.service_account_profiles (is_rentable);

drop trigger if exists set_service_account_profiles_updated_at on riztama_business.service_account_profiles;

create trigger set_service_account_profiles_updated_at
before update on riztama_business.service_account_profiles
for each row
execute function riztama_business.set_updated_at();

alter table riztama_business.service_account_profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'service_account_profiles'
      and policyname = 'service_account_profiles_read_all'
  ) then
    create policy service_account_profiles_read_all
      on riztama_business.service_account_profiles
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'service_account_profiles'
      and policyname = 'service_account_profiles_insert_all'
  ) then
    create policy service_account_profiles_insert_all
      on riztama_business.service_account_profiles
      for insert
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'service_account_profiles'
      and policyname = 'service_account_profiles_update_all'
  ) then
    create policy service_account_profiles_update_all
      on riztama_business.service_account_profiles
      for update
      using (true)
      with check (true);
  end if;
end $$;
