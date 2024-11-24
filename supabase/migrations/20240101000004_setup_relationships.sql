-- First, let's make sure the users table has the right structure
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Now, let's modify the clients table to properly reference users
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

ALTER TABLE clients
DROP COLUMN IF EXISTS user_id;

ALTER TABLE clients
ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_id = auth.uid()::text
));

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_id = auth.uid()::text
));
