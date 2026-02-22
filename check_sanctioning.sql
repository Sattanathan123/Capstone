-- Check Sanctioning Officer details
SELECT id, full_name, role, assigned_district, assigned_state 
FROM users 
WHERE role = 'SCHEME_SANCTIONING_AUTHORITY';

-- Check APPROVED applications and their beneficiary districts
SELECT a.id, a.status, u.full_name as beneficiary, u.district as beneficiary_district, s.scheme_name
FROM applications a
JOIN users u ON a.user_id = u.id
JOIN schemes s ON a.scheme_id = s.id
WHERE a.status = 'APPROVED';

-- Check all applications with their districts
SELECT a.id, a.status, u.district, u.full_name, s.scheme_name
FROM applications a
JOIN users u ON a.user_id = u.id
JOIN schemes s ON a.scheme_id = s.id
ORDER BY a.status, u.district;
