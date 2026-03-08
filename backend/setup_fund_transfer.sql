-- Setup Fund Transfer Module
USE dbi_database;

-- Add bank details columns to users table (if not exists)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS bank_ifsc_code VARCHAR(11),
ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(100);

-- Check if columns were added
DESCRIBE users;

-- Show existing fund_transfers table (will be auto-created by Hibernate)
SHOW TABLES LIKE 'fund_transfers';
