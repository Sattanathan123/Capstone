-- Check all schemes
SELECT id, scheme_name, status FROM schemes;

-- Check all applications with their scheme info
SELECT 
    a.id, 
    a.application_id, 
    a.scheme_id,
    s.scheme_name,
    a.status,
    u.full_name as beneficiary_name,
    u.district
FROM applications a
LEFT JOIN schemes s ON a.scheme_id = s.id
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.id DESC;
