-- Redirects Table
CREATE TABLE IF NOT EXISTS redirects (
  id SERIAL PRIMARY KEY,
  source_path VARCHAR(500) NOT NULL UNIQUE,
  target_path VARCHAR(500) NOT NULL,
  redirect_type VARCHAR(10) DEFAULT '301',
  is_active BOOLEAN DEFAULT true,
  hit_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_redirects_source_path ON redirects(source_path);
CREATE INDEX idx_redirects_is_active ON redirects(is_active);

-- Sample Data
INSERT INTO redirects (source_path, target_path, redirect_type, is_active, hit_count, notes) VALUES
('/old-page', '/new-page', '301', true, 1234, 'Permanent redirect for rebranded page'),
('/exam/jee-2024', '/exam/jee-2025', '301', true, 5678, 'Updated exam year'),
('/temp-landing', '/main-landing', '302', true, 890, 'Temporary redirect for A/B testing'),
('/discontinued', '/alternative', '301', false, 0, 'Inactive redirect')
ON CONFLICT (source_path) DO NOTHING;
