-- Create trigger to automatically sync booking/subscription status to service account profile status
create or replace function riztama_business.sync_profile_status_on_booking_change()
returns trigger
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  v_has_active_booking boolean;
begin
  -- 1. Identify which profile IDs need to be updated.
  if (tg_op = 'DELETE') then
    v_profile_id := old.service_account_profile_id;
  else
    v_profile_id := new.service_account_profile_id;
  end if;

  -- Handle the profile from the trigger row
  if v_profile_id is not null then
    -- Check if this profile has any other 'booked' subscription
    select exists (
      select 1 from riztama_business.subscriptions
      where service_account_profile_id = v_profile_id
        and status = 'booked'
    ) into v_has_active_booking;

    if v_has_active_booking then
      -- Update status of profile to 'occupied'
      update riztama_business.service_account_profiles
      set status = 'occupied'
      where id = v_profile_id
        and status != 'occupied';
    else
      -- If it has no active booking, set it back to 'available'
      update riztama_business.service_account_profiles
      set status = 'available'
      where id = v_profile_id
        and status != 'available'
        and status != 'archived';
    end if;
  end if;

  -- If it's an UPDATE and the profile ID changed, we must also update the OLD profile ID!
  if (tg_op = 'UPDATE' and old.service_account_profile_id is distinct from new.service_account_profile_id) then
    v_profile_id := old.service_account_profile_id;

    if v_profile_id is not null then
      select exists (
        select 1 from riztama_business.subscriptions
        where service_account_profile_id = v_profile_id
          and status = 'booked'
      ) into v_has_active_booking;

      if v_has_active_booking then
        update riztama_business.service_account_profiles
        set status = 'occupied'
        where id = v_profile_id
          and status != 'occupied';
      else
        update riztama_business.service_account_profiles
        set status = 'available'
        where id = v_profile_id
          and status != 'available'
          and status != 'archived';
      end if;
    end if;
  end if;

  return null;
end;
$$;

-- Create the trigger on subscriptions table
drop trigger if exists sync_profile_status_on_booking_change_trg on riztama_business.subscriptions;
create trigger sync_profile_status_on_booking_change_trg
after insert or update or delete on riztama_business.subscriptions
for each row
execute function riztama_business.sync_profile_status_on_booking_change();

-- Create trigger to automatically sync service_account_profiles status to service_accounts used_slots
create or replace function riztama_business.sync_service_account_used_slots()
returns trigger
language plpgsql
security definer
as $$
declare
  v_account_id uuid;
begin
  if (tg_op = 'DELETE') then
    v_account_id := old.service_account_id;
  else
    v_account_id := new.service_account_id;
  end if;

  if v_account_id is not null then
    update riztama_business.service_accounts
    set used_slots = (
      select count(*)
      from riztama_business.service_account_profiles
      where service_account_id = v_account_id
        and status in ('occupied', 'reserved')
    )
    where id = v_account_id;
  end if;

  -- Handle trigger row updates where service_account_id changed (rare but possible)
  if (tg_op = 'UPDATE' and old.service_account_id is distinct from new.service_account_id) then
    v_account_id := old.service_account_id;
    if v_account_id is not null then
      update riztama_business.service_accounts
      set used_slots = (
        select count(*)
        from riztama_business.service_account_profiles
        where service_account_id = v_account_id
          and status in ('occupied', 'reserved')
      )
      where id = v_account_id;
    end if;
  end if;

  return null;
end;
$$;

-- Create the trigger on service_account_profiles table
drop trigger if exists sync_service_account_used_slots_trg on riztama_business.service_account_profiles;
create trigger sync_service_account_used_slots_trg
after insert or update or delete on riztama_business.service_account_profiles
for each row
execute function riztama_business.sync_service_account_used_slots();

-- One-time sync for existing profile statuses based on subscriptions
update riztama_business.service_account_profiles p
set status = 'occupied'
where exists (
  select 1 from riztama_business.subscriptions s
  where s.service_account_profile_id = p.id
    and s.status = 'booked'
)
and p.status = 'available';

update riztama_business.service_account_profiles p
set status = 'available'
where not exists (
  select 1 from riztama_business.subscriptions s
  where s.service_account_profile_id = p.id
    and s.status = 'booked'
)
and p.status = 'occupied';

-- One-time sync for existing service account used slots
update riztama_business.service_accounts a
set used_slots = (
  select count(*)
  from riztama_business.service_account_profiles p
  where p.service_account_id = a.id
    and p.status in ('occupied', 'reserved')
);
