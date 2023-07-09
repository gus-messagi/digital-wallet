DO
$do$
BEGIN
  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180001_create_table-transactions') THEN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TYPE operation_enum AS ENUM ('deposit', 'withdraw', 'purchase', 'cancellation', 'reversal');

    CREATE TABLE IF NOT EXISTS transactions (
      id uuid DEFAULT uuid_generate_v4 (),
      user_id uuid NOT NULL,

      operation operation_enum NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,

      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY(id)
    );
    INSERT INTO migrations (id) 
    VALUES ('20230706180001_create_table-transactions');
  END IF;

END
$do$