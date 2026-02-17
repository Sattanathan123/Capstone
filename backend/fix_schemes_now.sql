-- Update all schemes to match any user
UPDATE schemes SET 
    status = 'Active',
    min_income = 0,
    max_income = 1000000,
    community = 'ALL',
    occupation = 'ALL'
WHERE id IN (10, 11, 12);

-- Verify update
SELECT id, scheme_name, status, min_income, max_income, community, occupation FROM schemes;
