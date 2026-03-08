-- View all users to identify which ones to delete
SELECT id, full_name, email, mobile_number, role, created_at FROM users ORDER BY created_at DESC;

-- Delete specific user by ID (replace USER_ID with actual ID)
-- Step 1: Delete application_timeline first
-- DELETE FROM application_timeline WHERE application_id IN (SELECT id FROM applications WHERE user_id = USER_ID);
-- Step 2: Delete notifications
-- DELETE FROM notifications WHERE user_id = USER_ID;
-- Step 3: Delete applications
-- DELETE FROM applications WHERE user_id = USER_ID;
-- Step 4: Delete user
-- DELETE FROM users WHERE id = USER_ID;

-- Delete multiple users by IDs
-- DELETE FROM application_timeline WHERE application_id IN (SELECT id FROM applications WHERE user_id IN (1, 2, 3, 4, 5));
-- DELETE FROM notifications WHERE user_id IN (1, 2, 3, 4, 5);
-- DELETE FROM applications WHERE user_id IN (1, 2, 3, 4, 5);
-- DELETE FROM users WHERE id IN (1, 2, 3, 4, 5);

-- Delete all BENEFICIARY users (keep only officers/admins)
-- DELETE FROM application_timeline WHERE application_id IN (SELECT id FROM applications WHERE user_id IN (SELECT id FROM users WHERE role = 'BENEFICIARY'));
-- DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE role = 'BENEFICIARY');
-- DELETE FROM applications WHERE user_id IN (SELECT id FROM users WHERE role = 'BENEFICIARY');
-- DELETE FROM users WHERE role = 'BENEFICIARY';

-- Check remaining users
SELECT COUNT(*) as total_users, role FROM users GROUP BY role;
