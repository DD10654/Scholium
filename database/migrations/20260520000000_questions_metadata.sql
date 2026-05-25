-- Create questions_metadata table for Past Papers IGCSE question indexing
-- Stores metadata for individual questions from IGCSE Math papers

CREATE TABLE IF NOT EXISTS questions_metadata (
  -- Question identifier (e.g., P2-Q001, P4-Q955)
  id VARCHAR(10) PRIMARY KEY,

  -- Paper source (e.g., June-2016-2, November-2020-3)
  paper VARCHAR(20) NOT NULL,

  -- Question number within the paper (1-30)
  question_number INTEGER NOT NULL,

  -- Chapter name (e.g., Number, Algebra, Trigonometry)
  chapter_name VARCHAR(50) NOT NULL,

  -- Chapter numeric ID for grouping (1-24)
  chapter_num INTEGER NOT NULL,

  -- Sub-topic/skill being tested
  sub_topic TEXT NOT NULL,

  -- Y-coordinates in PDF for question image extraction
  y_start FLOAT NOT NULL,
  y_end FLOAT NOT NULL,

  -- Y-coordinates in PDF for mark scheme extraction
  ms_y_start FLOAT,
  ms_y_end FLOAT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions_metadata(chapter_num);
CREATE INDEX IF NOT EXISTS idx_questions_chapter_paper ON questions_metadata(chapter_num, paper);
CREATE INDEX IF NOT EXISTS idx_questions_paper ON questions_metadata(paper);

-- Enable Row Level Security
ALTER TABLE questions_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view questions)
CREATE POLICY "Enable read access for all users" ON questions_metadata
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON questions_metadata TO anon, authenticated;
