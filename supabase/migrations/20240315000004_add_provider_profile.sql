-- Add new columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female')),
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS specializations text[] DEFAULT '{}';

-- Create specializations lookup table
CREATE TABLE IF NOT EXISTS specializations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_male text NOT NULL,
  name_female text NOT NULL,
  created_at timestamp with time zone DEFAULT TIMEZONE('utc', now())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_specializations_names ON specializations (name_male, name_female);

-- Insert default specializations
INSERT INTO specializations (name_male, name_female) VALUES
  ('стиліст', 'стилістка'),
  ('перукар', 'перукарка'),
  ('колорист', 'колористка'),
  ('барбер', 'барберка'),
  ('візажист', 'візажистка'),
  ('майстер манікюру', 'майстриня манікюру'),
  ('майстер педикюру', 'майстриня педикюру'),
  ('масажист', 'масажистка'),
  ('косметолог', 'косметологиня')
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view specializations" ON specializations
  FOR SELECT TO authenticated USING (true);

-- Update demo provider
UPDATE users 
SET 
  gender = 'female',
  photo_url = 'https://jipblskzciiiyqahowlp.supabase.co/storage/v1/object/sign/public-assets/photo_2024-11-25_22-24-29.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMtYXNzZXRzL3Bob3RvXzIwMjQtMTEtMjVfMjItMjQtMjkuanBnIiwiaWF0IjoxNzMyNTY2OTc1LCJleHAiOjIwNDc5MjY5NzV9.W1g1_XiAy5N-JjQWQ1-bgRv0fTPXsYdl6mbogZ-yPMw&t=2024-11-25T20%3A36%3A15.114Z',
  specializations = ARRAY['стилістка', 'перукарка', 'колористка']
WHERE id = '00000000-0000-0000-0000-000000000001';