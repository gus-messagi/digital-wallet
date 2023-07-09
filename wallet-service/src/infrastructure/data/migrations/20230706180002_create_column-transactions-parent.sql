DO
$do$
BEGIN
  IF NOT EXISTS (SELECT id FROM migrations WHERE id='20230706180002_create_column-transactions-parent') THEN
    
    ALTER TABLE transactions ADD parent_transaction_id uuid;

    ALTER TABLE transactions ADD CONSTRAINT fk_parent_transactions FOREIGN KEY (parent_transaction_id) REFERENCES transactions (id);

    INSERT INTO migrations (id) 
    VALUES ('20230706180002_create_column-transactions-parent');
  END IF;

END
$do$