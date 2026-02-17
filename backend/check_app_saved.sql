-- Check if application was saved
SELECT a.id, a.user_id, a.scheme_id, s.scheme_name, a.status, a.applied_date 
FROM applications a 
JOIN schemes s ON a.scheme_id = s.id;

-- If empty, manually insert test application
-- INSERT INTO applications (user_id, scheme_id, status, applied_date) VALUES (1, 10, 'SUBMITTED', NOW());
