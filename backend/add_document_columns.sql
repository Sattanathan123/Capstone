-- Check if document columns exist
SHOW COLUMNS FROM applications LIKE '%doc%';

-- Add document columns if they don't exist
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS aadhaar_doc LONGTEXT,
ADD COLUMN IF NOT EXISTS income_cert_doc LONGTEXT,
ADD COLUMN IF NOT EXISTS community_cert_doc LONGTEXT,
ADD COLUMN IF NOT EXISTS occupation_proof_doc LONGTEXT;

-- Verify columns added
DESCRIBE applications;
