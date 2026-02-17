-- Check if applications table exists
SHOW TABLES LIKE 'applications';

-- View all applications
SELECT * FROM applications;

-- Check applications count per user
SELECT user_id, COUNT(*) as application_count FROM applications GROUP BY user_id;
