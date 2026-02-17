-- Update scheme 11 to match OBC user with 100000 income
UPDATE schemes SET 
    community = 'OBC',
    occupation = 'ALL',
    min_income = 50000,
    max_income = 200000
WHERE id = 11;

-- Update scheme 10 to be for ALL
UPDATE schemes SET 
    community = 'ALL',
    occupation = 'ALL',
    min_income = 50000,
    max_income = 200000
WHERE id = 10;

-- Check updated schemes
SELECT id, scheme_name, status, min_income, max_income, community, occupation FROM schemes WHERE id IN (10, 11);
