-- Form Schemas Table
CREATE TABLE IF NOT EXISTS form_schemas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  fields JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  usage_count INTEGER DEFAULT 0,
  is_system_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, version)
);

-- Indexes
CREATE INDEX idx_form_schemas_slug ON form_schemas(slug);
CREATE INDEX idx_form_schemas_status ON form_schemas(status);

-- Sample Data
INSERT INTO form_schemas (name, slug, version, fields, status, usage_count, is_system_default) VALUES
('Basic Contact', 'basic-contact', 1, '[{"id":"1","type":"text","label":"Name","required":true},{"id":"2","type":"email","label":"Email","required":true},{"id":"3","type":"phone","label":"Phone","required":true}]', 'published', 15, true),
('Admission Form', 'admission-form', 1, '[{"id":"1","type":"text","label":"Full Name","required":true},{"id":"2","type":"email","label":"Email","required":true},{"id":"3","type":"select","label":"Course","options":["UG","PG"],"required":true}]', 'published', 8, false),
('Scholarship Application', 'scholarship-app', 1, '[{"id":"1","type":"text","label":"Applicant Name","required":true},{"id":"2","type":"number","label":"Annual Income","required":true}]', 'draft', 0, false)
ON CONFLICT (slug, version) DO NOTHING;
