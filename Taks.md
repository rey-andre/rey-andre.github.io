# Task Breakdown: Personal Portfolio & CMS

Dokumen ini berisi pembagian tugas langkah demi langkah untuk mengimplementasikan Product Requirements Document (PRD) versi 2.0[cite: 2].

---

## TAHAP 1: Persiapan Manual oleh Anda (User Setup)
*Langkah-langkah ini harus Anda lakukan sendiri di browser sebelum menyuruh AI Agent mulai mengoding.*

- [ ] **Setup Project Supabase:**
  - Buat project baru di dasbor [Supabase](https://supabase.com/).
  - Masuk ke menu **Storage** dan buat bucket baru dengan nama `portfolio-images` dan atur agar bucket ini bersifat *Public*[cite: 2].
  - Dapatkan kredensial API (Project URL, `anon` public key, dan `service_role` secret key).
  - Daftarkan email dan password Anda sendiri melalui menu **Authentication** di Supabase untuk digunakan sebagai akun Admin login nanti.
- [ ] **Setup Project Vercel:**
  - Buat project baru di [Vercel](https://vercel.com/) dan hubungkan (import) dengan repository GitHub Anda (`rey-andre/rey-andre.github.io`)[cite: 2].
  - Masukkan *Environment Variables* berikut ke pengaturan project Vercel Anda[cite: 2]:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SITE_URL` (misal: domain vercel Anda atau domain custom)
    - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Siapkan Environment Variables Lokal:**
  - Buat file `.env.local` di komputer Anda dengan struktur yang sama seperti `.env.example` di PRD[cite: 2], lalu isi dengan API keys dari Supabase Anda agar AI Agent bisa menggunakannya saat *local development*.

---

## TAHAP 2: Foundation & Migrasi Awal (AI Agent)
*AI Agent akan mulai bekerja di IDE dari tahap ini.*

- [x] **Inisialisasi Project Next.js:** 
  - Install Next.js menggunakan App Router, TypeScript, dan Tailwind CSS[cite: 2].
  - Buat struktur folder standar sesuai PRD (folder `app/`, `app/portfolio/`, `app/admin/`, `components/`, `lib/`)[cite: 2].
- [x] **Inspeksi dan Migrasi Aset Lama:** 
  - Analisis warna, struktur, dan aset dari file `index.html`, `style.css`, dan `image/` yang sudah ada[cite: 2].
  - Terapkan variabel CSS lama (Dark `#19153c`, Card `#070522`, Pink `#ff3f81`, Purple `#e1bee7`) ke konfigurasi Tailwind/global CSS[cite: 2].
- [x] **Rebuild Homepage (`/`):** 
  - Bangun ulang Homepage menggunakan Next.js Server Components dengan mempertahankan desain visual (Vanta background atau alternatif CSS fallback, foto profil, nama, jabatan, tombol ke `/portfolio`)[cite: 2].

---

## TAHAP 3: Database & Skema Supabase (AI Agent)
- [ ] **Buat File Skema Migrasi / Setup SQL:** 
  - Buat query SQL (di file `supabase/migrations/`) untuk membuat tabel: `profiles`, `education`, `projects`, dan `project_images` sesuai definisi kolom di PRD[cite: 2].
- [ ] **Konfigurasi Row Level Security (RLS):** 
  - Tulis SQL policy untuk memastikan data public bisa dibaca (`SELECT`), namun operasi `INSERT`, `UPDATE`, `DELETE` hanya bisa dilakukan oleh user *authenticated* (Admin)[cite: 2].
- [ ] **Migrasi Data Awal (Seeding):** 
  - Baca data project lama yang ada di file `index.js` existing[cite: 2].
  - Konversi data tersebut menjadi file `seed.sql` untuk dimasukkan ke database Supabase agar website tidak kosong saat pertama berjalan[cite: 2].

---

## TAHAP 4: Authentication & Route Protection (AI Agent)
- [ ] **Integrasi Supabase Auth:** 
  - Setup Supabase Client untuk *client-side* dan *server-side* di dalam folder `lib/supabase/`[cite: 2].
- [ ] **Buat Halaman Login:** 
  - Bangun halaman login di `/admin/login` menggunakan Email & Password[cite: 2].
- [ ] **Buat Route Protection (Middleware):** 
  - Konfigurasi `middleware.ts` Next.js untuk mengecek sesi user. Jika *unauthenticated* mencoba mengakses `/admin`, *redirect* otomatis ke `/admin/login`[cite: 2].

---

## TAHAP 5: Pembuatan CMS Admin Dashboard (AI Agent)
- [ ] **Layout Admin:** 
  - Buat layout dengan sidebar navigasi (Dashboard, Profile, Education, Projects, Logout) bernuansa *dark theme* dengan aksen pink/purple[cite: 2].
- [ ] **Modul Profile CMS (`/admin/profile`):** 
  - Buat form untuk mengubah data bio, *social media links*, dan fitur upload *single image* untuk foto profil ke Supabase Storage[cite: 2].
- [ ] **Modul Education CMS (`/admin/education`):** 
  - Buat fitur CRUD (Create, Read, Update, Delete) untuk daftar riwayat pendidikan lengkap dengan *toggle visibility*[cite: 2].
- [ ] **Modul Projects CMS (`/admin/projects`):** 
  - Buat list/tabel data proyek.
  - Buat halaman form create/edit proyek (`/admin/projects/create` & `/admin/projects/[id]`)[cite: 2].
  - Implementasi *multiple image upload* ke Supabase Storage, preview gambar, dan fungsionalitas hapus gambar untuk carousel proyek[cite: 2].

---

## TAHAP 6: Pembuatan Halaman Portfolio Publik (AI Agent)
- [ ] **Halaman Portfolio Utama (`/portfolio`):** 
  - Fetch data riwayat pendidikan dan daftar proyek yang berstatus *published* dari Supabase.
  - Tampilkan dalam bentuk UI Card atau List yang interaktif dan responsif[cite: 2].
- [ ] **Halaman Detail Proyek (`/portfolio/[slug]`):** 
  - Render halaman detail proyek menggunakan SSR (Server-Side Rendering) untuk mendukung SEO[cite: 2].
  - Implementasi komponen **Image Carousel** (misalnya menggunakan *Swiper*) untuk menampilkan array gambar `project_images`[cite: 2].
  - Tampilkan deskripsi, tumpukan teknologi (sebagai tag), dan link repository/demo[cite: 2].

---

## TAHAP 7: Optimasi, Testing & Finalisasi (AI Agent & User)
- [ ] **Optimasi SEO & Performa (AI Agent):** 
  - Tambahkan metadata dinamis di setiap halaman public (Title, Description, Open Graph)[cite: 2].
  - Terapkan `next/image` untuk optimasi *lazy loading* gambar[cite: 2].
- [ ] **Testing Menyeluruh (AI Agent & User):** 
  - Verifikasi bahwa skema RLS berjalan dengan benar[cite: 2].
  - Cek responsivitas tampilan (Mobile, Tablet, Desktop)[cite: 2].
- [ ] **Deployment (User):** 
  - Jalankan `git push` ke *branch* utama (misal: `main` atau `master`).
  - Pantau otomatisasi *build* di dasbor Vercel dan pastikan *production link* berjalan dengan baik[cite: 2].