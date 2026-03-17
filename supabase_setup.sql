-- Run this in your Supabase SQL Editor to fix the schema and storage issues!

-- 1. Add missing columns to the listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS distance_to_campus text,
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS house_rules text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS coordinates jsonb;

-- 2. Create the Storage Bucket for listing-images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Row Level Security (RLS) for the bucket so users can upload
-- Allow public access to read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'listing-images' 
    AND auth.uid() = owner
);

-- 4. Do the same for avatars bucket just to be safe!
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
