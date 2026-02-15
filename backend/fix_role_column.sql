-- Fix the role column size issue
-- IMPORTANT: Run this SQL script in MySQL BEFORE restarting the backend

USE dbi_database;

-- Step 1: Check current column size
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbi_database' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'role';

-- Step 2: Increase the role column size to accommodate long role names
-- This will allow roles like SCHEME_SANCTIONING_AUTHORITY (29 chars)
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;

-- Step 3: Verify the change
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbi_database' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'role';

-- You should see CHARACTER_MAXIMUM_LENGTH = 50 now
