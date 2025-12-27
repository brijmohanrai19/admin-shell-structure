-- Add priority to colleges
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Add priority to scholarships  
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- DON'T add to exams - already exists!

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_colleges_priority ON colleges(priority);
CREATE INDEX IF NOT EXISTS idx_scholarships_priority ON scholarships(priority);
CREATE INDEX IF NOT EXISTS idx_exams_priority ON exams(priority);

-- Update sample data
UPDATE colleges SET priority = 10 WHERE name LIKE '%VIT Vellore%';
UPDATE colleges SET priority = 8 WHERE name LIKE '%IIT%';
UPDATE exams SET priority = 10 WHERE name LIKE '%JEE%' OR name LIKE '%NEET%';
UPDATE scholarships SET priority = 8 WHERE provider_type = 'Government';