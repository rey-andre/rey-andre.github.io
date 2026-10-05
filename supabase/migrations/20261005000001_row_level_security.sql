-- ==============================================================================
-- Migration: Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
CREATE POLICY "Allow public read access on profiles"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Allow authenticated users (admin) full access to profiles
CREATE POLICY "Allow authenticated users all access on profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- 2. EDUCATION RLS
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Public can read visible education entries
CREATE POLICY "Allow public read visible education"
    ON public.education
    FOR SELECT
    USING (is_visible = true OR auth.role() = 'authenticated');

-- Authenticated users (admin) full access to education
CREATE POLICY "Allow authenticated users all access on education"
    ON public.education
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- 3. PROJECTS RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Allow public read published projects"
    ON public.projects
    FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

-- Authenticated users (admin) full access to projects
CREATE POLICY "Allow authenticated users all access on projects"
    ON public.projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- 4. PROJECT IMAGES RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Public can read project images for published projects
CREATE POLICY "Allow public read project images"
    ON public.project_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_images.project_id
            AND (p.is_published = true OR auth.role() = 'authenticated')
        )
    );

-- Authenticated users (admin) full access to project images
CREATE POLICY "Allow authenticated users all access on project_images"
    ON public.project_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ==============================================================================
-- Storage Bucket Policies for 'portfolio-images'
-- ==============================================================================

-- Public can view files in portfolio-images bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to portfolio-images'
    ) THEN
        CREATE POLICY "Public Access to portfolio-images"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'portfolio-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload to portfolio-images'
    ) THEN
        CREATE POLICY "Authenticated users can upload to portfolio-images"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'portfolio-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update portfolio-images'
    ) THEN
        CREATE POLICY "Authenticated users can update portfolio-images"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (bucket_id = 'portfolio-images')
            WITH CHECK (bucket_id = 'portfolio-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete from portfolio-images'
    ) THEN
        CREATE POLICY "Authenticated users can delete from portfolio-images"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (bucket_id = 'portfolio-images');
    END IF;
END $$;
