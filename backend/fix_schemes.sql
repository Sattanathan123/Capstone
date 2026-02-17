-- Clear and insert schemes that match the user
DELETE FROM schemes;

INSERT INTO schemes (scheme_name, scheme_description, scheme_component, status, min_income, max_income, community, occupation, benefit_type, max_benefit_amount, application_start_date, application_end_date, created_at, updated_at) VALUES
('Universal Scheme 1', 'Test scheme for all', 'SCHOLARSHIP', 'ACTIVE', 0, 500000, 'ALL', 'ALL', 'FINANCIAL', 50000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('OBC Scheme', 'Scheme for OBC', 'SCHOLARSHIP', 'ACTIVE', 0, 500000, 'OBC', 'ALL', 'FINANCIAL', 60000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('Agriculture Scheme', 'For farmers', 'AGRICULTURE', 'ACTIVE', 0, 500000, 'ALL', 'AGIRCULTURE', 'FINANCIAL', 75000, '2024-01-01', '2025-12-31', NOW(), NOW());

SELECT * FROM schemes;
