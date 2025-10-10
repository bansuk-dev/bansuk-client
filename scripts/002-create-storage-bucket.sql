-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow anyone to upload photos
CREATE POLICY "Anyone can upload photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'photos');

-- Create policy to allow anyone to view photos
CREATE POLICY "Anyone can view photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');
