-- Delete existing schemes first
DELETE FROM schemes;

-- Insert dummy schemes that match ALL criteria
INSERT INTO schemes (scheme_name, scheme_description, scheme_component, status, min_income, max_income, community, occupation, benefit_type, max_benefit_amount, application_start_date, application_end_date, created_at, updated_at) VALUES
('Universal Education Scheme', 'Education support for all communities', 'SCHOLARSHIP', 'ACTIVE', 0, 10000000, 'ALL', 'ALL', 'FINANCIAL', 50000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('Farmer Welfare Scheme', 'Support for agricultural workers', 'AGRICULTURE', 'ACTIVE', 0, 10000000, 'ALL', 'ALL', 'FINANCIAL', 75000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('OBC Development Scheme', 'Development scheme for OBC category', 'SCHOLARSHIP', 'ACTIVE', 0, 10000000, 'OBC', 'ALL', 'FINANCIAL', 60000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('SC/ST Empowerment Scheme', 'Empowerment for SC/ST communities', 'HOSTEL', 'ACTIVE', 0, 10000000, 'SC', 'ALL', 'SERVICE', 80000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('General Category Scheme', 'Support for general category', 'SCHOLARSHIP', 'ACTIVE', 0, 10000000, 'GENERAL', 'ALL', 'FINANCIAL', 40000, '2024-01-01', '2025-12-31', NOW(), NOW());
