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
  ),
  (
    '10000000-0000-4000-8000-000000000001',
    'jovan',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'rara',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'tabina',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'nopy',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'ninis',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'santi',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    'ayuni',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    'kezia',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000009',
    'tiarad',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000010',
    'audrey',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000011',
    'anindita',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000012',
    'farrel',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000013',
    'anon',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000014',
    'yunia',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000015',
    'sein',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000016',
    'ra',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000017',
    'vina',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000018',
    'va',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000019',
    'rafi',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000020',
    'tira',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000021',
    'naa',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  ),
  (
    '10000000-0000-4000-8000-000000000022',
    'yosefine',
    'Spreadsheet buyer',
    null,
    null,
    'active',
    'Seeded from Netflix buyer spreadsheet.'
  )
on conflict (id) do update set
  name = excluded.name,
  contact_label = excluded.contact_label,
  phone = excluded.phone,
  email = excluded.email,
  status = excluded.status,
  notes = excluded.notes;

insert into riztama_business.rental_packages (
  id,
  name,
  duration_days,
  default_price,
  status,
  notes
) values
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    'active',
    'Seeded from spreadsheet package options.'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd02',
    '2 Hari',
    2,
    7000,
    'active',
    'Seeded from spreadsheet package options.'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    'active',
    'Seeded from spreadsheet package options.'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddd04',
    '1 Minggu',
    7,
    20000,
    'active',
    'Seeded from spreadsheet package options.'
  )
on conflict (id) do update set
  name = excluded.name,
  duration_days = excluded.duration_days,
  default_price = excluded.default_price,
  status = excluded.status,
  notes = excluded.notes;

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
on conflict (id) do update set
  service_account_id = excluded.service_account_id,
  profile_name = excluded.profile_name,
  profile_pin = excluded.profile_pin,
  is_rentable = excluded.is_rentable,
  status = excluded.status,
  notes = excluded.notes;

insert into riztama_business.subscriptions (
  id,
  customer_id,
  service_account_id,
  service_account_profile_id,
  rental_package_id,
  package_name_snapshot,
  duration_days_snapshot,
  price_snapshot,
  start_date,
  end_date,
  status,
  notes
) values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2222222-2222-4222-8222-222222222222',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-27',
    '2026-05-30',
    'completed',
    'Risma sheet row 1. PIN 1234. log out: 09.40. Income Rp 10.000. Laba Rp -176.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-27',
    '2026-05-28',
    'completed',
    'Risma sheet row 2. PIN 1224. log out: 09.50. Income Rp 15.000. Laba Rp -171.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-27',
    '2026-05-30',
    'completed',
    'Risma sheet row 3. PIN 0271. log out: 11.20. Income Rp 25.000. Laba Rp -161.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000004',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd04',
    '1 Minggu',
    7,
    20000,
    '2026-05-27',
    '2026-06-03',
    'booked',
    'Risma sheet row 4. PIN 2625. log out: 11.25. Income Rp 45.000. Laba Rp -141.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000005',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-28',
    '2026-05-31',
    'completed',
    'Risma sheet row 5. PIN 1708. log out 11.00. Income Rp 55.000. Laba Rp -131.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000006',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a2222222-2222-4222-8222-222222222222',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd04',
    '1 Minggu',
    7,
    20000,
    '2026-05-30',
    '2026-06-06',
    'booked',
    'Risma sheet row 6. PIN 1516. log out 15.51. Income Rp 75.000. Laba Rp -111.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000007',
    '10000000-0000-4000-8000-000000000007',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'a4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-30',
    '2026-05-31',
    'completed',
    'Risma sheet row 7. PIN 1644. log out 19.10. Income Rp 80.000. Laba Rp -106.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000008',
    '10000000-0000-4000-8000-000000000008',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b2222222-2222-4222-8222-222222222222',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-27',
    '2026-05-30',
    'completed',
    'Jovan sheet row 1. PIN 2030. log out: 13.35. Income Rp 10.000. Laba Rp -176.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000009',
    '10000000-0000-4000-8000-000000000009',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-27',
    '2026-05-28',
    'completed',
    'Jovan sheet row 2. PIN 3642. log out: 13.35. Income Rp 15.000. Laba Rp -171.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000010',
    '10000000-0000-4000-8000-000000000006',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-27',
    '2026-05-30',
    'completed',
    'Jovan sheet row 3. PIN 2412. log out: 13.35. Income Rp 25.000. Laba Rp -161.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-8000-000000000010',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd02',
    '2 Hari',
    2,
    7000,
    '2026-05-27',
    '2026-05-29',
    'completed',
    'Jovan sheet row 4. PIN 7889. log out: 14.00. Income Rp 32.000. Laba Rp -154.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000012',
    '10000000-0000-4000-8000-000000000011',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd04',
    '1 Minggu',
    7,
    20000,
    '2026-05-28',
    '2026-06-04',
    'booked',
    'Jovan sheet row 5. PIN 1996. log out: 14.40. Income Rp 52.000. Laba Rp -134.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000013',
    '10000000-0000-4000-8000-000000000012',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-29',
    '2026-05-30',
    'completed',
    'Jovan sheet row 7. PIN 1819. log out 20.40. Income Rp 57.000. Laba Rp -129.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000014',
    '10000000-0000-4000-8000-000000000013',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b2222222-2222-4222-8222-222222222222',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-30',
    '2026-05-31',
    'completed',
    'Jovan sheet row 8. PIN 2117. log out 18.42. Income Rp 62.000. Laba Rp -124.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000015',
    '10000000-0000-4000-8000-000000000014',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-30',
    '2026-05-31',
    'completed',
    'Jovan sheet row 9. PIN 2903. log out 22.55. Income Rp 67.000. Laba Rp -119.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000016',
    '10000000-0000-4000-8000-000000000015',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'b5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-30',
    '2026-06-03',
    'booked',
    'Jovan sheet row 10. PIN 8119. log out 23.20. Income Rp 77.000. Laba Rp -109.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000017',
    '10000000-0000-4000-8000-000000000016',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c2222222-2222-4222-8222-222222222222',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-28',
    '2026-05-31',
    'completed',
    'Tugeder sheet row 1. PIN 3029. log out 13.50. Income Rp 10.000. Laba Rp -176.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000018',
    '10000000-0000-4000-8000-000000000017',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-28',
    '2026-05-29',
    'completed',
    'Tugeder sheet row 2. PIN 1998. log out 14.25. Income Rp 15.000. Laba Rp -171.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000019',
    '10000000-0000-4000-8000-000000000018',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-28',
    '2026-05-29',
    'completed',
    'Tugeder sheet row 3. PIN 1971. log out 14.45. Income Rp 20.000. Laba Rp -166.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000020',
    '10000000-0000-4000-8000-000000000019',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-28',
    '2026-05-29',
    'completed',
    'Tugeder sheet row 4. PIN 2558. log out 15.10. Income Rp 25.000. Laba Rp -161.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000021',
    '10000000-0000-4000-8000-000000000020',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-29',
    '2026-05-30',
    'completed',
    'Tugeder sheet row 5. PIN 2615. log out 20.00. Income Rp 30.000. Laba Rp -156.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000022',
    '10000000-0000-4000-8000-000000000021',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c4444444-4444-4444-8444-444444444444',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd02',
    '2 Hari',
    2,
    7000,
    '2026-05-29',
    '2026-05-31',
    'completed',
    'Tugeder sheet row 6. PIN 1526. log out 20.47. Income Rp 37.000. Laba Rp -149.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000023',
    '10000000-0000-4000-8000-000000000017',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c5555555-5555-4555-8555-555555555555',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd03',
    '3 Hari',
    3,
    10000,
    '2026-05-29',
    '2026-06-01',
    'booked',
    'Tugeder sheet row 7. PIN 1625. log out 21.10. Income Rp 47.000. Laba Rp -139.000.'
  ),
  (
    '20000000-0000-4000-8000-000000000024',
    '10000000-0000-4000-8000-000000000022',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'c3333333-3333-4333-8333-333333333333',
    'dddddddd-dddd-4ddd-8ddd-dddddddddd01',
    '1 Hari',
    1,
    5000,
    '2026-05-30',
    '2026-05-31',
    'completed',
    'Tugeder sheet row 8. PIN 2509. log out 23.17. Income Rp 52.000. Laba Rp -134.000.'
  )
on conflict (id) do update set
  customer_id = excluded.customer_id,
  service_account_id = excluded.service_account_id,
  service_account_profile_id = excluded.service_account_profile_id,
  rental_package_id = excluded.rental_package_id,
  package_name_snapshot = excluded.package_name_snapshot,
  duration_days_snapshot = excluded.duration_days_snapshot,
  price_snapshot = excluded.price_snapshot,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  status = excluded.status,
  notes = excluded.notes;
