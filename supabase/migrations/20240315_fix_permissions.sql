-- Enable RLS on tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own clients"
ON clients FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own clients"
ON clients FOR DELETE
USING (user_id = auth.uid()::text);

-- Create RLS policies for client_forms table
CREATE POLICY "Users can view their own forms"
ON client_forms FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own forms"
ON client_forms FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own forms"
ON client_forms FOR UPDATE
USING (user_id = auth.uid()::text)
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own forms"
ON client_forms FOR DELETE
USING (user_id = auth.uid()::text);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;
