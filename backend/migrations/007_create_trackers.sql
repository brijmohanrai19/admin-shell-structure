-- Trackers Table
CREATE TABLE IF NOT EXISTS trackers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  script_code TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  load_position VARCHAR(50) DEFAULT 'head',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_trackers_scope ON trackers(scope);
CREATE INDEX idx_trackers_is_active ON trackers(is_active);

-- Sample Data
INSERT INTO trackers (name, type, scope, script_code, priority, load_position, is_active) VALUES
('Google Analytics 4', 'GA4', 'Global', '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>', 10, 'head', true),
('Facebook Pixel', 'Meta Pixel', 'Global', '<script>!function(f,b,e,v,n,t,s){...}</script>', 8, 'head', true),
('Custom Tracker', 'Custom', 'Campaign', '<script>console.log("Campaign tracker");</script>', 5, 'body_end', false)
ON CONFLICT DO NOTHING;
