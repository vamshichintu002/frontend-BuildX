-- Drop and recreate client_forms table with correct structure
DROP TABLE IF EXISTS client_forms;

CREATE TABLE client_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(clerk_id),
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

-- Create indexes for better performance
CREATE INDEX idx_client_forms_client_id ON client_forms(client_id);
CREATE INDEX idx_client_forms_user_id ON client_forms(user_id);

-- Enable RLS
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own forms"
ON client_forms FOR SELECT
USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own forms"
ON client_forms FOR INSERT
WITH CHECK (user_id = auth.uid()::text);
