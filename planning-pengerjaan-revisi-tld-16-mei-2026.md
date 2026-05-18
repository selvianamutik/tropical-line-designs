# Planning Pengerjaan Revisi TLD - Urutan Dampak Kecil ke Besar

Dokumen ini menyusun ulang revisi dari `revisi-tld-16-mei-2026.md` berdasarkan tingkat kemudahan, risiko perubahan, dan dampak ke database/admin.

## Prinsip Urutan

- Kerjakan perubahan UI statis lebih dulu karena risikonya kecil dan cepat diverifikasi.
- Setelah itu kerjakan perubahan UI yang menyentuh component besar.
- Terakhir kerjakan fitur yang butuh migration database, server action, admin CRUD, dan perubahan query.

## Tahap 1 - Dampak Paling Kecil, Cepat Dikerjakan

Status: selesai.

Catatan selesai:

- Label `Studio` sudah diganti menjadi `Principal` di sidebar About dan quick link footer.
- Hover project sudah menampilkan `Project Type`, bukan `Project Size`.
- Admin project form sudah memakai pilihan `Build`, `Design`, `Design and Build` pada field `Project Type` dengan field database existing `category`.
- Halaman Collaborators sudah diubah menjadi grid logo-only tanpa nama/teks terlihat.
- Verifikasi TypeScript berhasil dengan `tsc --noEmit --incremental false`.
- `npm run lint` belum bisa dijalankan dari shell ini karena `npm` tidak tersedia di PATH. Direct ESLint juga belum bisa dipakai karena konfigurasi repo masih `.eslintrc.json`, sementara ESLint lokal v9 mencari `eslint.config.*`.

### 1. Rename Studio menjadi Principal

Alasan:

- Hanya mengganti label menu dan copy.
- Tidak perlu migration database.
- Route bisa tetap `/about`, jadi tidak memecahkan link lama.

Scope:

- Ubah label `Studio` menjadi `Principal`.
- Pastikan halaman `/about` tetap menampilkan principal.
- Update quick link footer jika masih memakai label `About Studio`.

File utama:

- `src/components/about/about-sidebar.tsx`
- `src/components/global/projects-simple-footer.tsx`

Estimasi risiko: rendah.

### 2. Hover Project: Project Size menjadi Project Type

Alasan:

- Perubahan paling cepat jika memakai field `category` yang sudah ada.
- Tidak perlu migration jika tahap awal hanya mengganti label dan input admin menjadi select.

Scope tahap mudah:

- Ganti label hover `Project Size` menjadi `Project Type`.
- Tampilkan `project.type`.
- Ubah field admin `Category` menjadi `Project Type`.
- Pakai opsi `Build`, `Design`, `Design and Build`.

Catatan:

- Untuk jangka panjang lebih rapi memakai field baru `project_type`, tetapi itu masuk tahap database.

File utama:

- `src/components/projects/projects-grid-page.tsx`
- `src/app/admin/projects/page.tsx`
- `src/components/admin/admin-projects-table.tsx`

Estimasi risiko: rendah sampai sedang.

### 3. Collaborator Logo-only Grid

Alasan:

- Data collaborator sudah tersedia.
- Perubahan hanya pada tampilan publik.
- Admin tidak perlu diubah kecuali ingin preview logo lebih baik.

Scope:

- Ubah list vertikal menjadi grid logo.
- Sembunyikan nama company dan expertise dari tampilan utama.
- Tetap gunakan `alt` pada image.
- Gunakan grid responsive agar menyamping di desktop dan tetap rapi di mobile.

File utama:

- `src/app/about/collaborators/page.tsx`

Estimasi risiko: rendah.

## Tahap 2 - Dampak Kecil-Sedang

Status: selesai.

Catatan selesai:

- Efek typing pada hero sudah diganti menjadi fade-in, title ditampilkan utuh tanpa cursor typing.
- Project overlay sudah diubah menjadi pengalaman scroll: first viewport menampilkan image besar, section berikutnya menampilkan detail project, lalu section gallery/collage setelah scroll.
- Tombol close, prev, dan next tetap dipertahankan sebagai fixed controls.
- Verifikasi TypeScript berhasil dengan `tsc --noEmit --incremental false`.
- `npm run lint` masih belum bisa dijalankan dari shell ini karena `npm` tidak tersedia di PATH.

### 4. Typing Transition Diganti Fade

Alasan:

- Tidak menyentuh database.
- Namun efek transisi berada di hero utama, jadi perlu QA visual di homepage.

Scope:

- Hapus efek typing `useTypingText`.
- Render title langsung.
- Tambahkan fade transition untuk title/facts.
- Hapus cursor typing.

Rekomendasi teknis:

- Pakai Framer Motion karena dependency sudah ada dan `ProjectOverlay` sudah menggunakannya.

File utama:

- `src/components/landing/hero-content.tsx`
- `src/components/landing/hero-section.tsx`

Estimasi risiko: sedang rendah.

### 5. Project Image Besar Dulu, Collage Saat Scroll

Alasan:

- Tidak wajib migration database karena gallery sudah ada.
- Tapi component `ProjectOverlay` cukup besar dan punya banyak layout gallery, jadi risiko UI regression lebih tinggi.

Scope:

- Ubah overlay menjadi layout scroll.
- First viewport menampilkan cover image besar.
- Setelah scroll tampil detail project.
- Setelah detail tampil collage/gallery.
- Pastikan tombol close, prev, next tetap bekerja.
- Pastikan preview admin tetap usable.

File utama:

- `src/components/projects/project-overlay.tsx`
- `src/components/projects/projects-grid-page.tsx`
- `src/components/admin/admin-projects-table.tsx`

Estimasi risiko: sedang.

## Tahap 3 - Dampak Sedang, Mulai Menyentuh Admin/Data

Status: selesai.

Catatan selesai:

- Kolom `footer_heading` dan `footer_description` sudah ditambahkan lewat migration Supabase baru.
- `supabase/schema.sql` sudah diperbarui agar schema snapshot dan seed default memuat footer copy.
- Admin Studio Settings sudah memiliki field `Footer Heading` dan `Footer Description`.
- Public footer sekarang membaca heading dan description dari `site_settings`, dengan fallback agar tetap aman jika kolom belum tersedia.
- Server action `updateSiteSettings` sudah menyimpan footer heading dan footer description.
- Verifikasi TypeScript berhasil dengan `tsc --noEmit --incremental false`.

### 6. Footer Text Bisa Diatur di Admin Studio Settings

Alasan:

- Struktur `site_settings` sudah ada, jadi perubahan cukup terarah.
- Tetap butuh migration database dan update form admin.

Scope:

- Tambahkan kolom `footer_heading` dan `footer_description` ke `site_settings`.
- Tambahkan input textarea di admin settings.
- Update public settings reader.
- Footer membaca teks dari database dengan fallback.

File dan database:

- Migration Supabase untuk `site_settings`
- `supabase/schema.sql`
- `src/lib/public/site-settings.ts`
- `src/lib/admin/types.ts`
- `src/components/admin/admin-settings-form.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/actions.ts`
- `src/components/global/projects-simple-footer.tsx`

Estimasi risiko: sedang.

## Tahap 4 - Dampak Besar

Status: selesai.

Catatan selesai:

- Kolom `display_order` sudah ditambahkan lewat migration Supabase baru untuk table `portfolios`.
- `supabase/schema.sql` sudah diperbarui dengan `display_order` dan constraint non-negative.
- Public projects sekarang mengurutkan berdasarkan `display_order` saat kolom tersedia, dengan fallback ke urutan lama jika migration belum aktif.
- Admin project list sekarang menampilkan kolom `Order`.
- Admin create/edit project sekarang punya input `Display Order`.
- Admin project list sekarang mendukung drag-and-drop baris project dan tombol `Save Project Order`.
- Server action `upsertPortfolio` sudah menyimpan `display_order` dan punya fallback jika kolom belum aktif.
- Verifikasi TypeScript berhasil dengan `tsc --noEmit --incremental false`.

### 7. Urutan Project Bisa Diubah dari Admin

Alasan:

- Butuh kolom baru `display_order`.
- Butuh perubahan query publik dan admin.
- Butuh UI reorder di admin.
- Harus hati-hati agar urutan tidak conflict.

Scope:

- Tambah kolom `display_order` di `portfolios`.
- Public query order by `display_order`, lalu fallback date.
- Admin table menampilkan order.
- Buat action untuk simpan urutan.
- Tambahkan drag-and-drop atau tombol naik/turun.

Rekomendasi tahap awal:

- Mulai dengan input angka `Display Order` dulu agar lebih cepat.
- Setelah stabil, baru tambah drag-and-drop.

File dan database:

- Migration Supabase untuk `portfolios.display_order`
- `supabase/schema.sql`
- `src/lib/public/projects.ts`
- `src/lib/admin/repository.ts`
- `src/lib/admin/types.ts`
- `src/components/admin/admin-projects-table.tsx`
- `src/app/admin/actions.ts`

Estimasi risiko: sedang tinggi.

### 8. Services di About dan Admin Page

Status: selesai.

Catatan selesai:

- Table `services` sudah ditambahkan lewat migration Supabase baru, termasuk RLS dan policy admin.
- `supabase/schema.sql` sudah diperbarui dengan definisi table `services`.
- Public route `/about/services` sudah dibuat dan masuk ke sidebar About.
- Admin route `/admin/services` sudah dibuat untuk add, edit, delete, sort order, dan visibility Active/Hidden.
- Admin sidebar dan footer quick links sudah ditambah link Services.
- Public services punya fallback default jika table belum dimigrasikan.
- Verifikasi TypeScript berhasil dengan `tsc --noEmit --incremental false`.
- Browser QA dasar berhasil untuk `/about/services` dan `/projects`, tanpa console error.

Alasan:

- Ini fitur baru, bukan hanya revisi tampilan.
- Jika dibuat benar, perlu table baru, route publik baru, route admin baru, repository, actions, validasi, sidebar, dan QA.
- Dampaknya paling besar karena menambah modul baru ke sistem.

Scope rekomendasi:

- Tambah table `services`.
- Tambah public route `/about/services`.
- Tambah admin route `/admin/services`.
- Admin bisa create, edit, delete, reorder, active/inactive.
- About sidebar menampilkan `Services`.
- Admin sidebar menampilkan `Services`.

Alternatif cepat:

- Services dibuat statis dulu di `src/data/about.ts`.
- Admin CRUD dibuat setelah revisi visual selesai.

File dan database:

- Migration Supabase untuk table `services`
- `supabase/schema.sql`
- `src/app/about/services/page.tsx`
- `src/app/admin/services/page.tsx`
- `src/components/about/about-sidebar.tsx`
- `src/components/admin/admin-sidebar.tsx`
- `src/app/admin/actions.ts`
- `src/lib/admin/repository.ts`
- `src/lib/admin/types.ts`
- file public services reader

Estimasi risiko: tinggi.

## Urutan Eksekusi yang Disarankan

1. Rename `Studio` menjadi `Principal`.
2. Ganti hover `Project Size` menjadi `Project Type` memakai data yang sudah ada.
3. Ubah Collaborators menjadi logo-only grid.
4. Ganti typing transition menjadi fade.
5. Ubah project overlay: image besar dulu, collage setelah scroll.
6. Tambahkan footer heading/description ke admin Studio Settings.
7. Tambahkan project ordering.
8. Tambahkan Services public dan admin.

## Paket Pengerjaan Praktis

### Paket A - Quick Win UI

Isi:

- Principal label.
- Project Type hover.
- Collaborator logo grid.
- Typing ke fade.

Kenapa dulu:

- Cepat kelihatan hasilnya.
- Hampir tidak menyentuh database.
- Cocok untuk deploy revisi awal.

### Paket B - Project Experience

Isi:

- Project overlay image besar dulu.
- Collage muncul setelah scroll.

Kenapa dipisah:

- Perubahan visual cukup besar.
- Perlu QA desktop dan mobile lebih teliti.

### Paket C - Admin Settings

Isi:

- Footer heading dan footer description bisa diatur dari admin.

Kenapa setelah UI:

- Sudah mulai menyentuh database, tetapi masih di table yang existing.

### Paket D - Admin Ordering

Isi:

- Project display order.
- Admin reorder.

Kenapa setelah footer:

- Butuh perubahan data dan query publik/admin.

### Paket E - Services Module

Isi:

- Public services page/section.
- Admin services CRUD.

Kenapa terakhir:

- Modul baru dengan cakupan terbesar.

## Rekomendasi Final

Mulai dari Paket A. Setelah itu lanjut Paket B. Jika dua paket ini sudah aman secara visual, baru masuk perubahan database pada Paket C, D, dan E.

Untuk `Services`, kalau butuh cepat tampil dulu, buat versi statis di About pada awal pengerjaan. Admin CRUD services bisa menyusul sebagai tahap terakhir.
