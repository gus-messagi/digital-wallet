DO
$do$
BEGIN
  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180001_create_table-statements') THEN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS statements (
      id uuid DEFAULT uuid_generate_v4 (),
      user_id uuid NOT NULL,
      transaction_id uuid NOT NULL,

      last_amount NUMERIC(10, 2) NOT NULL,
      current_amount NUMERIC (10, 2) NOT NULL,

      PRIMARY KEY(id)
    );
    INSERT INTO migrations (id) 
    VALUES ('20230706180001_create_table-statements');
  END IF;

END
$do$