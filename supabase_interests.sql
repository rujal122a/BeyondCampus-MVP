-- Execute this script in your Supabase SQL Editor to enable the "I'm Interested" feature.

CREATE TABLE IF NOT EXISTS public.listing_interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(listing_id, user_id)
);

ALTER TABLE public.listing_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read interests" ON public.listing_interests;
DROP POLICY IF EXISTS "Authenticated users can insert interests" ON public.listing_interests;
DROP POLICY IF EXISTS "Users can delete own interests" ON public.listing_interests;

CREATE POLICY "Anyone can read interests"
ON public.listing_interests FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert interests"
ON public.listing_interests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests"
ON public.listing_interests FOR DELETE
USING (auth.uid() = user_id);
