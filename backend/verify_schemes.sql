-- Check schemes table structure
DESCRIBE schemes;

-- View all schemes
SELECT id, scheme_name, status, min_income, max_income, community, occupation FROM schemes;

-- Count active schemes
SELECT COUNT(*) as active_schemes FROM schemes WHERE status = 'ACTIVE';
