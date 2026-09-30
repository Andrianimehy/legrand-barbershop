/*
  # Create Admin User
  
  Creates the admin account for the barbershop back-office.
  Email: fetranirina@gmail.com
  Password hashed with bcrypt.
*/

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  recovery_token
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'fetranirina@gmail.com',
  crypt('123Fetra!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'fetranirina@gmail.com'
);

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.email,
  json_build_object('sub', u.id::text, 'email', u.email),
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email = 'fetranirina@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i WHERE i.provider_id = u.email
);
