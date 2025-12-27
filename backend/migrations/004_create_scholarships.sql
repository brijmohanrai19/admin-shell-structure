-- Scholarships Table
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  provider_name VARCHAR(255) NOT NULL,
  provider_type VARCHAR(100) NOT NULL, -- Government, Private, College, NGO
  amount_min DECIMAL(12,2),
  amount_max DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'INR',
  eligibility_criteria TEXT,
  application_process TEXT,
  deadline DATE,
  description TEXT,
  seo JSONB,
  crawl_policy JSONB,
  form_schema_id UUID,
  status VARCHAR(20) DEFAULT 'draft', -- draft, live, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_scholarships_slug ON scholarships(slug);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_provider_type ON scholarships(provider_type);

-- Sample Data
INSERT INTO scholarships (
  name,
  slug,
  provider_name,
  provider_type,
  amount_min,
  amount_max,
  currency,
  eligibility_criteria,
  application_process,
  deadline,
  description,
  status
) VALUES
(
  'National Merit Scholarship 2026',
  'national-merit-scholarship-2026',
  'Ministry of Education',
  'Government',
  50000,
  100000,
  'INR',
  'Students with minimum 85% marks in Class 12. Annual family income should not exceed ₹6 lakhs.',
  'Apply online through the National Scholarship Portal (NSP). Upload required documents including mark sheets, income certificate, and Aadhaar card.',
  '2026-06-30',
  'The National Merit Scholarship is a prestigious scholarship program that provides financial assistance to meritorious students across India.',
  'live'
),
(
  'Merit-cum-Means Scholarship for Professional Courses',
  'merit-cum-means-scholarship',
  'AICTE',
  'Government',
  20000,
  50000,
  'INR',
  'Students enrolled in AICTE approved institutions. Annual family income should not exceed ₹8 lakhs. Minimum 60% marks in qualifying examination.',
  'Apply through AICTE portal. Provide income certificate, admission letter, and previous academic records.',
  '2026-08-15',
  'This scholarship supports students pursuing technical education in AICTE approved colleges.',
  'live'
),
(
  'INSPIRE Scholarship for Higher Education',
  'inspire-scholarship',
  'Department of Science & Technology',
  'Government',
  80000,
  80000,
  'INR',
  'Students securing rank within top 1% in Class 12 board examination. Must pursue B.Sc., B.S., M.Sc., or Integrated M.Sc. in Natural Sciences.',
  'Apply online through INSPIRE portal. Eligible students are automatically identified based on board results.',
  '2026-07-31',
  'The INSPIRE Scholarship aims to attract talent to the study of science at an early age.',
  'live'
);
