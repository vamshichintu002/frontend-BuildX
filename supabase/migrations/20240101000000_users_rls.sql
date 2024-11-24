-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (clerk_id = auth.uid()::text);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (clerk_id = auth.uid()::text)
WITH CHECK (clerk_id = auth.uid()::text);

-- Allow new user creation (needed for Clerk sync)
CREATE POLICY "Allow insert for new users"
ON users FOR INSERT
WITH CHECK (clerk_id = auth.uid()::text);

-- Create an index on clerk_id for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
