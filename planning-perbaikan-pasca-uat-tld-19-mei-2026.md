# Planning Perbaikan Pasca-UAT TLD - 19 Mei 2026

Dokumen ini dibuat dari:

- `C:\Users\Administrator\Downloads\UAT Checklist Revisi TLD - 16 Mei 2026 (1).docx`
- `C:\Users\Administrator\Downloads\UAT Checklist Revisi TLD - 16 Mei 2026 (2).docx`
- `C:\Users\Administrator\Downloads\UAT Checklist Revisi TLD - 16 Mei 2026.pdf`
- `C:\Users\Administrator\Downloads\Revisi web.pdf`

## Ringkasan Kondisi

Mayoritas skenario UAT sudah berstatus Pass. Perbaikan yang masih perlu dikerjakan berasal dari defect log dan catatan tambahan PDF:

- About Page: beberapa aset gambar gagal dimuat.
- Project Detail Overlay: scroll detail project gagal di beberapa ukuran viewport.
- Image Loader: gambar resolusi besar terlalu lambat dimuat.
- Contact Page/Footer: beberapa external link masih dummy.
- Revisi PDF: urutan project perlu disesuaikan, Shangrila diganti Raffles, tampilan PC/HP jangan berubah.
- Revisi PDF: gallery project tidak lagi memakai tampilan collage; tampilkan satu gambar besar yang bisa discroll, dengan total 5 gambar gallery.
- Revisi PDF: copy Services perlu diganti menjadi konten `DESIGN` dan `BUILD`.
- UAT-37 dan UAT-38 belum ditandai Pass karena build production belum diverifikasi.

## Prioritas Eksekusi

### P0 - Validasi Baseline Sebelum Edit

Tujuan:

- Mengetahui kondisi build dan bug aktual sebelum menyentuh kode.

Scope:

- Jalankan production build:
  - `node node_modules/next/dist/bin/next build`
- Buka halaman utama untuk baseline visual:
  - `/`
  - `/projects`
  - `/about`
  - `/about/services`
  - `/contact`
- Catat error console dan network untuk image yang gagal load.

Output:

- Status UAT-37 dan UAT-38 bisa ditentukan.
- Daftar URL image/link yang benar-benar gagal saat runtime.

Estimasi risiko: rendah.

### P1 - Perbaiki Scroll dan Gallery Project Detail

Alasan:

- Defect log memberi severity High.
- Bug ini menghambat pembacaan deskripsi project.
- Catatan PDF terbaru juga mengubah arah desain dari collage menjadi satu gambar besar berurutan.

Scope:

- Ubah project gallery dari collage templates menjadi list/sequence gambar besar.
- Tampilkan maksimal 5 gambar di section `Project Gallery`.
- Pertahankan alur:
  - hero image besar pertama,
  - detail project,
  - gallery gambar besar yang discroll.
- Pastikan overlay hanya punya satu scroll container yang stabil.
- Ganti penggunaan `h-screen` yang kaku di gallery menjadi ukuran berbasis viewport yang aman seperti `min-h-[100dvh]`, `max-h`, atau `aspect-ratio`.
- Pastikan `Next` dan `Prev` tetap reset scroll ke atas.
- QA desktop dan mobile agar tampilan PC/HP tidak berubah di grid project utama.

File utama:

- `src/components/projects/project-overlay.tsx`
- `src/components/projects/projects-grid-page.tsx`

Acceptance criteria:

- Overlay bisa discroll di desktop, tablet, dan mobile viewport.
- Detail project selalu bisa dibaca.
- Gallery menampilkan satu gambar besar per bagian, bukan collage.
- Total gambar gallery mengikuti data admin, tetapi dibatasi 5 gambar untuk memenuhi request PDF.
- Tidak ada teks/tombol yang overlap dengan bottom navigation.

Estimasi risiko: sedang tinggi.

### P2 - Perbaiki Aset Gambar About yang Gagal Load

Alasan:

- Defect log severity Medium.
- Halaman About adalah halaman publik utama dan saat ini image principal di `src/app/about/page.tsx` belum punya fallback client-side seperti team directory.

Scope:

- Audit sumber image team/principal dari Supabase Storage.
- Pastikan path dan bucket image valid.
- Tambahkan fallback image pada principal portrait di halaman `/about`.
- Samakan pola fallback dengan `TeamMemberPortrait`.
- Cek hardcoded image di `src/components/about/about-hero.tsx`.
- Jika error berasal dari data Supabase, update data `team_members.image_path` dari admin/database.

File utama:

- `src/app/about/page.tsx`
- `src/components/about/team-member-portrait.tsx`
- `src/components/about/about-hero.tsx`
- `src/lib/public/about.ts`

Acceptance criteria:

- Tidak ada broken image di `/about` dan `/about/people`.
- Jika storage image gagal, UI menampilkan fallback yang rapi.
- Console/browser network tidak menunjukkan image 404 untuk asset About.

Estimasi risiko: sedang.

### P3 - Optimasi Loading Gambar Besar

Alasan:

- Defect log menyebut loading gambar terlalu lambat.
- Code saat ini beberapa tempat memberi `unoptimized` untuk Supabase Storage, padahal `next.config.ts` sudah memiliki `remotePatterns` untuk Supabase.

Scope:

- Review semua penggunaan `unoptimized` untuk Supabase image.
- Lepas `unoptimized` di area publik jika URL sudah cocok dengan `next.config.ts`.
- Pastikan `sizes`, `priority`, dan `quality` terpasang sesuai konteks:
  - hero project/home: boleh `priority`;
  - gallery/list: lazy load default;
  - thumbnail grid: `sizes` kecil.
- Pastikan upload admin tetap mengonversi gambar ke WebP.
- Jika image masih berat, kompres ulang asset lama di Supabase/public.

File utama:

- `next.config.ts`
- `src/components/projects/project-overlay.tsx`
- `src/components/about/team-member-portrait.tsx`
- `src/components/admin/resource-form-dialog.tsx`
- `src/components/admin/project-gallery-dialog.tsx`
- `src/lib/admin/media.ts`

Acceptance criteria:

- Gambar besar tidak lagi memblokir interaksi utama.
- Tidak ada regressi image render di Supabase Storage.
- Lighthouse/manual network check menunjukkan ukuran transfer lebih masuk akal.

Estimasi risiko: sedang.

### P4 - Update Data Project: Order dan Raffles

Alasan:

- Catatan PDF meminta urutan project spesifik.
- Catatan PDF juga menyebut `Shangrila diganti raffles`.

Urutan yang diminta:

1. St Regis Bali
2. St Regis Jkt
3. Radisson Blu
4. Raffles
5. Sofitel
6. Bajo Well
7. Likupang
8. IKN
9. Anantara
10. Four Season
11. Alila
12. Fairmont

Scope:

- Cek data `portfolios` di admin/database.
- Update `display_order` sesuai urutan di atas.
- Rename/replace project Shangrila menjadi Raffles jika memang record yang sama.
- Update slug, title, cover image, gallery image, dan metadata terkait Raffles.
- Pastikan perubahan dilakukan lewat admin jika memungkinkan; gunakan SQL migration/data patch hanya jika perlu repeatable untuk deploy.

File/database utama:

- Supabase table `portfolios`
- Supabase table `portfolio_gallery_items`
- Supabase table `media_assets`
- `src/lib/public/projects.ts`
- `src/components/admin/admin-projects-table.tsx`

Acceptance criteria:

- `/projects` menampilkan urutan sesuai PDF di desktop dan mobile.
- Tidak ada entry Shangrila jika client meminta diganti Raffles.
- Raffles memiliki cover/gallery image yang valid.

Estimasi risiko: sedang, tergantung kelengkapan asset Raffles.

### P5 - Update Copy Services Menjadi DESIGN dan BUILD

Alasan:

- Catatan PDF memberikan copy services baru.
- Saat ini fallback/public services masih berisi beberapa service generic.

Copy target:

#### DESIGN

We embody and harmonize our clients' passion with the beauty of art wrapped in a 2-dimensional design. The design process goes through five stages: Conceptual Design, Design Development, Document for Tender, Document for Construction, and Construction Supervision.

#### BUILD

Not only do we embody the beauty of landscape art into 2-dimensional media, but we also dedicate ourselves to build the beauty into reality, which can be enjoyed directly. With the support of our complete set of construction equipment and planting nursery that has a wide variety of plants exclusively taken care of for our projects, we aim to build beautifully designed landscape architecture into life.

Scope:

- Update data services di admin/database menjadi dua item utama:
  - `DESIGN`
  - `BUILD`
- Update fallback services agar tetap sama jika database belum tersedia.
- Pastikan halaman `/about/services` rapi untuk teks panjang.
- Jika perlu, gunakan layout dua kolom di desktop dan stacked di mobile.

File/database utama:

- Supabase table `services`
- `supabase/migrations/20260518_services.sql` atau data patch baru
- `supabase/schema.sql`
- `src/lib/public/services.ts`
- `src/app/about/services/page.tsx`
- `src/app/admin/services/page.tsx`

Acceptance criteria:

- `/about/services` hanya menampilkan service yang sesuai request client.
- Text panjang tidak overflow di mobile.
- Admin services tetap bisa edit, hide, delete, dan reorder.

Estimasi risiko: rendah sampai sedang.

### P6 - Finalisasi Contact/Footer Link

Alasan:

- Defect log menyebut link Instagram, LinkedIn, dan General Inquiries masih dummy.
- Sebagian nilai link berasal dari `site_settings`, jadi perbaikannya bisa berupa update data, bukan perubahan kode besar.

Scope:

- Minta atau konfirmasi data final dari client:
  - email General Inquiries,
  - nomor telepon,
  - Instagram URL,
  - LinkedIn URL,
  - alamat kantor.
- Update lewat `/admin/settings` jika environment sudah terhubung.
- Jika perlu repeatable untuk deploy, update seed/default di schema/migration.
- Pastikan fallback di code tidak lagi memakai placeholder yang terlihat dummy.

File/database utama:

- Supabase table `site_settings`
- `src/lib/public/site-settings.ts`
- `src/app/admin/settings/page.tsx`
- `src/components/global/projects-simple-footer.tsx`
- `src/app/contact/page.tsx`

Acceptance criteria:

- Semua link eksternal mengarah ke URL final.
- General Inquiries memakai email final.
- Link footer dan contact page konsisten.

Estimasi risiko: rendah, blocker-nya data final client.

### P7 - QA Regression dan Build Gate

Scope QA:

- Desktop:
  - `/`
  - `/projects`
  - project overlay untuk minimal 3 project
  - `/about`
  - `/about/people`
  - `/about/services`
  - `/contact`
  - `/admin/projects`
  - `/admin/services`
  - `/admin/settings`
- Mobile viewport:
  - `/projects`
  - project overlay scroll sampai gallery
  - `/about/services`
  - `/contact`
- Command:
  - `node node_modules/typescript/bin/tsc --noEmit --incremental false`
  - `node node_modules/next/dist/bin/next build`

Acceptance criteria:

- UAT-37 dan UAT-38 bisa diberi status Pass.
- Tidak ada compile error.
- Tidak ada broken image pada route publik utama.
- Overlay project bisa discroll di viewport kecil.
- Link dummy tidak tersisa pada route publik.

## Urutan Praktis

1. Jalankan baseline build dan browser QA singkat.
2. Perbaiki project overlay scroll dan ubah gallery menjadi single-image sequence.
3. Perbaiki broken image About.
4. Optimasi image loading Supabase/public.
5. Update data project order dan Raffles.
6. Update copy Services menjadi DESIGN/BUILD.
7. Finalisasi contact/footer links setelah data client tersedia.
8. Jalankan TypeScript, production build, dan QA desktop/mobile.

## Catatan Risiko

- Perubahan gallery dari collage ke single-image sequence adalah perubahan UX terbesar; perlu validasi visual desktop dan mobile.
- Data Raffles membutuhkan asset final. Jika asset belum tersedia, pekerjaan bisa selesai sebagian dengan placeholder, tetapi belum layak go-live.
- Link dummy tidak bisa benar-benar ditutup tanpa data final dari client.
- Jika database production belum memiliki migration terbaru, update data order/services/site settings harus dilakukan setelah migration diterapkan.
