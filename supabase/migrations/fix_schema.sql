-- Drop existing tables and start fresh
DROP TABLE IF EXISTS client_forms CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Recreate clients table
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Recreate client_forms table
CREATE TABLE client_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    age INTEGER NOT NULL,
    occupation TEXT NOT NULL,
    monthly_salary BIGINT NOT NULL,
    monthly_side_income BIGINT NOT NULL,
    monthly_other_income BIGINT NOT NULL,
    monthly_bills BIGINT NOT NULL,
    monthly_daily_life BIGINT NOT NULL,
    monthly_entertainment BIGINT NOT NULL,
    financial_goals JSONB DEFAULT '{}'::jsonb,
    risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    monthly_savings BIGINT NOT NULL,
    emergency_cash BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_client_forms_client_id ON client_forms(client_id);
CREATE INDEX idx_client_forms_user_id ON client_forms(user_id);

-- Disable RLS temporarily for testing
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON clients TO anon, authenticated;
GRANT ALL ON client_forms TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
