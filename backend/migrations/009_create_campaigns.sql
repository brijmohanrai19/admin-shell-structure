-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  url_prefix VARCHAR(50) DEFAULT 'ad',
  entity_type VARCHAR(50),
  entity_id INTEGER,
  template_id INTEGER,
  template_version INTEGER,
  content_data JSONB DEFAULT '{}',
  seo JSONB,
  crawl_policy JSONB,
  form_schema_id INTEGER,
  trackers JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_entity ON campaigns(entity_type, entity_id);

-- Sample Data
INSERT INTO campaigns (
  name, slug, url_prefix, entity_type, entity_id, template_id,
  template_version, content_data, status
) VALUES
(
  'VITEEE 2026 Admission Campaign',
  'viteee-2026-admissions',
  'ad',
  'exam',
  1,
  1,
  1,
  '{"headline":"Apply for VITEEE 2026","subheadline":"Admissions Open","cta":"Apply Now"}',
  'live'
),
(
  'VIT Vellore Engineering Programs',
  'vit-engineering-programs',
  'lp',
  'college',
  1,
  2,
  1,
  '{"title":"Top Engineering College","features":["NAAC A++","100% Placement","World-class Faculty"]}',
  'live'
),
(
  'Merit Scholarship Campaign',
  'merit-scholarship-2026',
  'cmp',
  'scholarship',
  1,
  1,
  1,
  '{"headline":"Get Up to 50K Scholarship","cta":"Apply Now"}',
  'draft'
)
ON CONFLICT (slug) DO NOTHING;
