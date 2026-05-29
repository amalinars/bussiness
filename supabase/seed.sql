insert into riztama_business.customers (
  id,
  name,
  contact_label,
  phone,
  email,
  status,
  notes
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'Alya Putri',
    'Alya WA',
    '+628111111111',
    'alya@example.test',
    'active',
    'Sample active customer for local/VPS Supabase testing.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Bima Santoso',
    'Bima Telegram',
    '+628222222222',
    null,
    'inactive',
    'Sample inactive customer without email.'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Citra Lestari',
    null,
    null,
    'citra@example.test',
    'archived',
    'Sample archived customer.'
  )
on conflict (id) do nothing;

insert into riztama_business.service_accounts (
  id,
  label,
  service_name,
  account_identifier,
  credential_reference,
  total_slots,
  used_slots,
  status,
  renewal_date,
  notes
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Streaming Account A',
    'Streaming Service',
    'stream-a@example.test',
    'vault:streaming/account-a',
    5,
    3,
    'active',
    '2026-06-29',
    'Sample account with available slots. No plain-text password stored.'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Design Tool Team 1',
    'Design Tool',
    'design-team-1@example.test',
    'vault:design/team-1',
    4,
    4,
    'full',
    '2026-07-15',
    'Sample full account.'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'Learning Platform Trial',
    'Learning Platform',
    null,
    null,
    10,
    0,
    'maintenance',
    null,
    'Sample maintenance account without credential reference.'
  )
on conflict (id) do nothing;
