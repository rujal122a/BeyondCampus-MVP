-- Run this in your Supabase SQL editor to align the schema with the app.

-- =========================
-- 1. PROFILES ROLE MIGRATION
-- =========================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text;

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

DO $$
DECLARE
  constraint_record record;
BEGIN
  FOR constraint_record IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%role%'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I',
      constraint_record.conname
    );
  END LOOP;
END $$;

ALTER TABLE public.profiles
ALTER COLUMN role TYPE text
USING role::text;

UPDATE public.profiles
SET role = CASE
  WHEN role = 'lister' THEN 'property_owner'
  WHEN role = 'both' THEN 'property_owner'
  ELSE role
END
WHERE role IN ('lister', 'both');

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IS NULL OR role IN ('seeker', 'property_owner', 'mess_owner'));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can read all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- =========================
-- 2. LISTINGS SCHEMA MIGRATION
-- =========================

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS lister_id uuid,
ADD COLUMN IF NOT EXISTS rent_price integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS distance_from_campus text,
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS house_rules text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS coordinates jsonb;

UPDATE public.listings
SET distance_from_campus = distance_to_campus
WHERE distance_from_campus IS NULL
  AND distance_to_campus IS NOT NULL;

UPDATE public.listings
SET image_urls = images
WHERE (image_urls IS NULL OR cardinality(image_urls) = 0)
  AND images IS NOT NULL;

UPDATE public.listings
SET is_active = NOT COALESCE(is_locked, false)
WHERE is_active IS NULL;

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active listings" ON public.listings;
DROP POLICY IF EXISTS "Lister can CRUD own listings" ON public.listings;

CREATE POLICY "Anyone can read active listings"
ON public.listings FOR SELECT
USING (is_active = true);

CREATE POLICY "Lister can CRUD own listings"
ON public.listings FOR ALL
USING (auth.uid() = lister_id)
WITH CHECK (auth.uid() = lister_id);

-- =========================
-- 3. MESS SERVICES SUPPORT
-- =========================

ALTER TABLE public.mess_services
ADD COLUMN IF NOT EXISTS vendor_id uuid,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS delivery_time text,
ADD COLUMN IF NOT EXISTS today_menu text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS coordinates jsonb;

ALTER TABLE public.mess_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read mess services" ON public.mess_services;
DROP POLICY IF EXISTS "Mess owner can CRUD own services" ON public.mess_services;

CREATE POLICY "Anyone can read mess services"
ON public.mess_services FOR SELECT
USING (true);

CREATE POLICY "Mess owner can CRUD own services"
ON public.mess_services FOR ALL
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

-- =========================
-- 4. STORAGE BUCKETS
-- =========================

INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- 5. STORAGE POLICIES
-- =========================

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-images'
  AND auth.uid() = owner
);

CREATE POLICY "Public Access Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid() = owner
);
