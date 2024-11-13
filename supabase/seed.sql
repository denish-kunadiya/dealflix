DO $$
DECLARE
  photographer_user_id uuid;
  admin_user_id uuid;
  order_id uuid;
BEGIN

  photographer_user_id := public.create_user(jsonb_build_object(
    'email', 'test.guru.fusion@gmail.com',
    'first_name', 'Test',
    'last_name', 'Guru',
    'phone', '1234567890',
    'postal_code', '77001'
  ));

  admin_user_id := public.create_user(jsonb_build_object(
    'email', 'test.guru.cloudpano@gmail.com',
    'first_name', 'Admin',
    'last_name', 'Cloudpano',
    'phone', '1234567899',
    'postal_code', '77001'
  ));

  -- location := ST_SetSRID(ST_MakePoint(longitude,latitude), 4326);
  -- select * from ST_SetSRID(ST_MakePoint(-95.36340,29.76340), 4326);

-- 12231 Briar Forest Dr, Houston, TX 77077
-- Latitude
-- 29.7525282
-- Longitude
-- -95.5951451
-- location
-- 0101000020E6100000FA3779DB16E657C0585128B0A5C03D40

-- 4222 Sandydale Ln, Houston, TX 77039
-- Latitude
-- 29.9063229
-- Longitude
-- -95.3328055
-- location
-- 0101000020E6100000749B70AF4CD557C0AA1D0FC704E83D40

-- 1607 Mabry Mill Rd, Houston, TX 77062
-- Latitude
-- 29.586795
-- Longitude
-- -95.1410603
-- location
-- 0101000020E6100000E5D0C72107C957C0D174763238963D40

-- 12232 Briar Forest Dr, Houston, TX 77077
-- Latitude
-- 29.7526987
-- Longitude
-- -95.5951333
-- location
-- 0101000020E6100000AD10FBA916E657C0E13DACDCB0C03D40

-- 8047 Chateau St, Houston, TX 77028
-- Latitude
-- 29.8204875
-- Longitude
-- -95.2799987
-- location
-- 0101000020E61000000ADBAA7FEBD157C0DC4603780BD23D40

-- 12826 Fawnway Dr, Houston, TX 77048
-- Latitude
-- 29.6237084
-- Longitude
-- -95.343339
-- location
-- 0101000020E61000003F1C2444F9D557C0913D8C5AAB9F3D40

-- 12828 Fawnway Dr, Houston, TX 77048
-- Latitude
-- 29.6236902
-- Longitude
-- -95.3433389
-- location
-- 0101000020E610000075BCB843F9D557C0F0D53329AA9F3D40

-- 1606 Mabry Mill Rd, Houston, TX 77062
-- Latitude
-- 29.5868195
-- Longitude
-- -95.1408666
-- location
-- 0101000020E6100000510658F503C957C0B32781CD39963D40

-- 4223 Sandydale Ln, Houston, TX 77039
-- Latitude
-- 29.9064889
-- Longitude
-- -95.3328053
-- location
-- 0101000020E6100000DFDB99AE4CD557C0E0AF13A80FE83D40

-- 8046 Chateau St, Houston, TX 77028
-- Latitude
-- 29.8203225
-- Longitude
-- -95.2799967
-- location
-- 0101000020E61000003A5F4777EBD157C047ACC5A700D23D40


  update public.profile
  set location = '0101000020E610000073D712F241D757C033C4B12E6EC33D40'
  where public.profile.user_id = admin_user_id;

  update public.profile
  set location = '0101000020E610000073D712F241D757C033C4B12E6EC33D40'
  where public.profile.user_id = photographer_user_id;

  update public.role set role = 'admin' where public.role.user_id = admin_user_id;

  insert into public.order
    (
      creator_id,
      assignee_id,
      type,
      status,
      location,

      started_at,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      photographer_user_id,
      'test-order-type',
      'IN_PROGRESS',
      '0101000020E6100000AD10FBA916E657C0E13DACDCB0C03D40',

      (timezone('utc', now())),

      '12232 Briar Forest Dr',
      'Houston',
      'TX',
      '77077',
      1,

      'Camerom Doe',
      '1234567888',
      'cameron.doe@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, photographer_user_id, 'IN_PROGRESS', now() + interval '2 hour');

  insert into public.report (order_id, user_id)
    values (
      order_id,
      photographer_user_id
    );

  insert into public.order
    (
      creator_id,
      assignee_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      photographer_user_id,
      'test-order-type',
      'ASSIGNED',
      '0101000020E61000000ADBAA7FEBD157C0DC4603780BD23D40',

      '8047 Chateau St',
      'Houston',
      'TX',
      '77028',
      2,

      'Robert Smith',
      '1234567889',
      'robert.smith@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'ASSIGNED', now() + interval '2 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E61000003A5F4777EBD157C047ACC5A700D23D40',

      '8046 Chateau St',
      'Houston',
      'TX',
      '77028',
      2,

      'Robert Smith',
      '1234567889',
      'robert.smith@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E6100000E5D0C72107C957C0D174763238963D40',

      '1607 Mabry Mill Rd',
      'Houston',
      'TX',
      '77062',
      1,

      'Tomas Cook',
      '1234567890',
      'tomas.cook@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E6100000510658F503C957C0B32781CD39963D40',

      '1606 Mabry Mill Rd',
      'Houston',
      'TX',
      '77062',
      1,

      'Tomas Cook',
      '1234567890',
      'tomas.cook@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E610000075BCB843F9D557C0F0D53329AA9F3D40',

      '12828 Fawnway Dr',
      'Houston',
      'TX',
      '77048',
      2,

      'Gorge Brown',
      '1234567897',
      'gorge.brown@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E61000003F1C2444F9D557C0913D8C5AAB9F3D40',

      '12826 Fawnway Dr',
      'Houston',
      'TX',
      '77048',
      2,

      'Gorge Brown',
      '1234567897',
      'gorge.brown@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E6100000DFDB99AE4CD557C0E0AF13A80FE83D40',

      '4223 Sandydale Ln',
      'Houston',
      'TX',
      '77039',
      1,

      'Mike Rock',
      '1234567897',
      'mike.rock@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E6100000749B70AF4CD557C0AA1D0FC704E83D40',

      '4222 Sandydale Ln',
      'Houston',
      'TX',
      '77039',
      1,

      'Mike Rock',
      '1234567897',
      'mike.rock@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

  insert into public.order
    (
      creator_id,
      type,
      status,
      location,

      street_address,
      city,
      state,
      postal_code,
      floors_number,

      onsite_contact_name,
      onsite_contact_phone,
      onsite_contact_email,

      deliver_email,
    
      borrower_name,
      amc_name,
      lender_name,
      lender_id,
      lender_loan_id --lpaID
    )
      values
    (
      admin_user_id,
      'test-order-type',
      'AVAILABLE',
      '0101000020E6100000FA3779DB16E657C0585128B0A5C03D40',

      '12231 Briar Forest Dr',
      'Houston',
      'TX',
      '77077',
      1,

      'Camerom Doe',
      '1234567888',
      'cameron.doe@cloudpano.com',

      'deliver_email@cloudpano.com',
    
      'BORROWER_NAME',
      'CLOUDPANO',
      'LENDER_NAME',
      'LENDER_ID',
      'A123123'
    ) returning id into order_id;

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'INITIATED', now());

  insert into order_history (order_id, user_id, order_status, created_at)
  values (order_id, admin_user_id, 'AVAILABLE', now() + interval '1 hour');

END $$;

