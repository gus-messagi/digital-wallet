DO
$do$
BEGIN
  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180003_create_table-events') THEN
    
    CREATE TABLE IF NOT EXISTS events (
      event_id uuid NOT NULL,
      transaction_id uuid NOT NULL,

      PRIMARY KEY(event_id),
      CONSTRAINT fk_transactions FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    );
    INSERT INTO migrations (id) 
    VALUES ('20230706180003_create_table-events');
  END IF;

END
$do$