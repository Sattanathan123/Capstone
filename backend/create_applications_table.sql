-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATETIME NOT NULL,
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id)
);

-- Check if table was created
SHOW TABLES LIKE 'applications';
