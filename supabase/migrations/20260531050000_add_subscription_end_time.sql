alter table riztama_business.subscriptions
add column if not exists end_time time without time zone default '23:59';

update riztama_business.subscriptions
set end_time = '23:59'
where end_time is null;
