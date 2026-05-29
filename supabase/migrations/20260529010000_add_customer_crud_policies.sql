do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'customers'
      and policyname = 'customers_insert_all'
  ) then
    create policy customers_insert_all
      on riztama_business.customers
      for insert
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'customers'
      and policyname = 'customers_update_all'
  ) then
    create policy customers_update_all
      on riztama_business.customers
      for update
      using (true)
      with check (true);
  end if;
end $$;
