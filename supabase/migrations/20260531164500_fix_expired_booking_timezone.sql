create or replace function riztama_business.complete_expired_bookings()
returns void
language plpgsql
security definer
as $$
declare
  v_rec record;
  v_now timestamp without time zone := timezone('Asia/Jakarta', now());
begin
  -- Complete expired active bookings using business-local time (Asia/Jakarta).
  for v_rec in
    select id, service_account_profile_id from riztama_business.subscriptions
    where status = 'booked'
      and (
        end_date < v_now::date
        or (
          end_date = v_now::date
          and coalesce(end_time, '23:59:00')::time <= v_now::time
        )
      )
  loop
    update riztama_business.subscriptions
    set status = 'completed'
    where id = v_rec.id;
  end loop;
end;
$$;
