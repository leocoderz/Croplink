-- Create SMS logs table to track SMS notifications
CREATE TABLE IF NOT EXISTS sms_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- welcome, login_alert, password_reset, etc.
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
  message_id VARCHAR(255),
  cost DECIMAL(10, 4) DEFAULT 0,
  provider VARCHAR(50) DEFAULT 'mock',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sms_logs_user_id ON sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON sms_logs(phone);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_type ON sms_logs(type);
