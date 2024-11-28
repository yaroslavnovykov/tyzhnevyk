-- Create specializations table if it doesn't exist
CREATE TABLE IF NOT EXISTS specializations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_male TEXT NOT NULL,
  name_female TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_specializations_names 
  ON specializations (name_male, name_female);

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

-- Enable RLS
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view specializations"
  ON specializations FOR SELECT
  TO authenticated
  USING (true);