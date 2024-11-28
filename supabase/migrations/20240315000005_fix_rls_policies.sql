-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their profile" ON users;

-- Create new policies that handle both auth.uid() and demo provider
CREATE POLICY "Users can view their own profile" ON users FOR SELECT
  USING (
    auth.uid() = id 
    OR id = '00000000-0000-0000-0000-000000000001' -- Allow viewing demo provider
  );

CREATE POLICY "Users can update their own profile" ON users FOR UPDATE
  USING (
    auth.uid() = id 
    OR id = '00000000-0000-0000-0000-000000000001' -- Allow updating demo provider
  )
  WITH CHECK (
    auth.uid() = id 
    OR id = '00000000-0000-0000-0000-000000000001' -- Allow updating demo provider
  );

CREATE POLICY "Users can insert their profile" ON users FOR INSERT
  WITH CHECK (
    auth.uid() = id 
    OR id = '00000000-0000-0000-0000-000000000001' -- Allow inserting demo provider
  );