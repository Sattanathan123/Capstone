-- Insert a test scheme that matches your user exactly
INSERT INTO schemes VALUES (
    NULL,  -- id (auto increment)
    '2025-12-31',  -- application_end_date
    '2024-01-01',  -- application_start_date
    'SCHOLARSHIP',  -- scheme_component
    'OBC',  -- community
    '',  -- empty field
    50000,  -- max_benefit_amount
    200000,  -- max_income
    0,  -- min_income
    'ALL',  -- occupation
    1,  -- requires_aadhaar
    1,  -- requires_income_certificate
    1,  -- requires_community_certificate
    0,  -- requires_occupation_proof
    'Test scheme for OBC beneficiaries',  -- scheme_description
    'Financial assistance for OBC category',  -- benefit_type or description
    'OBC Test Scheme',  -- scheme_name
    'Active',  -- status
    NOW(),  -- created_at
    NOW()   -- updated_at
);

SELECT * FROM schemes WHERE scheme_name = 'OBC Test Scheme';
