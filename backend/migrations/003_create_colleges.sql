-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  country VARCHAR(255) DEFAULT 'India',
  courses JSONB DEFAULT '[]',
  fee_range JSONB,
  intake INTEGER,
  approvals TEXT[] DEFAULT '{}',
  description TEXT,
  admission_process TEXT,
  seo JSONB,
  crawl_policy JSONB,
  form_schema_id INTEGER,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_colleges_slug ON colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_status ON colleges(status);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);

-- Insert sample data
INSERT INTO colleges (
  name, slug, city, state, courses, fee_range, intake, approvals,
  description, admission_process, status
) VALUES
(
  'VIT Vellore',
  'vit-vellore',
  'Vellore',
  'Tamil Nadu',
  '[
    {"id": "1", "level": "UG", "name": "B.Tech Computer Science", "specialization": "AI & ML"},
    {"id": "2", "level": "PG", "name": "M.Tech Data Science", "specialization": ""}
  ]'::jsonb,
  '{"min": 150000, "max": 500000, "currency": "INR"}'::jsonb,
  5000,
  ARRAY['AICTE', 'UGC', 'NAAC'],
  'VIT University is a premier private engineering institution offering world-class education.',
  'Admissions based on VITEEE entrance exam scores.',
  'live'
),
(
  'IIT Delhi',
  'iit-delhi',
  'New Delhi',
  'Delhi',
  '[
    {"id": "1", "level": "UG", "name": "B.Tech", "specialization": "Computer Science"},
    {"id": "2", "level": "UG", "name": "B.Tech", "specialization": "Mechanical Engineering"},
    {"id": "3", "level": "PG", "name": "M.Tech", "specialization": "Data Science"}
  ]'::jsonb,
  '{"min": 200000, "max": 400000, "currency": "INR"}'::jsonb,
  8000,
  ARRAY['AICTE', 'UGC', 'NAAC', 'NBA'],
  'IIT Delhi is one of India''s top engineering institutes.',
  'Admissions through JEE Advanced.',
  'live'
),
(
  'BITS Pilani',
  'bits-pilani',
  'Pilani',
  'Rajasthan',
  '[
    {"id": "1", "level": "UG", "name": "B.E.", "specialization": "Computer Science"},
    {"id": "2", "level": "UG", "name": "B.E.", "specialization": "Electronics"}
  ]'::jsonb,
  '{"min": 300000, "max": 600000, "currency": "INR"}'::jsonb,
  3000,
  ARRAY['AICTE', 'UGC'],
  'BITS Pilani is a leading private institute for engineering and sciences.',
  'Direct admission based on BITSAT scores.',
  'draft'
)
ON CONFLICT (slug) DO NOTHING;
