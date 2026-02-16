-- Insert sample schemes for testing
INSERT INTO schemes (scheme_name, scheme_description, scheme_component, status, min_income, max_income, community, occupation, benefit_type, max_benefit_amount, application_start_date, application_end_date, created_at, updated_at) VALUES
('Post Matric Scholarship for SC Students', 'Financial assistance for SC students pursuing post-matriculation studies', 'SCHOLARSHIP', 'ACTIVE', 0, 250000, 'SC', 'ALL', 'FINANCIAL', 50000, '2024-01-01', '2024-12-31', NOW(), NOW()),
('Pre Matric Scholarship for ST Students', 'Financial support for ST students in pre-matric classes', 'SCHOLARSHIP', 'ACTIVE', 0, 200000, 'ST', 'ALL', 'FINANCIAL', 30000, '2024-01-01', '2024-12-31', NOW(), NOW()),
('OBC Scholarship Scheme', 'Educational scholarship for OBC category students', 'SCHOLARSHIP', 'ACTIVE', 0, 300000, 'OBC', 'ALL', 'FINANCIAL', 40000, '2024-01-01', '2024-12-31', NOW(), NOW()),
('Agriculture Support Scheme', 'Financial assistance for farmers and agricultural workers', 'AGRICULTURE', 'ACTIVE', 0, 500000, 'ALL', 'AGRICULTURE', 'FINANCIAL', 100000, '2024-01-01', '2024-12-31', NOW(), NOW()),
('SC/ST Hostel Scheme', 'Hostel facilities for SC/ST students', 'HOSTEL', 'ACTIVE', 0, 200000, 'SC', 'ALL', 'SERVICE', 75000, '2024-01-01', '2024-12-31', NOW(), NOW()),
('Adarsh Gram Yojana', 'Village development scheme for SC/ST communities', 'ADARSH_GRAM', 'ACTIVE', 0, 150000, 'SC', 'ALL', 'INFRASTRUCTURE', 200000, '2024-01-01', '2024-12-31', NOW(), NOW());
