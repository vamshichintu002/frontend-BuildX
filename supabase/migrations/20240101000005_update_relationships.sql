-- Update clients table to use clerk_id directly
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

ALTER TABLE clients 
ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE clients
ADD CONSTRAINT fk_user_clerk_id
FOREIGN KEY (user_id) 
REFERENCES users(clerk_id);

-- Update client_forms table to have both user_id and client_id
ALTER TABLE client_forms
ADD COLUMN user_id TEXT;

ALTER TABLE client_forms
ADD CONSTRAINT fk_form_user_clerk_id
FOREIGN KEY (user_id) 
REFERENCES users(clerk_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_client_forms_user_id ON client_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_client_forms_client_id ON client_forms(client_id);

-- Update RLS policies for clients
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;

CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

-- Update RLS policies for client_forms
DROP POLICY IF EXISTS "Users can view their forms" ON client_forms;
DROP POLICY IF EXISTS "Users can insert their forms" ON client_forms;

CREATE POLICY "Users can view their forms"
ON client_forms FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their forms"
ON client_forms FOR INSERT
WITH CHECK (user_id = auth.uid()::text);
