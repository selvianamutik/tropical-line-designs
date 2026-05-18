# Plan Revisi TLD - 16 Mei 2026

Dokumen ini merangkum masalah revisi, beberapa solusi yang bisa dilakukan, rekomendasi teknis, dan area file/database yang kemungkinan terdampak.

## Ringkasan Prioritas

1. Revisi UI cepat: fade transition, label hover project, collaborator logo grid, rename Studio menjadi Principal.
2. Revisi data/admin: services, project order, footer text yang bisa diatur dari admin.
3. Revisi project experience: project detail menampilkan 1 image besar dulu, lalu collage setelah scroll.
4. QA akhir: cek desktop dan mobile untuk Home, Projects, About, Collaborators, dan Admin.

## 1. Typing Transition di Project Diganti dari Ketik ke Fade

### Masalah

Saat ini komponen hero memakai efek typing melalui `useTypingText` di `src/components/landing/hero-content.tsx`. Permintaan revisi adalah mengganti transisi teks dari efek ketik menjadi fade.

### Solusi yang Bisa Dilakukan

Solusi A - Fade sederhana dengan CSS transition:

- Hapus hook `useTypingText`.
- Render title secara utuh.
- Tambahkan animasi opacity dan sedikit translate saat `HeroSection` mengganti project aktif.
- Hapus cursor typing yang masih muncul di title.
- Cocok jika ingin perubahan cepat dan ringan.

Solusi B - Fade memakai Framer Motion:

- Bungkus title/facts dengan `motion.div`.
- Gunakan `AnimatePresence` untuk `initial`, `animate`, dan `exit`.
- Cocok jika ingin transisi lebih halus dan konsisten dengan `ProjectOverlay` yang sudah memakai Framer Motion.

### Rekomendasi

Gunakan Solusi B jika transisi perlu terasa premium dan konsisten. Gunakan Solusi A jika ingin perubahan minimal.

### File Terdampak

- `src/components/landing/hero-content.tsx`
- `src/components/landing/hero-section.tsx`

## 2. Studio Diganti Principal dan Penambahan Services di About dan Admin Page

### Masalah

Menu About saat ini masih memakai label `Studio` di `src/components/about/about-sidebar.tsx`. Konten Principal sudah ada secara konsep karena `src/app/about/page.tsx` mengambil team member dengan role `Principal`, tetapi label halaman masih perlu disesuaikan. Services belum punya struktur data dan admin page khusus.

### Solusi yang Bisa Dilakukan

Solusi A - Rename label saja dan services statis:

- Ubah label sidebar dari `Studio` menjadi `Principal`.
- Route tetap `/about` agar link lama tidak rusak.
- Tambahkan section services dari array statis di `src/data/about.ts`.
- Cocok untuk revisi cepat tanpa migration database.

Solusi B - Tambah halaman Services dan admin CRUD:

- Ubah sidebar About menjadi: `Principal`, `People`, `Services`, `Collaborators`, `Awards`.
- Tambahkan route publik `/about/services`.
- Tambahkan route admin `/admin/services`.
- Buat table Supabase `services` dengan field dasar:
  - `id`
  - `title`
  - `description`
  - `sort_order`
  - `is_active`
  - `created_at`
- Admin bisa tambah, edit, hapus, dan ubah urutan services.
- Cocok jika services akan sering diubah oleh admin.

Solusi C - Services disimpan di `site_settings`:

- Tambahkan field `services_json` atau `services_text` di `site_settings`.
- Admin mengelola services dari Studio Settings.
- Lebih cepat daripada CRUD table, tetapi validasi dan reorder kurang rapi.

### Rekomendasi

Gunakan Solusi B. Karena request menyebut services di About dan admin page, struktur CRUD terpisah lebih mudah dirawat dan tidak mencampur data services dengan contact/footer settings.

### File dan Database Terdampak

- `src/components/about/about-sidebar.tsx`
- `src/app/about/page.tsx`
- `src/app/about/services/page.tsx` jika memakai halaman baru
- `src/app/admin/services/page.tsx` jika memakai admin CRUD
- `src/components/admin/admin-sidebar.tsx`
- `src/app/admin/actions.ts`
- `src/lib/admin/repository.ts`
- `src/lib/admin/types.ts`
- `src/lib/public/about.ts` atau file publik baru untuk services
- Migration Supabase untuk table `services`

## 3. Image di Project: 1 Image Besar, Saat Scroll Baru Collage Image

### Masalah

Project detail saat ini menampilkan gallery collage langsung di overlay desktop. Permintaan revisi adalah pengalaman project dimulai dari 1 image besar terlebih dahulu, kemudian saat user scroll baru muncul collage image.

### Solusi yang Bisa Dilakukan

Solusi A - Ubah `ProjectOverlay` menjadi layout scroll:

- First viewport: cover image besar full width/full height, memakai `project.image`.
- Section berikutnya: detail project.
- Section berikutnya: collage/gallery memakai `project.images`.
- Desktop dan mobile sama-sama scrollable.
- Cocok karena project saat ini sudah dibuka lewat overlay.

Solusi B - Buat project detail page penuh:

- Klik project membuka `/projects/[slug]`.
- Halaman detail punya hero image besar, lalu detail dan collage setelah scroll.
- Overlay grid bisa dihapus atau dipakai hanya sebagai quick preview.
- Cocok jika butuh URL detail yang bisa dibagikan dan SEO lebih baik.

Solusi C - Hybrid:

- Grid tetap membuka overlay.
- Overlay memiliki tombol atau scroll cue menuju collage.
- Route detail tetap bisa ditambahkan nanti.

### Rekomendasi

Gunakan Solusi A untuk revisi cepat, karena data gallery dan overlay sudah tersedia. Solusi B lebih baik untuk jangka panjang jika setiap project perlu halaman detail yang bisa dibagikan.

### File Terdampak

- `src/components/projects/project-overlay.tsx`
- `src/components/projects/projects-grid-page.tsx`
- `src/lib/public/projects.ts`
- `src/components/admin/admin-projects-table.tsx` untuk preview admin

## 4. Urutan Project Bisa Diubah-ubah

### Masalah

Project publik dan admin saat ini diurutkan berdasarkan `commenced_at` lalu `created_at`. Belum ada field khusus untuk mengatur urutan manual, misalnya Bajo Well dipindahkan ke urutan 5.

### Solusi yang Bisa Dilakukan

Solusi A - Tambah `display_order` di table `portfolios`:

- Tambahkan kolom `display_order integer not null default 0`.
- Query publik dan admin order by `display_order asc`, lalu fallback `commenced_at desc`.
- Admin project table menampilkan urutan.
- Tambahkan action untuk simpan reorder.
- Cocok untuk kebutuhan manual order yang stabil.

Solusi B - Pakai tanggal `commenced_at` sebagai kontrol urutan:

- Admin mengubah tanggal agar project naik/turun.
- Tidak perlu migration.
- Kurang intuitif dan bisa merusak data historis project.

Solusi C - Table relasi khusus `portfolio_display_order`:

- Buat table terpisah untuk urutan display.
- Cocok jika nanti ada beberapa daftar project berbeda, misalnya homepage selected works dan full project page.
- Lebih kompleks untuk kebutuhan saat ini.

### Rekomendasi

Gunakan Solusi A. Tambahkan drag-and-drop sederhana di admin seperti pola yang sudah ada pada `ProjectGalleryDialog`.

### File dan Database Terdampak

- Migration Supabase untuk `portfolios.display_order`
- `supabase/schema.sql`
- `src/lib/public/projects.ts`
- `src/lib/admin/repository.ts`
- `src/lib/admin/types.ts`
- `src/components/admin/admin-projects-table.tsx`
- `src/app/admin/actions.ts`

## 5. Hover Project: Project Size Diganti Menjadi Project Type

### Masalah

Hover card di project grid saat ini menampilkan label `Project Size` dan mengambil data `project.projectSize`. Permintaan revisi adalah mengganti menjadi `Project Type` dengan tiga pilihan: `Build`, `Design`, `Design and Build`.

### Solusi yang Bisa Dilakukan

Solusi A - Pakai field `category` yang sudah ada:

- Ubah label hover dari `Project Size` menjadi `Project Type`.
- Tampilkan `project.type`, yang saat ini berasal dari `category`.
- Admin field `Category` diganti label menjadi `Project Type`.
- Tambahkan select option `Build`, `Design`, `Design and Build`.
- Cocok untuk perubahan cepat dan minim migration.

Solusi B - Tambah field baru `project_type`:

- Tambahkan kolom `project_type text`.
- Batasi value dengan check constraint: `Build`, `Design`, `Design and Build`.
- `category` tetap bisa dipakai untuk kategori lain seperti Hospitality, Villa, Resort.
- Cocok jika kategori dan project type adalah konsep yang berbeda.

Solusi C - Tetap pakai `project_size`, tapi isi ulang datanya:

- Rename label UI saja.
- Tidak disarankan karena nama field database menjadi menyesatkan.

### Rekomendasi

Gunakan Solusi B jika data project masih akan berkembang. Gunakan Solusi A jika project type memang menggantikan fungsi `category`.

### File dan Database Terdampak

- `src/components/projects/projects-grid-page.tsx`
- `src/lib/public/projects.ts`
- `src/components/admin/admin-projects-table.tsx`
- `src/app/admin/projects/page.tsx`
- `src/app/admin/actions.ts`
- `src/lib/admin/validation.ts`
- Migration Supabase jika memakai `project_type`

## 6. Collaborator Hanya Logo, Tanpa Text, Menyamping Menggunakan Grid

### Masalah

Halaman collaborator saat ini menampilkan logo, nama company, dan expertise dalam bentuk list vertikal. Request baru meminta logo saja tanpa text, disusun menyamping menggunakan grid.

### Solusi yang Bisa Dilakukan

Solusi A - Logo-only grid di halaman publik:

- Ubah `/about/collaborators` menjadi grid responsive.
- Tampilkan hanya image logo.
- Tetap pakai `alt` untuk aksesibilitas.
- Nama company/expertise tetap ada di admin, tetapi tidak tampil di publik.

Solusi B - Logo-only grid dengan hover tooltip:

- Tampilan default hanya logo.
- Saat hover/focus, tampilkan nama company kecil sebagai tooltip atau overlay.
- Lebih ramah aksesibilitas dan membantu user mengenali logo yang kurang jelas.

Solusi C - Tambahkan toggle public display:

- Admin bisa memilih apakah nama collaborator tampil atau tidak.
- Perlu tambahan field seperti `show_public_name`.
- Cocok jika beberapa collaborator perlu label khusus.

### Rekomendasi

Gunakan Solusi A untuk memenuhi request secara tepat. Jika ada kekhawatiran user sulit mengenali logo, gunakan Solusi B.

### File Terdampak

- `src/app/about/collaborators/page.tsx`
- `src/lib/public/collaborators.ts`
- `src/app/admin/collaborators/page.tsx` jika ingin menambah preview logo di admin table

## 7. Footer Text Bisa Diatur di Admin Bagian Studio

### Masalah

Footer saat ini mengambil contact dari `site_settings`, tetapi headline dan deskripsi footer masih hardcoded di `src/components/global/projects-simple-footer.tsx`.

Teks yang diminta:

```text
Holistic tropical landscape design shaped for Bali and beyond.

As a landscape design company based in Bali, a tropical paradise in Indonesia, Tropical Line Design focuses on creating landscape designs with a natural and tropical ambiance combined with elegance to fulfill clients' expectations.
```

### Solusi yang Bisa Dilakukan

Solusi A - Hardcode teks footer:

- Ganti teks langsung di component footer.
- Paling cepat, tetapi tidak bisa diatur admin.

Solusi B - Tambahkan field footer ke `site_settings`:

- Tambahkan kolom:
  - `footer_heading text`
  - `footer_description text`
  - optional `footer_subnote text`
- Tambahkan field di `AdminSettingsForm`.
- Update `getPublicSiteSettings`.
- Footer membaca value dari database dengan fallback.
- Cocok karena request menyebut bisa di-setting di admin bagian Studio.

Solusi C - Buat table `content_blocks`:

- Setiap copy situs disimpan sebagai block, misalnya `footer_heading`, `footer_description`, `about_principal_intro`.
- Lebih fleksibel untuk semua copy, tetapi lebih besar cakupannya.

### Rekomendasi

Gunakan Solusi B. Ini paling sesuai dengan struktur sekarang karena `site_settings` sudah dipakai untuk data global studio dan contact.

### File dan Database Terdampak

- Migration Supabase untuk kolom footer di `site_settings`
- `supabase/schema.sql`
- `src/lib/public/site-settings.ts`
- `src/lib/admin/types.ts`
- `src/components/admin/admin-settings-form.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/actions.ts`
- `src/components/global/projects-simple-footer.tsx`

## Urutan Implementasi yang Disarankan

1. Buat migration database:
   - `portfolios.display_order`
   - `site_settings.footer_heading`
   - `site_settings.footer_description`
   - optional `portfolios.project_type`
   - optional table `services`
2. Update type dan repository:
   - public project query
   - admin project query
   - public site settings
   - admin site settings
   - public/admin services jika dipakai
3. Update admin:
   - project type select
   - project ordering
   - services admin page
   - footer text fields di Studio Settings
4. Update public UI:
   - typing menjadi fade
   - About sidebar `Studio` menjadi `Principal`
   - Services section/page
   - Project overlay: image besar dulu, collage setelah scroll
   - Hover label menjadi `Project Type`
   - Collaborator logo grid
   - Footer membaca copy dari admin settings
5. QA:
   - `npm run lint`
   - cek `/`
   - cek `/projects`
   - cek project overlay desktop dan mobile
   - cek `/about`
   - cek `/about/services` jika dibuat
   - cek `/about/collaborators`
   - cek `/admin/projects`
   - cek `/admin/settings`
   - cek `/admin/services` jika dibuat

## Catatan Risiko

- Perubahan database butuh migration dan update fallback query agar tidak error pada environment yang belum termigrasi.
- Jika `category` diganti menjadi project type, data kategori lama seperti `Hospitality` bisa hilang maknanya. Lebih aman tambah `project_type`.
- Drag-and-drop order project harus menghindari conflict order seperti yang sudah ditangani pada gallery order.
- Footer text di admin perlu validasi panjang agar layout footer tidak pecah di mobile.
- Collaborator logo-only tetap perlu `alt` dan ukuran grid yang stabil agar aksesibilitas dan layout tetap baik.

## Definisi Selesai

- Semua revisi tampil sesuai request di desktop dan mobile.
- Admin bisa mengubah order project, services, dan footer text tanpa edit code.
- Project type hanya menerima salah satu dari `Build`, `Design`, `Design and Build`.
- Collaborator publik tampil sebagai grid logo-only.
- Project detail menampilkan 1 image besar dulu, kemudian collage saat scroll.
- Lint tidak menampilkan error baru.
