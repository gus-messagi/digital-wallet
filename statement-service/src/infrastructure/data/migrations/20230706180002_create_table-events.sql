DO
$do$
BEGIN
  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180002_create_table-events') THEN
    
    CREATE TABLE IF NOT EXISTS events (
      event_id uuid NOT NULL,
      statement_id uuid NOT NULL,

      PRIMARY KEY(event_id),
      CONSTRAINT fk_statements FOREIGN KEY (statement_id) REFERENCES statements(id)
    );
    INSERT INTO migrations (id) 
    VALUES ('20230706180002_create_table-events');
  END IF;

END
$do$