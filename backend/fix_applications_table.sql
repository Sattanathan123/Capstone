-- Fix applications table column name
USE dbi_database;

-- Check if column exists
SHOW COLUMNS FROM applications LIKE '%date%';

-- Rename column from application_date to applied_date
ALTER TABLE applications CHANGE COLUMN application_date applied_date DATETIME NOT NULL;

-- Verify the change
DESCRIBE applications;
