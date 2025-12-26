-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  conducting_body VARCHAR(255) NOT NULL,
  application_start_date DATE,
  application_end_date DATE,
  exam_date DATE,
  description TEXT,
  eligibility TEXT,
  exam_pattern TEXT,
  important_links JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  seo JSONB,
  crawl_policy JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exams_slug ON exams(slug);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);

-- Insert sample data
INSERT INTO exams (name, slug, conducting_body, exam_date, description, eligibility, exam_pattern, priority, status) VALUES
('VITEEE 2026', 'viteee-2026', 'VIT University', '2026-04-15', 'VIT Engineering Entrance Examination for B.Tech admissions', 'Minimum 60% in PCM (Physics, Chemistry, Mathematics)', 'Multiple choice questions, 2.5 hours duration', 10, 'live'),
('JEE Main 2026', 'jee-main-2026', 'NTA', '2026-01-20', 'Joint Entrance Examination for engineering colleges across India', 'Class 12 pass or appearing with PCM', 'Computer-based test, 3 hours', 10, 'live'),
('NEET UG 2026', 'neet-ug-2026', 'NTA', '2026-05-05', 'National Eligibility cum Entrance Test for medical courses', 'Class 12 pass with Physics, Chemistry, Biology', 'Pen and paper based, 3 hours', 9, 'draft')
ON CONFLICT (slug) DO NOTHING;
