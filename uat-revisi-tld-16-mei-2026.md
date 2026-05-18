# UAT Revisi TLD - 16 Mei 2026

Dokumen ini berisi skenario User Acceptance Test untuk fitur yang berubah berdasarkan `planning-pengerjaan-revisi-tld-16-mei-2026.md`.

## Prasyarat

- Aplikasi dapat diakses di environment test.
- User admin dapat login ke `/admin`.
- Migration database revisi sudah diterapkan:
  - `20260518_site_settings_footer_copy.sql`
  - `20260518_portfolio_display_order.sql`
  - `20260518_services.sql`
- Browser test minimal: Chrome desktop dan mobile viewport.

## Format Status

- `Pass`: hasil sesuai ekspektasi.
- `Fail`: hasil tidak sesuai ekspektasi.
- `Blocked`: tidak bisa dites karena akses/data/environment belum siap.

## 1. Label Studio Menjadi Principal

### UAT-01 - Sidebar About Menampilkan Principal

Langkah:

1. Buka halaman `/about`.
2. Lihat sidebar About.

Ekspektasi:

- Menu pertama bertuliskan `Principal`.
- Tidak ada label `Studio` pada sidebar About.
- Link `Principal` tetap mengarah ke `/about`.

Status: `___`

### UAT-02 - Footer Quick Links Menampilkan Principal

Langkah:

1. Buka halaman publik mana saja yang memiliki footer, misalnya `/projects`.
2. Lihat bagian `Quick Links` di footer.

Ekspektasi:

- Link About di footer bertuliskan `Principal`.
- Link `Principal` mengarah ke `/about`.

Status: `___`

## 2. Project Type Menggantikan Project Size di Hover Project

### UAT-03 - Hover Card Project Menampilkan Project Type

Langkah:

1. Buka `/projects`.
2. Hover salah satu kartu project.

Ekspektasi:

- Overlay hover muncul.
- Label yang tampil adalah `Project Type`.
- Tidak ada label `Project Size` pada hover card.
- Value project type tampil, misalnya `Build`, `Design`, atau `Design and Build`.

Status: `___`

### UAT-04 - Admin Project Form Memiliki Field Project Type

Langkah:

1. Login ke `/admin`.
2. Buka `/admin/projects`.
3. Klik `New Project`.
4. Cek field pada form.

Ekspektasi:

- Ada field `Project Type`.
- Pilihan yang tersedia:
  - `Build`
  - `Design`
  - `Design and Build`
- Field `Category` tidak lagi tampil sebagai input utama untuk tipe project.

Status: `___`

### UAT-05 - Edit Project Type dari Admin

Langkah:

1. Buka `/admin/projects`.
2. Edit salah satu project.
3. Ubah `Project Type` menjadi salah satu value lain.
4. Simpan.
5. Buka `/projects`.
6. Hover project yang diedit.

Ekspektasi:

- Data berhasil tersimpan.
- Hover project menampilkan project type terbaru.

Status: `___`

## 3. Collaborator Logo-only Grid

### UAT-06 - Collaborators Tampil sebagai Grid Logo

Langkah:

1. Buka `/about/collaborators`.
2. Lihat daftar collaborators.

Ekspektasi:

- Collaborators tampil dalam grid menyamping.
- Yang terlihat hanya logo.
- Nama company dan expertise tidak tampil sebagai teks utama.
- Logo tetap rapi di desktop.

Status: `___`

### UAT-07 - Collaborator Grid di Mobile

Langkah:

1. Buka `/about/collaborators` dengan mobile viewport.
2. Scroll halaman collaborators.

Ekspektasi:

- Grid berubah responsif.
- Logo tidak saling overlap.
- Logo tetap berada di dalam kotak masing-masing.

Status: `___`

## 4. Hero Transition dari Typing ke Fade

### UAT-08 - Hero Tidak Lagi Menggunakan Efek Typing

Langkah:

1. Buka homepage `/`.
2. Tunggu sampai hero project tampil.
3. Amati title hero saat muncul dan saat berganti project.

Ekspektasi:

- Title tampil utuh, bukan muncul huruf per huruf.
- Tidak ada cursor typing yang berkedip di akhir title.
- Perubahan title menggunakan transisi fade.

Status: `___`

### UAT-09 - Fade Hero Tidak Mengganggu Fakta Project

Langkah:

1. Buka homepage `/`.
2. Tunggu pergantian hero.
3. Amati teks fakta project seperti location/type/status jika tampil.

Ekspektasi:

- Teks fakta tetap terbaca.
- Tidak ada teks yang overlap.
- Tidak ada flicker berlebihan saat transisi.

Status: `___`

## 5. Project Overlay: Image Besar Dulu, Collage Setelah Scroll

### UAT-10 - Overlay Project Dibuka dari Grid

Langkah:

1. Buka `/projects`.
2. Klik salah satu project.

Ekspektasi:

- Overlay project terbuka.
- Tampilan awal overlay menampilkan 1 image besar sebagai hero.
- Judul dan lokasi project tampil di atas image.
- Tombol close tersedia.

Status: `___`

### UAT-11 - Detail Project Muncul Setelah Scroll

Langkah:

1. Dengan overlay project masih terbuka, scroll ke bawah.

Ekspektasi:

- Section detail project tampil setelah hero image.
- Informasi seperti `Project Type`, `Status`, `Date`, `Client`, dan consultant/architect tampil jika datanya tersedia.
- Deskripsi project tampil jika tersedia.

Status: `___`

### UAT-12 - Collage/Gallery Muncul Setelah Detail

Langkah:

1. Dengan overlay project masih terbuka, lanjut scroll ke bawah sampai section gallery.

Ekspektasi:

- Section `Project Collage` tampil.
- Gallery/collage image tampil setelah detail project.
- Image tidak blank.
- Layout tetap rapi di desktop.

Status: `___`

### UAT-13 - Navigasi Prev/Next dan Close Tetap Berfungsi

Langkah:

1. Buka overlay project dari `/projects`.
2. Klik `Next`.
3. Klik `Prev`.
4. Klik tombol close.

Ekspektasi:

- `Next` berpindah ke project berikutnya.
- `Prev` berpindah ke project sebelumnya.
- Setelah klik `Next` atau `Prev`, tampilan overlay otomatis kembali ke bagian paling atas/image besar project baru.
- Tombol close menutup overlay dan kembali ke grid project.

Status: `___`

### UAT-13A - Overlay Auto Scroll ke Atas Saat Next/Prev dari Posisi Bawah

Langkah:

1. Buka `/projects`.
2. Klik salah satu project.
3. Scroll overlay sampai bagian detail atau `Project Collage`.
4. Klik `Next`.
5. Ulangi dari posisi bawah, lalu klik `Prev`.

Ekspektasi:

- Setelah klik `Next`, project berubah dan overlay kembali ke bagian image besar paling atas.
- Setelah klik `Prev`, project berubah dan overlay kembali ke bagian image besar paling atas.
- User tidak tertinggal di posisi scroll bawah dari project sebelumnya.

Status: `___`

### UAT-14 - Overlay Project di Mobile

Langkah:

1. Buka `/projects` dengan mobile viewport.
2. Klik salah satu project.
3. Scroll overlay sampai gallery.

Ekspektasi:

- Hero image tampil sebagai image besar di awal.
- Detail project tampil setelah scroll.
- Gallery tampil setelah detail.
- Tidak ada teks/image overlap.
- Tombol close, prev, dan next tetap dapat diklik.

Status: `___`

## 6. Footer Copy Bisa Diatur dari Admin Studio Settings

### UAT-15 - Field Footer Copy Tampil di Admin

Langkah:

1. Login ke `/admin`.
2. Buka `/admin/settings`.
3. Cari section `Footer Copy`.

Ekspektasi:

- Field `Footer Heading` tersedia.
- Field `Footer Description` tersedia.
- Kedua field terisi default copy footer saat ini.

Status: `___`

### UAT-16 - Simpan Footer Copy dari Admin

Langkah:

1. Buka `/admin/settings`.
2. Ubah `Footer Heading`.
3. Ubah `Footer Description`.
4. Klik `Save Settings`.
5. Buka halaman publik dengan footer, misalnya `/projects`.

Ekspektasi:

- Admin menampilkan notifikasi berhasil.
- Footer publik menampilkan heading baru.
- Footer publik menampilkan description baru.
- Data tetap sama setelah halaman di-refresh.

Status: `___`

### UAT-17 - Validasi Footer Copy

Langkah:

1. Buka `/admin/settings`.
2. Kosongkan `Footer Heading`.
3. Klik `Save Settings`.

Ekspektasi:

- Data tidak tersimpan.
- Admin menampilkan error validasi.

Status: `___`

## 7. Project Ordering dari Admin

### UAT-18 - Field Display Order Tampil di Admin Project

Langkah:

1. Login ke `/admin`.
2. Buka `/admin/projects`.
3. Lihat table project.
4. Klik edit salah satu project.

Ekspektasi:

- Table project memiliki kolom `Order`.
- Form edit project memiliki field `Display Order`.
- Form create project juga memiliki field `Display Order`.

Status: `___`

### UAT-19 - Ubah Urutan Project

Langkah:

1. Buka `/admin/projects`.
2. Pilih satu project yang mudah dikenali.
3. Drag baris project tersebut ke posisi urutan yang diinginkan.
4. Klik `Save Project Order`.
5. Buka `/projects`.

Ekspektasi:

- Project yang dipindahkan naik/turun sesuai posisi drag-and-drop.
- Urutan project publik mengikuti angka `Display Order` dari kecil ke besar.

Status: `___`

### UAT-20 - Reset Order Mengembalikan Perubahan Drag sebelum Disimpan

Langkah:

1. Buka `/admin/projects`.
2. Drag salah satu project ke posisi lain.
3. Klik `Reset Order` sebelum klik save.

Ekspektasi:

- Urutan table kembali seperti sebelum drag.
- Tombol save kembali disabled jika tidak ada perubahan.

Status: `___`

### UAT-21 - Display Order Tidak Boleh Negatif

Langkah:

1. Buka edit project di `/admin/projects`.
2. Isi `Display Order` dengan angka negatif, misalnya `-1`.
3. Simpan.

Ekspektasi:

- Data tidak tersimpan.
- Muncul error validasi atau input tidak menerima angka negatif.

Status: `___`

## 8. Services Public dan Admin

### UAT-22 - Menu Services Tampil di About Sidebar

Langkah:

1. Buka `/about`.
2. Lihat sidebar About.

Ekspektasi:

- Ada menu `Services`.
- Klik `Services` mengarah ke `/about/services`.

Status: `___`

### UAT-23 - Halaman Public Services Tampil

Langkah:

1. Buka `/about/services`.

Ekspektasi:

- Halaman menampilkan heading `SERVICES`.
- Daftar services tampil.
- Setiap service menampilkan title dan description jika tersedia.
- Layout rapi di desktop dan mobile.

Status: `___`

### UAT-24 - Menu Services Tampil di Admin Sidebar

Langkah:

1. Login ke `/admin`.
2. Lihat sidebar admin.

Ekspektasi:

- Ada menu `SERVICES`.
- Klik menu tersebut membuka `/admin/services`.

Status: `___`

### UAT-25 - Tambah Service Baru dari Admin

Langkah:

1. Buka `/admin/services`.
2. Klik `Add Service`.
3. Isi:
   - `Service Title`
   - `Description`
   - `Sort Order`
   - `Visibility = Active`
4. Simpan.
5. Buka `/about/services`.

Ekspektasi:

- Service berhasil tersimpan.
- Service baru tampil di halaman publik `/about/services`.
- Posisi service mengikuti `Sort Order`.

Status: `___`

### UAT-26 - Edit Service dari Admin

Langkah:

1. Buka `/admin/services`.
2. Edit salah satu service.
3. Ubah title atau description.
4. Simpan.
5. Buka `/about/services`.

Ekspektasi:

- Perubahan berhasil tersimpan.
- Halaman publik menampilkan data service terbaru.

Status: `___`

### UAT-27 - Hide Service dari Public Page

Langkah:

1. Buka `/admin/services`.
2. Edit salah satu service.
3. Ubah `Visibility` menjadi `Hidden`.
4. Simpan.
5. Buka `/about/services`.

Ekspektasi:

- Service tetap ada di admin.
- Service tidak tampil di halaman publik.

Status: `___`

### UAT-28 - Delete Service dari Admin

Langkah:

1. Buka `/admin/services`.
2. Klik delete pada salah satu service test.
3. Konfirmasi delete.
4. Buka `/about/services`.

Ekspektasi:

- Service hilang dari admin list.
- Service tidak tampil di halaman publik.

Status: `___`

## 9. Revisi Video Intro Client

### UAT-29 - Video Intro Menggunakan File yang Diinginkan Client

Langkah:

1. Buka homepage `/` dari sesi browser baru atau incognito.
2. Amati video intro yang tampil sebelum masuk ke website.
3. Bandingkan visual video dengan file/video referensi dari client.

Ekspektasi:

- Video intro yang tampil adalah video terbaru sesuai request client.
- Tidak ada video lama yang masih muncul.
- Durasi dan visual utama sesuai file yang diberikan client.

Status: `___`

### UAT-30 - Video Intro Dapat Diputar Tanpa Error

Langkah:

1. Buka homepage `/`.
2. Tunggu video intro tampil.
3. Amati playback video selama beberapa detik.

Ekspektasi:

- Video dapat dimuat.
- Video berjalan tanpa blank screen.
- Tidak muncul broken media icon.
- Tidak ada error playback yang terlihat di browser.

Status: `___`

### UAT-31 - User Tetap Bisa Masuk ke Website Setelah Video

Langkah:

1. Buka homepage `/`.
2. Saat video intro tampil, klik area intro atau ikuti interaksi masuk website yang tersedia.
3. Tunggu sampai homepage utama tampil.

Ekspektasi:

- User bisa masuk ke website.
- Intro tidak mengunci halaman.
- Homepage utama tampil setelah intro dilewati.

Status: `___`

### UAT-31A - Status Intro Direset Saat Pindah ke Halaman Lain

Langkah:

1. Buka homepage `/`.
2. Klik intro untuk masuk ke website.
3. Pastikan localStorage memiliki key `has-seen-intro-v1`.
4. Pindah ke halaman lain, misalnya `/projects` atau `/about`.
5. Cek localStorage.
6. Kembali ke homepage `/`.

Ekspektasi:

- Saat berada di halaman selain `/`, key `has-seen-intro-v1` terhapus dari localStorage.
- Saat kembali ke homepage, intro dapat tampil kembali.

Status: `___`

### UAT-32 - Video Intro Responsif di Mobile

Langkah:

1. Buka homepage `/` dengan mobile viewport.
2. Amati tampilan video intro.

Ekspektasi:

- Video tetap tampil proporsional di mobile.
- Tidak ada area hitam/blank berlebihan.
- Text atau tombol intro tidak overlap dengan video secara mengganggu.
- User tetap bisa masuk ke website dari mobile.

Status: `___`

## 10. Regression Ringan untuk Fitur yang Tersentuh

### UAT-33 - Halaman Projects Tetap Bisa Dibuka

Langkah:

1. Buka `/projects`.

Ekspektasi:

- Grid project tampil.
- Hover project bekerja.
- Klik project membuka overlay.

Status: `___`

### UAT-34 - Halaman About Utama Tetap Bisa Dibuka

Langkah:

1. Buka `/about`.

Ekspektasi:

- Halaman Principal tampil.
- Sidebar About tampil lengkap:
  - `Principal`
  - `People`
  - `Services`
  - `Collaborators`
  - `Awards`

Status: `___`

### UAT-35 - Sidebar Admin Tetap Setinggi Layar Saat Scroll

Langkah:

1. Login ke `/admin`.
2. Buka halaman admin yang kontennya panjang, misalnya `/admin/projects` atau `/admin/services`.
3. Scroll area konten utama ke bawah.
4. Amati sidebar admin di sisi kiri.

Ekspektasi:

- Sidebar admin hanya setinggi layar viewport.
- Sidebar tidak memanjang mengikuti tinggi konten.
- Sidebar tetap berada di posisi yang sama saat konten utama discroll.
- Yang bergerak hanya area konten utama di sisi kanan.

Status: `___`

### UAT-36 - Footer Tetap Tampil di Halaman Publik

Langkah:

1. Buka `/projects`.
2. Scroll ke footer.
3. Buka `/about/services`.
4. Scroll ke footer.

Ekspektasi:

- Footer tampil di kedua halaman.
- Link `Principal` dan `Services` tersedia di Quick Links.
- Contact dan social link tetap tampil.

Status: `___`

## 11. Build Production untuk Vercel

### UAT-37 - Build Production Berhasil

Langkah:

1. Jalankan build production sesuai command deployment project.
2. Untuk environment lokal saat ini dapat menggunakan:

```bash
node node_modules/next/dist/bin/next build
```

Ekspektasi:

- Build selesai dengan status sukses.
- Tidak ada error compile.
- Semua route utama berhasil masuk output build, termasuk:
  - `/`
  - `/projects`
  - `/about`
  - `/about/services`
  - `/admin/projects`
  - `/admin/services`
  - `/admin/settings`

Status: `___`

### UAT-38 - Build Tidak Terblokir Warning

Langkah:

1. Jalankan build production.
2. Amati output lint/build.

Ekspektasi:

- Warning boleh muncul selama tidak menggagalkan build.
- Tidak ada error yang menyebabkan build berhenti.
- Build dapat dilanjutkan untuk deployment Vercel.

Status: `___`

## Catatan Hasil UAT

Tester:

Tanggal:

Environment:

Catatan:

- 

Keputusan:

- `Diterima`
- `Diterima dengan catatan`
- `Ditolak`
