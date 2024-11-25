-- First, grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant necessary table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON client_forms TO anon, authenticated;

-- Grant sequence permissions (needed for ID generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Since RLS is disabled, we don't need policies, but we do need basic permissions
-- Grant permissions on specific tables
GRANT ALL PRIVILEGES ON TABLE clients TO authenticated;
GRANT ALL PRIVILEGES ON TABLE client_forms TO authenticated;

-- Grant minimal permissions to anon
GRANT SELECT ON TABLE clients TO anon;
GRANT SELECT ON TABLE client_forms TO anon;

-- Verify that RLS is disabled (as per your requirement)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;
