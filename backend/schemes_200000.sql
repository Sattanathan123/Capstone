-- Delete existing schemes
DELETE FROM schemes;

-- Insert schemes with income eligibility up to 2,00,000
INSERT INTO schemes (scheme_name, scheme_description, scheme_component, status, min_income, max_income, community, occupation, benefit_type, max_benefit_amount, application_start_date, application_end_date, created_at, updated_at) VALUES
('Post Matric Scholarship', 'Education support for students from low income families', 'SCHOLARSHIP', 'ACTIVE', 0, 200000, 'ALL', 'ALL', 'FINANCIAL', 50000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('Agriculture Support Scheme', 'Financial assistance for farmers with income up to 2 lakhs', 'AGRICULTURE', 'ACTIVE', 0, 200000, 'ALL', 'ALL', 'FINANCIAL', 75000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('OBC Welfare Scheme', 'Development scheme for OBC category with income limit', 'SCHOLARSHIP', 'ACTIVE', 0, 200000, 'OBC', 'ALL', 'FINANCIAL', 60000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('SC/ST Hostel Scheme', 'Hostel facilities for SC/ST students', 'HOSTEL', 'ACTIVE', 0, 200000, 'SC', 'ALL', 'SERVICE', 80000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('Low Income Family Support', 'Support for families with annual income below 2 lakhs', 'SCHOLARSHIP', 'ACTIVE', 0, 200000, 'ALL', 'ALL', 'FINANCIAL', 40000, '2024-01-01', '2025-12-31', NOW(), NOW());