-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- NOTE: Run "npm run hash-password" first to get the hash
-- Then replace HASH_PLACEHOLDER below with the actual hash

-- Insert default admin (password: admin123)
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  '$2b$10$1TXOynYrjflmN.jKhDA0o.sBk82NvOEHKOX.AfdEQ4QYrntistfne',
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;
