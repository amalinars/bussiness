create or replace function riztama_business.complete_expired_bookings()
returns void
language plpgsql
security definer
as $$
declare
  v_rec record;
begin
  -- Loop through expired 'booked' subscriptions to update their status and trigger profile sync
  for v_rec in
    select id, service_account_profile_id from riztama_business.subscriptions
    where status = 'booked'
      and (
        end_date < current_date
        or (
          end_date = current_date
          and coalesce(end_time, '23:59:00')::time <= current_time
        )
      )
  loop
    update riztama_business.subscriptions
    set status = 'completed'
    where id = v_rec.id;
  end loop;
end;
$$;
