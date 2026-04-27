# Rencana Kerja Lanjutan: Service Kebutuhan Dokumentasi dan PIC

## Tujuan Umum

Melanjutkan pengembangan fitur **Kebutuhan Dokumentasi dan PIC** agar memiliki alur backend yang lengkap, rapi, dan siap digunakan oleh frontend. Fokus pekerjaan mencakup penyelesaian service, pembuatan route, validasi request, debugging, serta implementasi CRUD penuh.

## 1. Membuat Validation

### Tujuan

Membuat validasi request agar data yang masuk ke controller sudah bersih dan sesuai kebutuhan service.

### Cakupan Pekerjaan

- Membuat validation untuk create kebutuhan dokumentasi dan PIC.
- Membuat validation untuk update kebutuhan dokumentasi dan PIC.
- Membuat validation untuk params seperti `id`.
- Membuat validasi enum untuk `tipe_dokumentasi`.
- Memastikan field optional tetap aman untuk kebutuhan PATCH.

### Contoh Validasi yang Dibutuhkan

- `kriteria_id` harus number positif.
- `pendekatan_id` harus number positif.
- `nama_dokumentasi_id` optional number positif.
- `nama_dokumentasi_new` optional string.
- `pic_id` optional number positif.
- `pic_new` optional string.
- `tipe_dokumentasi` wajib sesuai enum.
- `keterangan` wajib string.

### Catatan

Validasi tidak hanya mengecek tipe data, tetapi juga mendukung alur bisnis:

- `nama_dokumentasi_id` dan `nama_dokumentasi_new` tidak boleh diisi bersamaan.
- `pic_id` dan `pic_new` tidak boleh diisi bersamaan.
- Salah satu dari data lama atau data baru wajib diisi.

## 2. Membuat CRUD Full

### A. Create

Membuat kebutuhan dokumentasi dan PIC baru.

Cakupan:

- menerima data dari request body;
- membuat data baru jika diperlukan;
- menggunakan data lama jika ID tersedia;
- menyimpan relasi kebutuhan dokumentasi dan PIC;
- mengembalikan response yang rapi.

---

### B. Read / Get All

Menampilkan daftar kebutuhan dokumentasi dan PIC.

Cakupan:

- pagination;
- search;
- filter berdasarkan status;
- filter berdasarkan kriteria;
- filter berdasarkan pendekatan;
- filter berdasarkan tipe dokumentasi;
- sorting berdasarkan `created_at` atau `updated_at`.

Contoh query:

```ts
?page=1&limit=10&search=dokumen&status=pending&sort=desc
```

---

### C. Detail / Get By ID

Menampilkan detail kebutuhan dokumentasi dan PIC berdasarkan ID.

Cakupan:

- mengambil data kebutuhan dokumentasi;
- mengambil data kriteria;
- mengambil data pendekatan;
- mengambil data nama dokumentasi;
- mengambil data PIC;
- mengembalikan response detail yang siap dipakai frontend.

---

### D. Update

Mengubah data kebutuhan dokumentasi dan PIC.

Cakupan:

- semua field bersifat optional;
- update hanya field yang dikirim;
- menangani perubahan nama dokumentasi;
- menangani perubahan PIC;
- menangani perubahan tipe dokumentasi dan keterangan;
- validasi data lama dan data baru tidak boleh bentrok.

Catatan:
Jika update melibatkan relasi pivot atau daftar banyak data, gunakan transaction.

---

### E. Delete

Menghapus kebutuhan dokumentasi dan PIC.

Cakupan:

- cek data berdasarkan ID;
- hapus data jika ditemukan;
- tangani error jika data tidak ditemukan;
- pastikan tidak menghapus data yang masih berelasi penting jika belum aman.

---

## 3. Debugging

### Tujuan

Memastikan seluruh endpoint berjalan sesuai alur dan tidak menghasilkan error runtime.

### Hal yang Perlu Dicek

- Validasi request sudah berjalan.
- Error helper tidak menyebabkan `Cannot set headers after they are sent`.
- Response error dan success konsisten.
- Data lama dan data baru tidak bisa dikirim bersamaan.
- Jika data lama tidak ditemukan, response error sesuai.
- Jika data baru dibuat, ID hasil create digunakan dengan benar.
- Transaction berjalan aman jika ada lebih dari satu operasi database.
- Prisma error seperti `P2002`, `P2003`, dan `P2025` sudah ditangani error middleware.

## 8. Prioritas Pengerjaan

Urutan pengerjaan yang disarankan:

1. Selesaikan `create service`.
2. Buat validation create.
3. Buat route create.
4. Debug create sampai stabil.
5. Buat get all dengan pagination dan filter.
6. Buat detail by ID.
7. Buat update.
8. Buat riwayat
9. Buat delete.
10. Debug semua endpoint.
11. Refactor kode agar lebih bersih.

---

## Checklist

- [✅] Service create selesai.
- [✅] Validation create selesai.
- [✅] Route create selesai.
- [✅] Endpoint create berhasil dites.
- [✅] Service get all selesai.
- [✅] Pagination selesai.
- [✅] Search dan filter selesai.
- [✅] Detail by ID selesai.
- [✅] Update selesai.
- [✅] Buat Riwayat selesai.
- [✅] Delete selesai.
- [✅] Error handler dicek.
- [✅] Response sudah konsisten.
- [✅] Refactor controller dan service.
