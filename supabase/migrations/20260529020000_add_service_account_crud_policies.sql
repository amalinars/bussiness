do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'service_accounts'
      and policyname = 'service_accounts_insert_all'
  ) then
    create policy service_accounts_insert_all
      on riztama_business.service_accounts
      for insert
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'riztama_business'
      and tablename = 'service_accounts'
      and policyname = 'service_accounts_update_all'
  ) then
    create policy service_accounts_update_all
      on riztama_business.service_accounts
      for update
      using (true)
      with check (true);
  end if;
end $$;
