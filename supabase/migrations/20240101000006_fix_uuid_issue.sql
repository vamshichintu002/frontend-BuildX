-- Drop existing constraints and indexes
ALTER TABLE client_forms DROP CONSTRAINT IF EXISTS client_forms_client_id_fkey;
ALTER TABLE client_forms DROP CONSTRAINT IF EXISTS fk_form_user_clerk_id;
ALTER TABLE clients DROP CONSTRAINT IF EXISTS fk_user_clerk_id;

DROP INDEX IF EXISTS idx_clients_user_id;
DROP INDEX IF EXISTS idx_client_forms_user_id;
DROP INDEX IF EXISTS idx_client_forms_client_id;

-- Recreate clients table
DROP TABLE IF EXISTS clients CASCADE;
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(clerk_id)
);

-- Recreate client_forms table
DROP TABLE IF EXISTS client_forms CASCADE;
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
    financial_goals JSONB NOT NULL DEFAULT '{}'::jsonb,
    risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    monthly_savings BIGINT NOT NULL,
    emergency_cash BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(clerk_id)
);

-- Create indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_client_forms_user_id ON client_forms(user_id);
CREATE INDEX idx_client_forms_client_id ON client_forms(client_id);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (user_id = auth.uid()::text);

-- Create RLS policies for client_forms
CREATE POLICY "Users can view their forms"
ON client_forms FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their forms"
ON client_forms FOR INSERT
WITH CHECK (user_id = auth.uid()::text);
