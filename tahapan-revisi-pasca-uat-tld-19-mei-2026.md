# Tahapan Revisi Pasca-UAT TLD - Urutan Risiko Rendah ke Tinggi

Dokumen ini menyusun tahapan pengerjaan dari `planning-perbaikan-pasca-uat-tld-19-mei-2026.md` berdasarkan risiko implementasi, dampak ke UI/data, dan kebutuhan validasi.

## Prinsip Urutan

- Mulai dari validasi dan perubahan data/copy yang minim risiko.
- Pisahkan perubahan data project dari perubahan layout project overlay.
- Kerjakan perubahan UI besar setelah data dan konten stabil.
- Tutup dengan QA final dan build production.

## Ringkasan Urutan

1. Validasi baseline sebelum edit.
2. Finalisasi Contact/Footer link.
3. Update copy Services menjadi `DESIGN` dan `BUILD`.
4. Update urutan project.
5. Ganti Shangrila menjadi Raffles.
6. Perbaiki broken image About.
7. Optimasi loading gambar.
8. Revisi Project Overlay dan Gallery.
9. QA final dan build gate.

## Tahap 0 - Validasi Baseline Sebelum Edit

Risiko: sangat rendah.

Tujuan:

- Mengetahui kondisi aplikasi sebelum revisi.
- Memastikan error build atau runtime yang sudah ada tidak tercampur dengan perubahan baru.

Scope:

- Jalankan TypeScript check.
- Jalankan production build.
- Buka route publik utama:
  - `/`
  - `/projects`
  - `/about`
  - `/about/services`
  - `/contact`
- Catat error console, network error, broken image, dan link dummy.

Command:

```bash
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next build
```

Output:

- Baseline status build.
- Daftar masalah aktual sebelum revisi.
- UAT-37 dan UAT-38 bisa mulai divalidasi.

## Tahap 1 - Finalisasi Contact/Footer Link

Risiko: rendah.

Alasan:

- Mayoritas perubahan berupa update data `site_settings`.
- Dampak UI kecil dan mudah diverifikasi.

Scope:

- Update email General Inquiries.
- Update Instagram URL.
- Update LinkedIn URL.
- Update nomor telepon jika masih placeholder.
- Update alamat kantor jika masih placeholder.
- Pastikan fallback code tidak memakai link dummy.

Area terdampak:

- Supabase table `site_settings`
- `src/lib/public/site-settings.ts`
- `src/app/admin/settings/page.tsx`
- `src/app/contact/page.tsx`
- `src/components/global/projects-simple-footer.tsx`

Acceptance criteria:

- Link Instagram mengarah ke URL final.
- Link LinkedIn mengarah ke URL final.
- General Inquiries memakai email final.
- Contact page dan footer konsisten.

Catatan blocker:

- Butuh data final dari client jika belum tersedia.

## Tahap 2 - Update Copy Services Menjadi DESIGN dan BUILD

Risiko: rendah sampai sedang.

Alasan:

- Perubahan utama adalah konten.
- Dampaknya terbatas di `/about/services` dan admin services.

Scope:

- Update data services menjadi dua item utama:
  - `DESIGN`
  - `BUILD`
- Update fallback services agar sesuai dengan konten baru.
- Pastikan teks panjang tetap rapi di desktop dan mobile.

Copy target:

### DESIGN

We embody and harmonize our clients' passion with the beauty of art wrapped in a 2-dimensional design. The design process goes through five stages: Conceptual Design, Design Development, Document for Tender, Document for Construction, and Construction Supervision.

### BUILD

Not only do we embody the beauty of landscape art into 2-dimensional media, but we also dedicate ourselves to build the beauty into reality, which can be enjoyed directly. With the support of our complete set of construction equipment and planting nursery that has a wide variety of plants exclusively taken care of for our projects, we aim to build beautifully designed landscape architecture into life.

Area terdampak:

- Supabase table `services`
- `src/lib/public/services.ts`
- `src/app/about/services/page.tsx`
- `src/app/admin/services/page.tsx`
- `supabase/schema.sql` jika fallback/seed perlu disamakan

Acceptance criteria:

- `/about/services` menampilkan `DESIGN` dan `BUILD`.
- Tidak ada teks overflow di mobile.
- Admin services tetap bisa edit, hide, delete, dan reorder.

## Tahap 3 - Update Urutan Project

Risiko: rendah sampai sedang.

Alasan:

- Jika hanya mengubah `display_order`, perubahan relatif aman.
- Tidak perlu mengubah layout project grid.

Urutan target:

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

- Cek data project yang sudah ada.
- Update `display_order` sesuai urutan target.
- Verifikasi `/projects` desktop dan mobile.

Area terdampak:

- Supabase table `portfolios`
- `src/lib/public/projects.ts`
- `src/components/admin/admin-projects-table.tsx`

Acceptance criteria:

- Urutan di `/projects` sesuai list target.
- Urutan tetap konsisten setelah refresh.
- Admin table menunjukkan order yang sama.

## Tahap 4 - Ganti Shangrila Menjadi Raffles

Risiko: sedang.

Alasan:

- Tidak hanya rename teks; kemungkinan butuh asset cover/gallery baru.
- Jika slug berubah, perlu memastikan link dan data terkait tetap aman.

Scope:

- Identifikasi apakah record Shangrila akan di-rename menjadi Raffles atau diganti record baru.
- Update title, slug, location, client, cover image, dan gallery image sesuai data Raffles.
- Pastikan tidak ada project Shangrila yang masih tampil jika request client adalah penggantian penuh.

Area terdampak:

- Supabase table `portfolios`
- Supabase table `portfolio_gallery_items`
- Supabase table `media_assets`
- Public asset folder jika memakai local image

Acceptance criteria:

- `/projects` menampilkan Raffles di posisi ke-4.
- Tidak ada entry Shangrila pada public project list.
- Raffles punya cover dan gallery image yang valid.

Catatan blocker:

- Butuh asset final Raffles jika belum ada.

## Tahap 5 - Perbaiki Broken Image About

Risiko: sedang.

Alasan:

- Menyentuh render image halaman publik utama.
- Bisa berasal dari data Supabase, storage URL, atau komponen yang belum punya fallback.

Scope:

- Audit image principal/team dari Supabase Storage.
- Pastikan path dan bucket valid.
- Tambahkan fallback image untuk principal portrait di `/about`.
- Samakan pola fallback dengan `TeamMemberPortrait`.
- Cek hardcoded image di About Hero.

Area terdampak:

- `src/app/about/page.tsx`
- `src/components/about/team-member-portrait.tsx`
- `src/components/about/about-hero.tsx`
- `src/lib/public/about.ts`

Acceptance criteria:

- Tidak ada broken image di `/about`.
- Tidak ada broken image di `/about/people`.
- Jika image storage gagal, UI tetap menampilkan fallback yang rapi.

## Tahap 6 - Optimasi Loading Gambar Besar

Risiko: sedang.

Alasan:

- Perubahan optimasi image bisa mempengaruhi banyak route.
- Perlu hati-hati dengan Supabase Storage dan konfigurasi `next/image`.

Scope:

- Review penggunaan `unoptimized` pada image Supabase.
- Pastikan `next.config.ts` sudah mengizinkan hostname Supabase.
- Tambahkan atau koreksi `sizes` sesuai konteks.
- Gunakan `priority` hanya untuk image hero yang benar-benar first viewport.
- Biarkan gallery/list memakai lazy load default.
- Pastikan upload admin tetap mengonversi gambar ke WebP.

Area terdampak:

- `next.config.ts`
- `src/components/projects/project-overlay.tsx`
- `src/components/about/team-member-portrait.tsx`
- `src/components/admin/resource-form-dialog.tsx`
- `src/components/admin/project-gallery-dialog.tsx`
- `src/lib/admin/media.ts`

Acceptance criteria:

- Image tetap tampil normal dari Supabase Storage.
- Gambar besar tidak memblokir interaksi utama.
- Tidak ada regressi broken image.

## Tahap 7 - Revisi Project Overlay dan Gallery

Risiko: sedang tinggi.

Alasan:

- Ini perubahan UI terbesar.
- Menyentuh overlay, scroll behavior, gallery, dan mobile UX.
- Defect log memberi severity High untuk masalah scroll.

Scope:

- Perbaiki scroll overlay agar stabil di semua viewport.
- Ubah gallery dari collage menjadi satu gambar besar berurutan.
- Tampilkan maksimal 5 gambar gallery.
- Pertahankan alur:
  - hero image besar,
  - detail project,
  - gallery gambar besar yang bisa discroll.
- Pastikan `Next`, `Prev`, dan `Close` tetap berfungsi.
- Pastikan `Next` dan `Prev` reset scroll ke atas.
- Pastikan grid project utama di PC dan HP tidak berubah.

Area terdampak:

- `src/components/projects/project-overlay.tsx`
- `src/components/projects/projects-grid-page.tsx`

Acceptance criteria:

- Overlay bisa discroll di desktop, tablet, dan mobile.
- Detail project selalu bisa dibaca.
- Gallery bukan collage lagi.
- Gallery menampilkan maksimal 5 gambar besar.
- Tombol navigasi tidak overlap dengan konten penting.

## Tahap 8 - QA Final dan Build Gate

Risiko: rendah, wajib setelah semua revisi.

Scope desktop:

- `/`
- `/projects`
- Project overlay minimal 3 project
- `/about`
- `/about/people`
- `/about/services`
- `/contact`
- `/admin/projects`
- `/admin/services`
- `/admin/settings`

Scope mobile:

- `/projects`
- Project overlay sampai gallery
- `/about/services`
- `/contact`

Command:

```bash
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next build
```

Acceptance criteria:

- TypeScript check sukses.
- Production build sukses.
- UAT-37 dan UAT-38 bisa diberi status Pass.
- Tidak ada broken image pada route publik utama.
- Tidak ada link dummy tersisa pada route publik.
- Overlay project bisa discroll di viewport kecil.

## Rekomendasi Paket Pengerjaan

### Paket A - Low Risk Data dan Copy

Isi:

- Tahap 0: baseline validation.
- Tahap 1: contact/footer links.
- Tahap 2: services DESIGN/BUILD.
- Tahap 3: project order.

Kenapa dulu:

- Cepat diverifikasi.
- Risiko regresi UI rendah.
- Memberi progress yang terlihat tanpa menyentuh layout besar.

### Paket B - Data dan Asset Project

Isi:

- Tahap 4: Shangrila menjadi Raffles.
- Tahap 5: broken image About.

Kenapa dipisah:

- Membutuhkan audit asset dan data.
- Bisa terblokir asset final dari client.

### Paket C - Image Performance dan Project UX

Isi:

- Tahap 6: optimasi loading gambar.
- Tahap 7: revisi overlay/gallery.

Kenapa terakhir:

- Paling berisiko terhadap UX.
- Butuh QA visual desktop/mobile lebih teliti.

### Paket D - Final Verification

Isi:

- Tahap 8: QA final dan build gate.

Kenapa wajib:

- Menutup UAT-37 dan UAT-38.
- Memastikan semua revisi siap deploy.
