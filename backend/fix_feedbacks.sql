USE dbi_database;

-- Add columns one by one without IF NOT EXISTS
ALTER TABLE feedbacks ADD COLUMN amount_spent_on VARCHAR(500);
ALTER TABLE feedbacks ADD COLUMN benefit_received VARCHAR(500);
ALTER TABLE feedbacks ADD COLUMN would_recommend TINYINT(1);
ALTER TABLE feedbacks ADD COLUMN suggestions VARCHAR(500);

-- Delete old feedbacks
DELETE FROM feedbacks;

-- Verify
DESCRIBE feedbacks;
