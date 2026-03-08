-- Create chat_logs table for storing chatbot interactions
CREATE TABLE IF NOT EXISTS chat_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_message VARCHAR(1000),
    bot_response VARCHAR(2000),
    intent VARCHAR(50),
    session_id VARCHAR(100),
    timestamp DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Add foreign key constraint if users table exists
ALTER TABLE chat_logs 
ADD CONSTRAINT fk_chat_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
