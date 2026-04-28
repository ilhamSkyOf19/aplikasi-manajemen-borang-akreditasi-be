# Rencana Kerja Lanjutan: Get Riwayat by Kebutuhan Dokumentasi ID

## Tujuan Umum

Membuat service untuk menampilkan seluruh data **riwayat** berdasarkan `kebutuhan_dokumentasi_id`.

Fitur ini digunakan agar frontend dapat menampilkan daftar perubahan atau catatan verifikasi dari satu data kebutuhan dokumentasi tertentu.

---

## 1. Konsep Cara Kerja

Alur kerja fitur get riwayat berdasarkan kebutuhan dokumentasi ID adalah sebagai berikut:

1. Frontend mengirim request dengan membawa `kebutuhan_dokumentasi_id`.
2. Backend melakukan validasi params.
3. Service mengecek apakah data kebutuhan dokumentasi tersedia.
4. Jika data kebutuhan dokumentasi tidak ditemukan, sistem mengembalikan error `404`.
5. Jika data ditemukan, sistem mengambil seluruh data riwayat yang memiliki relasi dengan kebutuhan dokumentasi tersebut.
6. Data riwayat ditampilkan berdasarkan urutan terbaru.
7. Response dikembalikan ke frontend dalam bentuk list.

---

## 2. Endpoint

Endpoint yang disarankan:

```ts
GET /api/kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id/riwayat
```

Alasan endpoint ini lebih rapi karena data riwayat yang ditampilkan berada dalam konteks satu data kebutuhan dokumentasi.

Alternatif endpoint:

```ts
GET /api/riwayat/kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id
```

Namun rekomendasi utama tetap:

```ts
GET /api/kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id/riwayat
```

---

## 3. Debugging

Hal yang perlu dicek saat debugging:

- Params `kebutuhan_dokumentasi_id` berhasil divalidasi.
- ID yang dikirim dari frontend benar.
- Jika data kebutuhan dokumentasi tidak ditemukan, response `404` muncul.
- Jika data kebutuhan dokumentasi ditemukan tetapi belum memiliki riwayat, response tetap berhasil dengan array kosong.
- Riwayat tampil berdasarkan `created_at` terbaru.
- Pagination berjalan dengan benar jika digunakan.
- ACL sudah sesuai dengan role yang boleh melihat riwayat.
- Response success dan error sudah konsisten.
- Tidak terjadi error `Cannot set headers after they are sent`.

---

## 12. Prioritas Pengerjaan

Urutan pengerjaan yang disarankan:

1. Membuat validation params `kebutuhan_dokumentasi_id`.
2. Membuat validation query pagination.
3. Membuat service `findAllByKebutuhanDokumentasiId`.
4. Menambahkan pengecekan data kebutuhan dokumentasi.
5. Membuat query get riwayat berdasarkan kebutuhan dokumentasi ID.
6. Menambahkan pagination jika diperlukan.
7. Membuat controller.
8. Membuat route.
9. Menambahkan ACL.
10. Testing ketika data kebutuhan dokumentasi ditemukan.
11. Testing ketika data kebutuhan dokumentasi tidak ditemukan.
12. Testing ketika riwayat masih kosong.
13. Refactor kode.

---

## Checklist

- [✅] Validation params `kebutuhan_dokumentasi_id` selesai.
- [✅] Validation query pagination selesai.
- [✅] Service `findAllByKebutuhanDokumentasiId` selesai.
- [✅] Cek data kebutuhan dokumentasi berdasarkan ID selesai.
- [✅] Query find all riwayat berdasarkan kebutuhan dokumentasi ID selesai.
- [✅] Sorting berdasarkan `created_at` selesai.
- [✅] Pagination selesai.
- [✅] Controller selesai.
- [✅] Route selesai.
- [✅] ACL selesai.
- [✅] Response success selesai.
- [✅] Response error selesai.
- [✅] Testing data ditemukan selesai.
- [✅] Testing data tidak ditemukan selesai.
- [✅] Testing riwayat kosong selesai.
- [✅] Refactor kode selesai.

---
