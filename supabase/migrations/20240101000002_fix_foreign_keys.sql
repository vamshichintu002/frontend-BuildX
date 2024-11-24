-- Update clients table to use clerk_id instead of UUID
ALTER TABLE clients
DROP CONSTRAINT IF EXISTS fk_user,
ALTER COLUMN user_id TYPE TEXT,
ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(clerk_id);

-- Update client_forms table
ALTER TABLE client_forms
DROP COLUMN IF EXISTS user_id;
