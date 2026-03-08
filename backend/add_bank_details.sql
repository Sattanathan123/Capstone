-- Add bank details columns to users table
ALTER TABLE users 
ADD COLUMN bank_account_number VARCHAR(20),
ADD COLUMN bank_ifsc_code VARCHAR(11),
ADD COLUMN bank_name VARCHAR(100),
ADD COLUMN account_holder_name VARCHAR(100);

-- Create index for faster lookups
CREATE INDEX idx_users_bank_account ON users(bank_account_number);
