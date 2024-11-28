-- Drop existing working_hours table
DROP TABLE working_hours;

-- Create new working_hours table with slots support
CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES users(id),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
  slots JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_working BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (provider_id, day_of_week)
);

-- Create index for faster lookups
CREATE INDEX idx_working_hours_provider ON working_hours(provider_id);

-- Insert default working hours for demo provider
INSERT INTO working_hours (provider_id, day_of_week, slots, is_working) VALUES
  ('00000000-0000-0000-0000-000000000001', 1, '[{"start": "09:00", "end": "19:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 2, '[{"start": "09:00", "end": "19:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 3, '[{"start": "09:00", "end": "19:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 4, '[{"start": "09:00", "end": "19:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 5, '[{"start": "09:00", "end": "19:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 6, '[{"start": "10:00", "end": "18:00"}]', true),
  ('00000000-0000-0000-0000-000000000001', 7, '[{"start": "10:00", "end": "18:00"}]', false);