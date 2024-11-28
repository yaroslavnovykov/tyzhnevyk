-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON users;

-- Create new policies
CREATE POLICY "Users can insert their profile" 
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own profile" 
  ON users FOR DELETE
  USING (auth.uid() = id);