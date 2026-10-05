-- ==============================================================================
-- Seed Data: Initial Portfolio & CMS Data
-- ==============================================================================

-- 1. SEED PROFILE
INSERT INTO public.profiles (
    id,
    name,
    title,
    short_description,
    long_description,
    photo_url,
    email,
    linkedin_url,
    github_url,
    instagram_url,
    twitter_url
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Reynold Andre',
    'Web Developer',
    'A Web Developer and Software Engineering Technology graduate from IPB University, with experience in web application development, a strong interest in Data Engineering, and expertise in ETL concepts, always seeking opportunities to enhance technical skills and contribute to innovative solutions.',
    'A Web Developer and Software Engineering Technology graduate from IPB University, with experience in web application development, a strong interest in Data Engineering, and expertise in ETL concepts. Always passionate about creating performant, beautiful, and secure software applications.',
    '/image/andre.jpg',
    'reynold.dre@gmail.com',
    'https://www.linkedin.com/in/reynoldandre/',
    'https://github.com/rey-andre',
    'https://www.instagram.com/reynold.sgn/',
    'https://twitter.com/rynld_ndr'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    long_description = EXCLUDED.long_description,
    photo_url = EXCLUDED.photo_url,
    email = EXCLUDED.email,
    linkedin_url = EXCLUDED.linkedin_url,
    github_url = EXCLUDED.github_url,
    instagram_url = EXCLUDED.instagram_url,
    twitter_url = EXCLUDED.twitter_url,
    updated_at = now();

-- 2. SEED EDUCATION
INSERT INTO public.education (
    id,
    institution,
    degree,
    field_of_study,
    start_year,
    end_year,
    description,
    logo_url,
    display_order,
    is_visible
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'IPB University',
    'Sarjana Terapan (S.Tr.Kom)',
    'Teknologi Rekayasa Perangkat Lunak',
    '2020',
    '2024',
    'Graduated with GPA 3.80. Focused on Software Engineering, Web Development, and Data Engineering concepts.',
    NULL,
    1,
    true
) ON CONFLICT (id) DO NOTHING;

-- 3. SEED PROJECTS
-- Project 1: Card Profile
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    description,
    technologies,
    project_type,
    project_url,
    repository_url,
    thumbnail_url,
    display_order,
    is_published
) VALUES (
    '00000000-0000-0000-0000-000000000101',
    'Card Profile',
    'card-profile',
    'Card Profile is a component that displays user profile information in card form with interactive network animations.',
    'Card Profile is a component that displays user profile information in card form. This card can be used to display photos, names, and user contact information. This card can also be used to display additional information such as address, telephone number, and user social media.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Canvas'],
    'Web App',
    'https://rey-andre.github.io',
    'https://github.com/rey-andre/rey-andre.github.io',
    '/image/andre.jpg',
    1,
    true
) ON CONFLICT (id) DO NOTHING;

-- Project 2: Employee Self Service Web App
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    description,
    technologies,
    project_type,
    project_url,
    repository_url,
    thumbnail_url,
    display_order,
    is_published
) VALUES (
    '00000000-0000-0000-0000-000000000102',
    'Employee Self Service Web App',
    'employee-self-service-web',
    'A comprehensive web application that allows employees to access personal information, payroll, leave requests, and company documents.',
    'Employee Self Service Web App is a web application that allows employees to access their personal information, such as salaries, leave, and benefits. This application also allows employees to apply for leave, change personal information, and access important documents. This application is designed to improve employee efficiency and productivity.',
    ARRAY['Laravel', 'PHP', 'PostgreSQL', 'JavaScript', 'Bootstrap'],
    'Web App',
    NULL,
    NULL,
    NULL,
    2,
    true
) ON CONFLICT (id) DO NOTHING;

-- Project 3: Employee Self Service Mobile App
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    description,
    technologies,
    project_type,
    project_url,
    repository_url,
    thumbnail_url,
    display_order,
    is_published
) VALUES (
    '00000000-0000-0000-0000-000000000103',
    'Employee Self Service Mobile App',
    'employee-self-service-mobile',
    'Mobile companion application allowing employees to conveniently access services, submit leave, and view announcements anywhere.',
    'Employee Self Service Mobile App is a mobile application that allows employees to access their personal information, such as salaries, leave, and benefits. This application also allows employees to apply for leave, change personal information, and access important documents. This application is designed to improve employee efficiency and productivity.',
    ARRAY['Flutter', 'Dart', 'REST API', 'PostgreSQL'],
    'Mobile App',
    NULL,
    NULL,
    NULL,
    3,
    true
) ON CONFLICT (id) DO NOTHING;

-- Project 4: AML-CFT Web App
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    description,
    technologies,
    project_type,
    project_url,
    repository_url,
    thumbnail_url,
    display_order,
    is_published
) VALUES (
    '00000000-0000-0000-0000-000000000104',
    'Anti Money Laundering and Countering the Financing of Terrorism (AML-CFT) Web App',
    'aml-cft-web-app',
    'Enterprise banking application to detect and report large or suspicious transactions to prevent financial crimes.',
    'AML-CFT is an application used by banks to report all large or suspicious transactions in order to prevent money laundering and distribution of terrorist/crime funds.',
    ARRAY['Laravel', 'PHP', 'PostgreSQL', 'ETL', 'Tailwind CSS'],
    'Web App',
    NULL,
    NULL,
    NULL,
    4,
    true
) ON CONFLICT (id) DO NOTHING;
