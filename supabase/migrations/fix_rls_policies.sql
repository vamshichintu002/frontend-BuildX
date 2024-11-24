-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can insert their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can update their own forms" ON client_forms;
DROP POLICY IF EXISTS "Users can delete their own forms" ON client_forms;

-- Create new policies using auth.jwt() to get clerk_id
CREATE POLICY "Users can view their own forms"
ON client_forms FOR SELECT
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can insert their own forms"
ON client_forms FOR INSERT
WITH CHECK (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can update their own forms"
ON client_forms FOR UPDATE
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
)
WITH CHECK (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can delete their own forms"
ON client_forms FOR DELETE
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

-- Also fix clients table policies
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;

CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can update their own clients"
ON clients FOR UPDATE
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
)
WITH CHECK (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);

CREATE POLICY "Users can delete their own clients"
ON clients FOR DELETE
USING (
  user_id = (SELECT clerk_id FROM users WHERE id::text = auth.uid()::text)
);
