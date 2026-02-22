-- Delete applications with invalid scheme_id
DELETE FROM applications 
WHERE scheme_id IS NULL OR scheme_id = 0 OR scheme_id NOT IN (SELECT id FROM schemes);

-- Show remaining applications
SELECT COUNT(*) as total_applications FROM applications;
