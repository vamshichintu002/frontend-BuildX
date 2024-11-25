-- First, drop existing foreign key constraints
ALTER TABLE client_forms DROP CONSTRAINT IF EXISTS client_forms_client_id_fkey;

-- Modify the clients table to use TEXT for user_id (if not already)
ALTER TABLE clients 
  ALTER COLUMN user_id TYPE TEXT;

-- Modify the client_forms table
ALTER TABLE client_forms
  ALTER COLUMN user_id TYPE TEXT,
  ALTER COLUMN client_id TYPE TEXT;

-- Re-add the foreign key constraint
ALTER TABLE client_forms
  ADD CONSTRAINT client_forms_client_id_fkey 
  FOREIGN KEY (client_id) 
  REFERENCES clients(id);

-- Update the clients table to use TEXT for id
ALTER TABLE clients
  ALTER COLUMN id TYPE TEXT;
