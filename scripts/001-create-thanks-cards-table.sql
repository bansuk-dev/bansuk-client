-- Create thanks_cards table
CREATE TABLE IF NOT EXISTS thanks_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  title VARCHAR(50) NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_thanks_cards_created_at ON thanks_cards(created_at DESC);

-- Enable Row Level Security
ALTER TABLE thanks_cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read thanks cards
CREATE POLICY "Anyone can view thanks cards"
  ON thanks_cards
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert thanks cards
CREATE POLICY "Anyone can create thanks cards"
  ON thanks_cards
  FOR INSERT
  WITH CHECK (true);
