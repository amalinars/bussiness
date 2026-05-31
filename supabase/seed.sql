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
  account_password,
  credential_reference,
  total_slots,
  used_slots,
  status,
  renewal_date,
  notes
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Netflix Risma',
    'Netflix',
    'risma.amalina1510@gmail.com',
    'hidupsehat15',
    'Imported from spreadsheet account header.',
    5,
    4,
    'full',
    '2026-06-27',
    'Seeded from spreadsheet tab risma. Main profile is not rentable.'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Netflix Jovan',
    'Netflix',
    'rismamarlinak2@gmail.com',
    'mainyuk1224',
    'Imported from spreadsheet account header.',
    5,
    4,
    'full',
    '2026-06-27',
    'Seeded from spreadsheet tab jovan. Main profile is not rentable.'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'Netflix Tugeder',
    'Netflix',
    'keymarlin28@gmail.com',
    'yukjajan1224',
    'Imported from spreadsheet account header.',
    5,
    4,
    'full',
    '2026-06-28',
    'Seeded from spreadsheet tab tugeder. Main profile is not rentable.'
  )
on conflict (id) do update set
  label = excluded.label,
  service_name = excluded.service_name,
  account_identifier = excluded.account_identifier,
  account_password = excluded.account_password,
  credential_reference = excluded.credential_reference,
  total_slots = excluded.total_slots,
  used_slots = excluded.used_slots,
  status = excluded.status,
  renewal_date = excluded.renewal_date,
  notes = excluded.notes;

insert into riztama_business.service_account_profiles (
  id,
  service_account_id,
  profile_name,
  profile_pin,
  is_rentable,
  status,
  notes
) values
  (
    'a1111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'day6',
    '2606',
    false,
    'reserved',
    'Profile utama.'
  ),
  (
    'a2222222-2222-4222-8222-222222222222',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'sungjin',
    '1234',
    true,
    'occupied',
    null
  ),
  (
    'a3333333-3333-4333-8333-333333333333',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'dowoon',
    '1224',
    true,
    'occupied',
    null
  ),
  (
    'a4444444-4444-4444-8444-444444444444',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'wonpil',
    '0271',
    true,
    'occupied',
    null
  ),
  (
    'a5555555-5555-4555-8555-555555555555',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'youngk',
    '2625',
    true,
    'occupied',
    null
  ),
  (
    'b1111111-1111-4111-8111-111111111111',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'kulkas',
    '7890',
    false,
    'reserved',
    'Profile utama.'
  ),
  (
    'b2222222-2222-4222-8222-222222222222',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'sendal',
    '2030',
    true,
    'occupied',
    null
  ),
  (
    'b3333333-3333-4333-8333-333333333333',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'remot',
    '3642',
    true,
    'occupied',
    null
  ),
  (
    'b4444444-4444-4444-8444-444444444444',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'tutup botol',
    '2412',
    true,
    'occupied',
    null
  ),
  (
    'b5555555-5555-4555-8555-555555555555',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'cicak',
    '7889',
    true,
    'occupied',
    null
  ),
  (
    'c1111111-1111-4111-8111-111111111111',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'cakep',
    '1836',
    false,
    'reserved',
    'Profile utama.'
  ),
  (
    'c2222222-2222-4222-8222-222222222222',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'genteng',
    '3029',
    true,
    'occupied',
    null
  ),
  (
    'c3333333-3333-4333-8333-333333333333',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'bakwan',
    '1998',
    true,
    'occupied',
    null
  ),
  (
    'c4444444-4444-4444-8444-444444444444',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'gayung',
    '1971',
    true,
    'occupied',
    null
  ),
  (
    'c5555555-5555-4555-8555-555555555555',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'centong',
    '2558',
    true,
    'occupied',
    null
  )
on conflict (id) do nothing;
