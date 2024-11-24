-- Check users table content
SELECT * FROM users;

-- Check current authenticated user
SELECT auth.uid() as current_auth_id;

-- For debugging, let's temporarily disable RLS to see if the insert works
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Create simpler policies that just check the user_id directly
DROP POLICY IF EXISTS "Users can view their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can insert their own forms" ON client_forms;

CREATE POLICY "Users can view their own forms"
ON client_forms FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own forms"
ON client_forms FOR INSERT
WITH CHECK (true);

-- Same for clients table
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;

CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (true);
