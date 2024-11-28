-- Update demo provider with specializations
UPDATE users 
SET 
  gender = 'female',
  photo_url = 'https://jipblskzciiiyqahowlp.supabase.co/storage/v1/object/sign/public-assets/photo_2024-11-25_22-24-29.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwdWJsaWMtYXNzZXRzL3Bob3RvXzIwMjQtMTEtMjVfMjItMjQtMjkuanBnIiwiaWF0IjoxNzMyNTY2OTc1LCJleHAiOjIwNDc5MjY5NzV9.W1g1_XiAy5N-JjQWQ1-bgRv0fTPXsYdl6mbogZ-yPMw&t=2024-11-25T20%3A36%3A15.114Z',
  specializations = ARRAY['стилістка', 'перукарка', 'колористка']
WHERE id = '00000000-0000-0000-0000-000000000001';