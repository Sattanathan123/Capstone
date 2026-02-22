-- Check for applications with invalid scheme_id
SELECT id, application_id, user_id, scheme_id, status, applied_date 
FROM applications 
WHERE scheme_id IS NULL OR scheme_id = 0 OR scheme_id NOT IN (SELECT id FROM schemes);

-- If you find any, you can either:
-- Option 1: Delete them
-- DELETE FROM applications WHERE scheme_id IS NULL OR scheme_id = 0 OR scheme_id NOT IN (SELECT id FROM schemes);

-- Option 2: Update them to a valid scheme (replace 1 with an actual scheme ID from your schemes table)
-- UPDATE applications SET scheme_id = 1 WHERE scheme_id IS NULL OR scheme_id = 0;
