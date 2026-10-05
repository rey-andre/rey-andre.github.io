# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Reynold Andre – Personal Portfolio & CMS

**Version:** 2.0
**Status:** Development Planning
**Target Developer:** AI Agent – Google Antigravity IDE
**Frontend:** Next.js + TypeScript
**Backend / Database:** Supabase
**Authentication:** Supabase Auth
**Storage:** Supabase Storage
**Hosting:** Vercel
**Source Code:** GitHub – `rey-andre/rey-andre.github.io`

---

# 1. Project Overview

Project ini merupakan pengembangan dari website profile card milik Reynold Andre yang saat ini masih berupa website statis menggunakan HTML, CSS, dan JavaScript.

Repository saat ini:

[rey-andre/rey-andre.github.io di GitHub](https://github.com/rey-andre/rey-andre.github.io?utm_source=chatgpt.com)

Website existing memiliki konsep profile card dengan tema dark/purple/pink dan menampilkan:

* Foto profil
* Nama
* Jabatan/profesi
* Deskripsi singkat
* Email
* Social media
* Button Portfolio

Saat ini button **Portfolio** hanya menampilkan modal berisi data project dalam format JSON/text.

Pengembangan berikutnya akan mengubah website menjadi personal portfolio yang lebih lengkap dan dinamis.

Website akan memiliki dua area utama:

1. **Public Portfolio**
2. **Admin CMS**

Data portfolio akan disimpan di Supabase sehingga konten dapat dikelola melalui CMS tanpa perlu mengubah source code secara manual.

Deployment production akan menggunakan **Vercel** yang terhubung dengan repository GitHub.

---

# 2. Objective

Tujuan utama pengembangan:

1. Mengubah website profile card menjadi personal portfolio profesional.
2. Mempertahankan identitas visual dari website existing.
3. Membuat halaman Portfolio yang lebih informatif.
4. Menampilkan informasi pendidikan dan pengalaman/project.
5. Mendukung project dengan lebih dari satu gambar menggunakan carousel.
6. Membuat CMS untuk mengelola konten portfolio.
7. Menambahkan authentication untuk admin.
8. Menyimpan data menggunakan Supabase PostgreSQL.
9. Menyimpan gambar menggunakan Supabase Storage.
10. Men-deploy aplikasi menggunakan Vercel.
11. Memanfaatkan kemampuan Next.js modern seperti Server Components, Server Actions/Route Handlers jika diperlukan, SSR, dan optimasi image.
12. Membuat architecture yang mudah dikembangkan di masa depan.

---

# 3. Existing Website

AI Agent WAJIB melakukan inspection terhadap repository sebelum melakukan perubahan.

Struktur existing:

```text
profile-card/
├── image/
│   ├── andre.jpg
│   └── logoRey0.png
├── index.html
├── index.js
└── style.css
```

Existing design menggunakan konsep:

```text
Background:
#19153c

Card:
#070522

Primary Accent:
#ff3f81

Secondary Accent:
#e1bee7

Text:
#ffffff
```

Design existing menggunakan nuansa:

* Dark
* Purple
* Pink
* Minimalist
* Modern
* Developer / Technology aesthetic

Design baru harus mempertahankan karakter tersebut.

Jangan mengganti keseluruhan visual menjadi template portfolio generik.

---

# 4. Target Architecture

Architecture yang digunakan:

```text
                         ┌──────────────────────┐
                         │       GitHub         │
                         │   Source Repository  │
                         └──────────┬───────────┘
                                    │
                                    │ Git Push
                                    ▼
                         ┌──────────────────────┐
                         │       Vercel         │
                         │  Next.js Application │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │    Supabase     │             │ Supabase Storage│
          │   PostgreSQL    │             │     Images      │
          └─────────────────┘             └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │  Supabase Auth  │
          │     Admin       │
          └─────────────────┘
```

Berbeda dengan deployment GitHub Pages, aplikasi tidak perlu menggunakan:

```javascript
output: 'export'
```

Next.js dapat menggunakan server-side functionality karena production environment berjalan di Vercel.

Vercel secara native mendukung Next.js dan dapat menangani static generation, SSR, API routes, serta serverless functions.

---

# 5. Technology Stack

## Frontend

Gunakan:

* Next.js
* TypeScript
* React
* Tailwind CSS atau CSS Modules
* Lucide React / icon library yang ringan
* Responsive design

Gunakan **Next.js App Router**.

Struktur awal:

```text
app/
├── page.tsx
├── portfolio/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── education/
│   │   └── page.tsx
│   └── projects/
│       ├── page.tsx
│       ├── create/
│       │   └── page.tsx
│       └── [id]/
│           └── page.tsx
│
├── layout.tsx
└── globals.css
```

---

# 6. Backend

Backend menggunakan:

**Supabase**

Components:

* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security

Next.js dapat berkomunikasi dengan Supabase melalui server-side maupun client-side SDK sesuai kebutuhan.

Untuk operasi yang membutuhkan privilege tinggi, gunakan server-side implementation dan jangan pernah expose Supabase Service Role Key ke browser.

---

# 7. Hosting

Production hosting:

**Vercel**

Workflow:

```text
Developer
   │
   ▼
GitHub Repository
   │
   ▼
Vercel
   │
   ├── Preview Deployment
   │
   └── Production Deployment
```

Workflow development:

```text
Feature Branch
      ↓
GitHub Push
      ↓
Vercel Preview
      ↓
Testing
      ↓
Pull Request
      ↓
main
      ↓
Production Deployment
```

Vercel secara otomatis dapat membuat Preview Deployment untuk branch/PR dan Production Deployment ketika perubahan masuk ke production branch.

---

# 8. Public Pages

## 8.1 Homepage

Route:

```text
/
```

Homepage mempertahankan konsep profile card existing.

Content:

### Profile Image

Menampilkan foto Reynold.

### Name

```text
Reynold Andre
```

### Job Title

```text
Web Developer
```

### Short Introduction

Gunakan konten dari profile CMS.

### Social Links

Minimal:

* Instagram
* LinkedIn
* GitHub
* Email

### Portfolio Button

Button:

```text
View Portfolio
```

Button tidak lagi membuka modal JSON.

Button harus mengarahkan ke:

```text
/portfolio
```

---

# 9. Portfolio Page

Route:

```text
/portfolio
```

Page terdiri dari:

```text
Portfolio
│
├── Header
│
├── Short Introduction
│
├── Education
│
└── Projects
```

---

# 10. Profile Section

Profile section harus dapat dikelola dari CMS.

Data:

```text
name
title
photo
short_description
long_description
email
linkedin_url
github_url
instagram_url
twitter_url
```

Contoh:

```text
Reynold Andre

Web Developer

A Web Developer and Software Engineering Technology graduate
from IPB University...
```

Profile photo disimpan di Supabase Storage.

---

# 11. Education Section

Menampilkan riwayat pendidikan.

Contoh:

```text
IPB University
Sarjana Terapan – Teknologi Rekayasa Perangkat Lunak

GPA: 3.80
```

Fields:

```text
id
institution
degree
field_of_study
start_year
end_year
description
logo_url
display_order
is_visible
created_at
updated_at
```

CMS harus dapat:

* Create
* Read
* Update
* Delete
* Reorder
* Show/hide

---

# 12. Project Section

Project merupakan bagian utama dari website.

Setiap project memiliki:

```text
Title
Slug
Thumbnail
Description
Technologies
Project Type
Project URL
Repository URL
Status
Display Order
Published
```

Contoh:

```text
Employee Self Service Web App
```

Technology:

```text
Laravel
PHP
PostgreSQL
JavaScript
Bootstrap
```

---

# 13. Project Images

Satu project dapat memiliki banyak gambar.

Contoh:

```text
Project
│
├── image-1
├── image-2
├── image-3
└── image-4
```

Public portfolio menampilkan image menggunakan carousel.

Carousel harus memiliki:

* Previous button
* Next button
* Indicator
* Swipe support pada mobile
* Thumbnail navigation jika relevan
* Lazy loading
* Responsive image

---

# 14. Project Detail Page

Route:

```text
/portfolio/[slug]
```

Contoh:

```text
/portfolio/employee-self-service
```

Layout:

```text
┌───────────────────────────────────┐
│ Project Title                     │
│                                   │
│ Image Carousel                    │
│                                   │
├───────────────────────────────────┤
│ Description                       │
│                                   │
│ Technologies                      │
│                                   │
│ Project Information               │
│                                   │
│ [Repository] [Live Demo]          │
└───────────────────────────────────┘
```

---

# 15. Initial Project Data

Migrasikan project existing dari `index.js`.

Project awal:

### Project 1

```text
Card Profile
```

### Project 2

```text
Employee Self Service Web App
```

### Project 3

```text
Employee Self Service Mobile App
```

### Project 4

```text
Anti Money Laundering and Countering
the Financing of Terrorism (AML-CFT) Web App
```

AI Agent harus menggunakan data existing sebagai seed/initial data dan tidak menghapus informasi yang masih relevan.

---

# 16. CMS

CMS menggunakan route:

```text
/admin
```

CMS harus memiliki authentication.

Login:

```text
/admin/login
```

Setelah login:

```text
/admin
```

---

# 17. Admin Dashboard

Dashboard minimal menampilkan:

```text
Dashboard

Profile
Education
Projects

Statistics:
- Total Projects
- Published Projects
- Education Entries
```

Dashboard harus sederhana dan tidak perlu dibuat seperti enterprise admin panel.

Prioritaskan:

* usability
* clean UI
* responsive
* easy maintenance

---

# 18. CMS Profile Management

Route:

```text
/admin/profile
```

Admin dapat:

* Edit name
* Edit title
* Edit short description
* Edit long description
* Upload profile image
* Edit email
* Edit social media
* Save changes

---

# 19. CMS Education Management

Route:

```text
/admin/education
```

Features:

```text
Create Education
Edit Education
Delete Education
Reorder Education
Toggle Visibility
```

---

# 20. CMS Project Management

Route:

```text
/admin/projects
```

List project menggunakan table/card.

Columns:

```text
Thumbnail
Title
Technology
Status
Published
Actions
```

Actions:

```text
Edit
Delete
Publish / Unpublish
```

---

# 21. Create / Edit Project

Form:

```text
Title
Slug
Short Description
Full Description
Technologies
Project Type
Project URL
Repository URL
Thumbnail
Project Images
Display Order
Published
```

Technology sebaiknya menggunakan array/tag.

Contoh:

```text
Laravel
PHP
PostgreSQL
Flutter
JavaScript
```

---

# 22. Image Upload

Gunakan:

**Supabase Storage**

Bucket:

```text
portfolio-images
```

Folder structure:

```text
portfolio-images/
├── profile/
├── education/
└── projects/
    ├── project-1/
    ├── project-2/
    └── project-3/
```

CMS harus mendukung:

* Upload
* Preview
* Delete
* Replace
* Multiple upload
* Reorder images

Validasi:

```text
Allowed:
jpg
jpeg
png
webp

Maximum size:
5 MB / image
```

Ukuran tersebut dapat disesuaikan apabila diperlukan.

---

# 23. Database Schema

## profiles

```text
id
name
title
short_description
long_description
photo_url
email
linkedin_url
github_url
instagram_url
twitter_url
created_at
updated_at
```

---

## education

```text
id
institution
degree
field_of_study
start_year
end_year
description
logo_url
display_order
is_visible
created_at
updated_at
```

---

## projects

```text
id
title
slug
short_description
description
technologies
project_type
project_url
repository_url
thumbnail_url
display_order
is_published
created_at
updated_at
```

---

## project_images

```text
id
project_id
image_url
alt_text
display_order
created_at
```

Relationship:

```text
projects
   │
   └── project_images
          ├── image 1
          ├── image 2
          ├── image 3
          └── image 4
```

Foreign key:

```text
project_images.project_id
        ↓
projects.id
```

Jika project dihapus, gunakan cascade delete untuk image metadata.

---

# 24. Authentication

Gunakan:

**Supabase Auth**

Method:

```text
Email + Password
```

Admin login:

```text
/admin/login
```

CMS tidak boleh dapat diakses oleh user anonymous.

Route protection dapat menggunakan Next.js middleware/proxy sesuai versi Next.js yang digunakan.

Flow:

```text
User
 ↓
/admin
 ↓
Check Authentication
 ↓
Authenticated?
 ├── YES → Dashboard
 └── NO  → /admin/login
```

---

# 25. Authorization

MVP hanya membutuhkan satu tipe user:

```text
admin
```

Jangan membuat role/permission system yang terlalu kompleks pada tahap awal.

Admin authenticated memiliki akses:

```text
Profile CRUD
Education CRUD
Project CRUD
Image Management
```

---

# 26. Row Level Security

Supabase RLS harus diaktifkan.

Public:

```text
SELECT published projects
SELECT visible education
SELECT profile
```

Admin:

```text
INSERT
UPDATE
DELETE
```

Admin access harus berdasarkan authenticated user.

Jangan membuat policy:

```text
authenticated users can do everything
```

tanpa validasi yang sesuai.

---

# 27. Supabase Environment Variables

Development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jika diperlukan server-side privileged operation:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`:

**WAJIB server-only.**

Jangan pernah:

```text
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

Jangan commit credential ke GitHub.

---

# 28. Vercel Environment Variables

Environment variable production disimpan melalui:

```text
Vercel
→ Project
→ Settings
→ Environment Variables
```

Environment dapat dibedakan:

```text
Development
Preview
Production
```

Vercel menyediakan environment variable management untuk ketiga environment tersebut.

Gunakan:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

sebagai public configuration.

Secret seperti service role key harus menggunakan environment variable server-side dan tidak boleh diberi prefix `NEXT_PUBLIC_`. Environment dengan prefix tersebut akan masuk ke client bundle.

---

# 29. Next.js Rendering Strategy

Karena deployment menggunakan Vercel, jangan menggunakan static-export-only architecture.

Gunakan rendering sesuai kebutuhan.

Recommended:

### Homepage

Server Component / static rendering apabila memungkinkan.

### Portfolio

Server Component dengan data dari Supabase.

### Project Detail

Server-rendered page.

### Admin

Client Components untuk interactive form.

### Authentication

Server-side authentication check + client-side session handling sesuai kebutuhan.

### Image Carousel

Client Component.

Dengan architecture ini, portfolio dapat memiliki SEO yang lebih baik dibandingkan jika seluruh data hanya di-fetch menggunakan JavaScript setelah halaman dimuat.

---

# 30. SEO

Homepage:

```text
Title:
Reynold Andre – Web Developer

Description:
Personal portfolio of Reynold Andre, Web Developer
and Software Engineering Technology graduate from IPB University.
```

Portfolio:

```text
Title:
Portfolio – Reynold Andre
```

Project:

```text
Title:
[Project Name] – Reynold Andre
```

Tambahkan:

* Metadata
* Open Graph
* Twitter Card
* Canonical URL
* Favicon
* robots
* sitemap

Jika memungkinkan, gunakan dynamic metadata untuk project detail.

---

# 31. Responsive Design

Website wajib responsive untuk:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Prioritaskan mobile experience.

Breakpoints harus digunakan secara konsisten.

---

# 32. Design System

Pertahankan visual identity existing.

Primary:

```css
--background: #19153c;
--card: #070522;
--primary: #ff3f81;
--secondary: #e1bee7;
--text: #ffffff;
```

Gunakan:

* Dark background
* Gradient subtle
* Pink accent
* Purple accent
* Glass/card effect secukupnya
* Border glow secukupnya
* Smooth transition
* Rounded corners

Hindari:

* terlalu banyak gradient
* animasi berlebihan
* neon berlebihan
* dashboard template generik
* terlalu banyak warna

---

# 33. Homepage Animation

Existing website menggunakan Vanta background.

AI Agent boleh mempertahankan konsep tersebut apabila performanya masih baik.

Namun:

* Pastikan tidak menyebabkan layout shift.
* Jangan mengganggu readability.
* Sediakan fallback background.
* Jangan membuat animasi berat pada mobile.

Jika Vanta menyebabkan performance issue, prioritaskan CSS-based background/animation yang lebih ringan.

---

# 34. Portfolio UI

Portfolio page sebaiknya menggunakan card.

Contoh:

```text
┌─────────────────────┐
│                     │
│      Thumbnail      │
│                     │
├─────────────────────┤
│ Project Name        │
│                     │
│ Short description   │
│                     │
│ Laravel PHP ...     │
│                     │
│ View Project →      │
└─────────────────────┘
```

Card harus memiliki hover effect yang konsisten dengan homepage.

---

# 35. Admin UI

CMS tidak perlu mengikuti desain public portfolio secara ekstrem.

Namun tetap menggunakan:

* Dark theme
* Purple
* Pink accent
* Clean layout

Sidebar:

```text
Dashboard
Profile
Education
Projects
Logout
```

Desktop:

```text
Sidebar + Content
```

Mobile:

```text
Collapsible navigation
```

---

# 36. Data Fetching

Gunakan abstraction layer.

Contoh:

```text
lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
│
├── queries/
│   ├── profile.ts
│   ├── education.ts
│   └── projects.ts
│
└── validations/
```

Jangan menaruh query Supabase secara langsung di setiap component.

Tujuannya agar:

* maintainable
* reusable
* easier testing
* easier debugging

---

# 37. Validation

Gunakan schema validation library seperti:

```text
Zod
```

Validasi:

* Project title
* Slug
* Description
* URLs
* Image type
* Image size
* Education fields
* Profile fields

Slug harus unik.

---

# 38. Error Handling

Implementasikan:

```text
Loading State
Empty State
Error State
Success State
```

Contoh:

```text
Loading projects...
```

Jika tidak ada project:

```text
No projects available.
```

Jika gagal:

```text
Unable to load portfolio.
Please try again later.
```

CMS harus memberikan feedback:

```text
Project successfully created.
Project successfully updated.
Project successfully deleted.
```

---

# 39. Security Requirements

WAJIB:

* Supabase RLS
* Authentication
* Input validation
* Server-side secret protection
* No service role key in frontend
* No hardcoded password
* No hardcoded API secret
* Sanitize/validate external URLs
* Validate uploaded file type
* Validate uploaded file size
* Protect admin routes

Jangan mengandalkan hidden UI sebagai security.

Contoh:

```text
Men-disable tombol Delete
```

bukan security mechanism.

Authorization harus dilakukan pada backend/database level.

---

# 40. Performance

Target:

* Fast initial load
* Optimized images
* Lazy load project images
* Minimize JavaScript
* Avoid unnecessary client components
* Avoid excessive animation
* Use Next.js Image
* Use appropriate caching/revalidation

Vercel dapat memanfaatkan CDN dan optimasi Next.js secara native.

---

# 41. Existing Asset Migration

Migrasikan:

```text
image/andre.jpg
image/logoRey0.png
```

ke architecture baru.

Profile image:

```text
Supabase Storage
```

Logo/favicon dapat tetap berada di:

```text
public/
```

jika tidak perlu dikelola CMS.

---

# 42. Project Migration

Data existing dari:

```text
index.js
```

harus dimigrasikan menjadi database seed.

Jangan hanya menghapus data existing.

AI Agent harus membaca project data existing terlebih dahulu.

Kemudian:

```text
Existing JSON
      ↓
Transform
      ↓
Supabase Seed
      ↓
Portfolio CMS
```

---

# 43. Recommended Folder Structure

```text
profile-card/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── portfolio/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── admin/
│       ├── login/
│       ├── page.tsx
│       ├── profile/
│       ├── education/
│       └── projects/
│
├── components/
│   ├── layout/
│   ├── profile/
│   ├── portfolio/
│   ├── education/
│   ├── admin/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── queries/
│   ├── validations/
│   └── utils/
│
├── public/
│   ├── favicon.ico
│   └── ...
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 44. Deployment

GitHub tetap digunakan sebagai source repository.

Vercel menjadi hosting utama.

Flow:

```text
GitHub
   ↓
Vercel
   ↓
Build Next.js
   ↓
Deploy
```

Tidak diperlukan GitHub Actions khusus untuk deployment jika menggunakan integrasi GitHub → Vercel.

Vercel secara native dapat mendeteksi aplikasi Next.js dan melakukan deployment dengan konfigurasi minimal.

---

# 45. Custom Domain

Architecture harus siap menggunakan custom domain.

Contoh:

```text
reynoldandre.com
```

atau domain lain di masa depan.

Jangan hardcode:

```text
localhost
```

sebagai production URL.

Gunakan environment variable:

```env
NEXT_PUBLIC_SITE_URL=
```

---

# 46. Development Environment

Local:

```bash
npm install
npm run dev
```

Expected:

```text
http://localhost:3000
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Optional:

```bash
npm run typecheck
```

---

# 47. Environment Example

Commit:

```text
.env.example
```

Contoh:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

SUPABASE_SERVICE_ROLE_KEY=
```

Jangan commit:

```text
.env.local
```

---

# 48. Testing

Minimal testing:

## Public

* Homepage loads
* Portfolio button works
* Portfolio page loads
* Project card works
* Project detail works
* Carousel works
* Mobile responsive
* Social links work

## CMS

* Login works
* Unauthorized user cannot access dashboard
* Profile CRUD works
* Education CRUD works
* Project CRUD works
* Image upload works
* Image delete works
* Publish/unpublish works
* Logout works

## Database

* RLS works
* Public only receives allowed data
* Admin can modify data
* Anonymous user cannot modify data

---

# 49. Acceptance Criteria

Project dianggap selesai apabila:

### Public

* [ ] Homepage mempertahankan visual identity existing.
* [ ] Button Portfolio mengarah ke `/portfolio`.
* [ ] Portfolio menampilkan profile.
* [ ] Portfolio menampilkan education.
* [ ] Portfolio menampilkan projects.
* [ ] Project dapat memiliki multiple images.
* [ ] Carousel berjalan.
* [ ] Project detail tersedia.
* [ ] Responsive mobile/desktop.
* [ ] SEO metadata tersedia.

### CMS

* [ ] `/admin/login` tersedia.
* [ ] Authentication Supabase bekerja.
* [ ] Unauthorized user tidak dapat mengakses CMS.
* [ ] Profile dapat diedit.
* [ ] Education dapat dikelola.
* [ ] Project dapat dikelola.
* [ ] Multiple image dapat di-upload.
* [ ] Image dapat dihapus.
* [ ] Project dapat publish/unpublish.

### Infrastructure

* [ ] Supabase PostgreSQL aktif.
* [ ] Supabase Storage aktif.
* [ ] RLS aktif.
* [ ] Environment variables aman.
* [ ] Tidak ada secret di GitHub.
* [ ] Vercel deployment berhasil.
* [ ] Production environment berhasil.
* [ ] Preview deployment berhasil.

---

# 50. Development Phases

## Phase 1 – Foundation

* Setup Next.js
* Setup TypeScript
* Setup styling
* Setup Supabase
* Setup environment variables
* Setup Vercel

## Phase 2 – Existing Website Migration

* Recreate homepage
* Migrate existing assets
* Preserve existing design
* Replace static JavaScript implementation

## Phase 3 – Database

* Create migrations
* Create tables
* Create relationships
* Enable RLS
* Create seed data

## Phase 4 – Public Portfolio

* Profile
* Education
* Project listing
* Project detail
* Carousel
* SEO

## Phase 5 – Authentication

* Supabase Auth
* Login
* Session
* Protected admin routes
* Logout

## Phase 6 – CMS

* Dashboard
* Profile management
* Education management
* Project management
* Image management

## Phase 7 – Production

* Connect GitHub
* Connect Vercel
* Configure environment variables
* Build
* Test
* Production deployment

## Phase 8 – Optimization

* Performance
* Accessibility
* SEO
* Mobile
* Error handling
* Security review

---

# 51. Important Instructions for AI Agent

AI Agent WAJIB mengikuti aturan berikut.

### Rule 1

**Inspect existing repository before modifying anything.**

Jangan langsung membuat project dari awal tanpa memahami:

```text
index.html
index.js
style.css
image/
```

### Rule 2

Pertahankan design identity existing.

Jangan mengganti website menjadi template portfolio yang sama sekali berbeda.

### Rule 3

Gunakan Next.js App Router.

### Rule 4

Gunakan TypeScript.

### Rule 5

Gunakan Supabase sebagai database utama.

### Rule 6

Gunakan Supabase Auth untuk admin authentication.

### Rule 7

Gunakan Supabase Storage untuk image.

### Rule 8

Gunakan RLS.

### Rule 9

Jangan expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

ke client.

### Rule 10

Jangan hardcode credentials.

### Rule 11

Gunakan Vercel sebagai production hosting.

### Rule 12

Jangan menggunakan:

```text
output: 'export'
```

kecuali ada alasan teknis khusus yang disetujui.

### Rule 13

Manfaatkan server-side capability Next.js/Vercel untuk bagian yang memang membutuhkan server.

### Rule 14

Jangan membuat backend server terpisah jika tidak diperlukan.

### Rule 15

Jangan membuat microservices.

### Rule 16

Jangan over-engineering.

MVP harus sederhana namun memiliki foundation yang baik.

---

# 52. Recommended Architecture Decision

Architecture final:

```text
                    GitHub
                       │
                       ▼
                    Vercel
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Next.js App          Server Functions
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                   Supabase
              ┌────────┼────────┐
              │        │        │
              ▼        ▼        ▼
           Database   Auth    Storage
```

Public:

```text
/
├── profile
└── portfolio
    └── projects
```

Admin:

```text
/admin
├── login
├── profile
├── education
└── projects
```

---

# 53. Future Expansion

Architecture harus memungkinkan penambahan:

```text
Blog
Experience
Skills
Certifications
Contact Form
Resume Download
Analytics
Testimonials
Services
```

Namun fitur tersebut **tidak perlu dibuat pada MVP**.

---

# 54. Definition of Done

Development dianggap selesai apabila:

```text
Existing Profile Card
        ↓
Next.js
        ↓
Modern Portfolio
        ↓
Supabase Database
        ↓
Supabase Auth
        ↓
Supabase Storage
        ↓
Admin CMS
        ↓
Vercel
        ↓
Production
```

dan seluruh acceptance criteria terpenuhi.

Target akhir:

> Website bukan lagi sekadar static profile card, tetapi menjadi personal portfolio platform yang memiliki public-facing portfolio dan CMS untuk mengelola seluruh konten secara dinamis.
