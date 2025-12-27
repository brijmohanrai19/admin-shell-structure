-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  component_definition JSONB NOT NULL,
  sections JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'draft',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, version)
);

-- Indexes
CREATE INDEX idx_templates_slug ON templates(slug);
CREATE INDEX idx_templates_status ON templates(status);

-- Sample Data
INSERT INTO templates (name, slug, version, component_definition, sections, status, usage_count) VALUES
('Hero Banner', 'hero-banner', 1, '{"type":"hero","fields":["headline","subheadline","cta"]}', '["hero","features","cta"]', 'published', 12),
('Feature Grid', 'feature-grid', 1, '{"type":"grid","fields":["title","items"]}', '["header","grid","footer"]', 'published', 8),
('FAQ Section', 'faq-section', 1, '{"type":"accordion","fields":["questions"]}', '["header","faq"]', 'draft', 0)
ON CONFLICT (slug, version) DO NOTHING;
