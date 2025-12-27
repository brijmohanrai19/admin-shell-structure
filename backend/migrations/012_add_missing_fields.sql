-- ============================================
-- Migration 012: Add Missing Critical Fields
-- ============================================

-- ============================================
-- EXAMS - Add Missing Critical Fields
-- ============================================

ALTER TABLE exams ADD COLUMN IF NOT EXISTS application_start_date DATE;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS application_end_date DATE;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS result_date DATE;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS counselling_start_date DATE;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS counselling_end_date DATE;

ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_mode VARCHAR(50) DEFAULT 'Online';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_duration INTEGER;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_language TEXT[] DEFAULT '{}';
ALTER TABLE exams ADD COLUMN IF NOT EXISTS total_marks INTEGER;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS negative_marking BOOLEAN DEFAULT false;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_level VARCHAR(50);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS exam_frequency VARCHAR(50);

ALTER TABLE exams ADD COLUMN IF NOT EXISTS application_fee_general INTEGER;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS application_fee_reserved INTEGER;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS late_fee INTEGER;

ALTER TABLE exams ADD COLUMN IF NOT EXISTS official_website VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS application_link VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS syllabus_pdf_url VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS admit_card_link VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS result_link VARCHAR(500);

ALTER TABLE exams ADD COLUMN IF NOT EXISTS syllabus TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS preparation_tips TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS cutoff_trends JSONB DEFAULT '{}';

ALTER TABLE exams ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS thumbnail_image VARCHAR(500);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS brochure_pdf VARCHAR(500);

-- ============================================
-- COLLEGES - Add Missing Critical Fields
-- ============================================

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS campus_area DECIMAL(10, 2);

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS website VARCHAR(500);

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS year_established INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS college_type VARCHAR(50);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS university_affiliation VARCHAR(255);

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS hostel_available BOOLEAN DEFAULT false;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS hostel_fee_range JSONB;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS library_size INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS labs_count INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS sports_facilities TEXT[] DEFAULT '{}';

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS placement_percentage DECIMAL(5, 2);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS average_package INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS highest_package INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS top_recruiters TEXT[] DEFAULT '{}';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS placement_trends JSONB DEFAULT '{}';

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS nirf_rank INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS qs_rank INTEGER;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS other_rankings JSONB DEFAULT '{}';

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS entrance_exams TEXT[] DEFAULT '{}';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS admission_criteria TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS seat_matrix JSONB DEFAULT '{}';

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS virtual_tour_link VARCHAR(500);
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS video_url VARCHAR(500);

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS facilities TEXT;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS alumni_network TEXT;

-- ============================================
-- SCHOLARSHIPS - Add Missing Critical Fields
-- ============================================

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scholarship_type VARCHAR(50);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS level VARCHAR(50);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS number_of_awards INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS renewable BOOLEAN DEFAULT false;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS minimum_marks DECIMAL(5, 2);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS income_limit INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS age_limit INTEGER;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'All';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS category TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS disability_eligible BOOLEAN DEFAULT false;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS announcement_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_start_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_end_date DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS result_date DATE;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS documents_required TEXT[] DEFAULT '{}';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS selection_process TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS how_to_apply TEXT;

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS official_website VARCHAR(500);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS application_link VARCHAR(500);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS guidelines_pdf VARCHAR(500);

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS coverage VARCHAR(100);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS disbursement_schedule VARCHAR(50);

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS banner_image VARCHAR(500);

-- ============================================
-- Create Indexes for New Fields
-- ============================================

CREATE INDEX IF NOT EXISTS idx_exams_exam_level ON exams(exam_level);
CREATE INDEX IF NOT EXISTS idx_exams_exam_date ON exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_colleges_college_type ON colleges(college_type);
CREATE INDEX IF NOT EXISTS idx_colleges_nirf_rank ON colleges(nirf_rank);
CREATE INDEX IF NOT EXISTS idx_scholarships_level ON scholarships(level);
CREATE INDEX IF NOT EXISTS idx_scholarships_scholarship_type ON scholarships(scholarship_type);

-- ============================================
-- Update Sample Data with New Fields
-- ============================================

UPDATE exams SET
  exam_mode = 'Online',
  exam_level = 'National',
  exam_frequency = 'Annual',
  application_fee_general = 1500,
  application_fee_reserved = 750
WHERE name LIKE '%GATE%' OR name LIKE '%CAT%' OR name LIKE '%CLAT%';

UPDATE colleges SET
  college_type = 'Private',
  year_established = 1984,
  hostel_available = true,
  placement_percentage = 95.5,
  average_package = 800000,
  highest_package = 4500000
WHERE name LIKE '%VIT%';

UPDATE colleges SET
  college_type = 'Government',
  nirf_rank = 2
WHERE name LIKE '%IIT%';

UPDATE scholarships SET
  scholarship_type = 'Merit',
  level = 'UG',
  duration = 'Annual',
  renewable = true
WHERE provider_type = 'Government';
