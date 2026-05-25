## Rencana Kerja Lanjutan

- [✅] Membuat API Service update nama folder
- [✅] Membuat API Service file dokumen detail
- [✅] Membuat API Service update data file default
- [✅] Membuat API Service preview file sistem and google drive

## Rencana kerja

- [✅] Membuat tabel distribusi dan membuat service create distribusi yang disisipkan pada service kriteria
- [✅] membuat service untuk file dokumen penelitian
- [✅] membuat service delete from dokumentasi borang untuk file dokumen penelitian
- [✅] Membuat service untuk schema distribusi kebutuhan dokumentasi

- [✅] Membuat service get untuk data monitoring dokumentasi borang -> menyesuaikan ui front end

- [✅] Memperbaiki service notifikasi, notifikasi hanya di berikan untuk :
  1. Tim akreditasi
     - Mengirim notifikasi ke kaprodi saat setelah mengajukan dokumentasi
     - Menerima notifikasi revisi atau setuju dari kaprodi
  2. Kaprodi
     - Menerima notifikasi pengajuan dari tim akreditasi
     - Mengirim notifikasi ke tim akreditasi ketika memberikan revisi atau setuju
     - Mengirim notifikasi ke wd 1 bahwa sudah membuat dokumentasi borang dan butuh verifikasi
     - Menerima notifikasi dari wd 1 terkait hasil verifikasi

  3. wd 1
     - Menerima notifikasi dari kaprodi
     - Mengirin notifikasi ke kaprodi

- [✅] Memperbaiki service dari notfikasi -> buat lebih spesifik lagi untuk memisahkan tipe notifikasi nya [kebutuhan dokumentasi, verifikasi kebutuhan dokumentasi, dokumentasi borang, verifikasi dokumentasi borang]

## Urgent

- [✅] Membuat api service ubah password

- [✅] Menambahkan field active ke data periode

- [✅] Debug data periode

- [✅] Melanjutkan perbaikan terhadap periode pada setiap api yang membutuhkan

- [✅] Membuat sebuah container lagi untuk membuat priode akreditasi , jadi kedudukan paling tinggi adalah priode bukan kriteria.

## Urgent

- [✅] Membuat sebuah api lagi untuk timeline dari pengerjaan dan lain lain.
- [✅] Membuat api search file untuk mempercepat pencarian file , dengan response
- [✅] Membuat api untuk dokumen panduan cara menyusun borang akreditasi

- [✅] Membuat api download dan upload dokumen panduan

- [✅] Menyesuaikan lagi data timeline -> tambahkan is active pada setiap deadline

- [✅] Membuat api service lupa password dengan email

- [ ] Filter role tim akreditasi terhadap service search all file agar mencari file berdasarkan kriteria yang menjadi tanggung jawab nya

- [ ] Membuat api service ganti file pada service file dokumen
