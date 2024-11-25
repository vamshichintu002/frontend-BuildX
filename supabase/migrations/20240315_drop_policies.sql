-- Drop all RLS policies from clients table
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

-- Drop all RLS policies from client_forms table
DROP POLICY IF EXISTS "Users can view their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can insert their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can update their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can delete their own forms" ON client_forms;

-- Disable RLS on tables
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;
