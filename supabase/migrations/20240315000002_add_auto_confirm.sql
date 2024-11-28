-- Add auto_confirm column to users table
ALTER TABLE users ADD COLUMN auto_confirm BOOLEAN DEFAULT false;

-- Add index for faster lookups
CREATE INDEX idx_users_auto_confirm ON users(auto_confirm) WHERE auto_confirm = true;