-- Temporarily disable RLS on all tables for testing
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant all privileges to authenticated users
GRANT ALL ON clients TO authenticated;
GRANT ALL ON client_forms TO authenticated;
GRANT ALL ON users TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
