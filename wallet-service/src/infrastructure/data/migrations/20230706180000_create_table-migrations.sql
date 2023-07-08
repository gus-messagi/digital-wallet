CREATE TABLE IF NOT EXISTS migrations(
  id VARCHAR(255) NOT NULL
);

DO
$do$
BEGIN

  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180000_create_table-migrations') THEN
    INSERT INTO migrations (id) 
    VALUES ('20230706180000_create_table-migrations');
  END IF;

END
$do$
