# Rencana Kerja Lanjutan: Service Verifikasi Kebutuhan Dokumentasi dan PIC

## Tujuan Umum

Membuat service untuk fitur **Verifikasi Kebutuhan Dokumentasi dan PIC** agar Wakil Dekan I dapat memeriksa data kebutuhan dokumentasi dan PIC yang diajukan oleh Kaprodi.

Fitur ini berfungsi untuk mengubah status verifikasi menjadi:

- `pending`
- `revision`
- `approved`

Selain itu, setiap proses verifikasi harus menyimpan **keterangan verifikasi** dan otomatis terintegrasi dengan **riwayat** sebagai catatan perubahan data.

---

## 1. Konsep Cara Kerja

Alur kerja fitur verifikasi kebutuhan dokumentasi dan PIC adalah sebagai berikut:

1. Kaprodi membuat atau mengajukan data kebutuhan dokumentasi dan PIC.
2. Data yang baru diajukan memiliki status awal `pending`.
3. Wakil Dekan I melihat daftar kebutuhan dokumentasi dan PIC yang perlu diverifikasi.
4. Wakil Dekan I melakukan verifikasi terhadap data tersebut.
5. Jika data belum sesuai, Wakil Dekan I memberi status `revision` dan wajib mengisi keterangan revisi.
6. Jika data sudah sesuai, Wakil Dekan I memberi status `approved`.
7. Sistem menyimpan perubahan status dan keterangan verifikasi.
8. Sistem otomatis membuat data riwayat verifikasi.
9. Kaprodi dapat melihat status hasil verifikasi dan keterangan yang diberikan.

---

## 2. Status Verifikasi

### A. Pending

Status `pending` digunakan ketika data kebutuhan dokumentasi dan PIC masih menunggu proses pemeriksaan dari Wakil Dekan I.

Kondisi:

- Data baru diajukan.
- Belum ada keputusan verifikasi.
- Belum perlu ada keterangan khusus.

---

### B. Revision

Status `revision` digunakan ketika data kebutuhan dokumentasi dan PIC belum sesuai dan perlu diperbaiki oleh Kaprodi.

Kondisi:

- Wakil Dekan I menemukan data yang belum tepat.
- Keterangan verifikasi wajib diisi.
- Kaprodi perlu memperbaiki data sesuai catatan yang diberikan.

Contoh keterangan:

```ts
"Nama dokumentasi masih terlalu umum, harap diperjelas sesuai kebutuhan akreditasi.";
```

---

### C. Approved

Status `approved` digunakan ketika data kebutuhan dokumentasi dan PIC sudah dianggap benar dan dapat dilanjutkan ke tahap berikutnya.

Kondisi:

- Data kebutuhan dokumentasi sudah sesuai.
- PIC sudah sesuai.
- Data siap didistribusikan atau digunakan pada proses berikutnya.

---

## 3. Request Verifikasi

### Endpoint

```ts
PATCH /api/kebutuhan-dokumentasi-pic/verifikasi/:id
```

### Params

```ts
{
  id: number;
}
```

### Body Request

```ts
{
  status: "pending" | "revision" | "approved",
  keterangan?: string
}
```

### Aturan Validasi

- `id` wajib berupa number positif.
- `status` wajib salah satu dari:
  - `pending`
  - `revision`
  - `approved`
- `keterangan` wajib diisi jika status bernilai `revision`.
- `keterangan` boleh kosong jika status bernilai `approved`.
- Data kebutuhan dokumentasi dan PIC harus ditemukan sebelum status diperbarui.

---

## 4. Cara Kerja Service Verifikasi

Service verifikasi bertanggung jawab untuk menjalankan proses berikut:

1. Menerima `id`, `status`, dan `keterangan` dari controller.
2. Mengecek apakah data kebutuhan dokumentasi dan PIC tersedia.
3. Jika data tidak ditemukan, sistem mengembalikan error `404`.
4. Melakukan validasi tambahan berdasarkan status:
   - jika status `revision`, maka keterangan wajib ada;
   - jika status `approved`, maka keterangan bersifat optional.
5. Mengubah status kebutuhan dokumentasi dan PIC.
6. Menyimpan keterangan verifikasi.
7. Membuat data riwayat berdasarkan hasil verifikasi.
8. Mengembalikan response terbaru ke frontend.

---

## 5. Integrasi dengan Riwayat

Setiap proses verifikasi harus membuat data riwayat agar perubahan dapat dilacak.

Data riwayat dapat menyimpan informasi seperti:

- ID kebutuhan dokumentasi dan PIC.
- Status verifikasi terbaru.
- Keterangan verifikasi.
- User yang melakukan verifikasi.
- Waktu verifikasi dilakukan.

Contoh data riwayat:

```ts
{
  kebutuhan_dokumentasi_pic_id: 1,
  status: "revision",
  keterangan: "PIC belum sesuai dengan bidang tugas.",
  created_by: 2
}
```

---

## 6. Transaction

Jika proses verifikasi melibatkan lebih dari satu operasi database, gunakan transaction.

Contoh operasi yang perlu berada dalam transaction:

1. Update status kebutuhan dokumentasi dan PIC.
2. Simpan keterangan verifikasi.
3. Buat data riwayat.

Tujuannya agar jika salah satu proses gagal, semua proses dibatalkan dan database tetap aman.

---

## 7. Response Berhasil

Contoh response ketika verifikasi berhasil:

```ts
{
  meta: {
    statusCode: 200,
    message: "Verifikasi kebutuhan dokumentasi dan PIC berhasil"
  },
  data: {
    id: 1,
    status: "revision",
    keterangan: "Nama dokumentasi perlu diperjelas.",
    updated_at: "2026-04-27T10:00:00.000Z"
  }
}
```

---

## 8. Response Error

### Data Tidak Ditemukan

```ts
{
  meta: {
    statusCode: 404,
    message: "Data kebutuhan dokumentasi dan PIC tidak ditemukan"
  },
  data: null
}
```

### Keterangan Revisi Kosong

```ts
{
  meta: {
    statusCode: 400,
    message: "Keterangan wajib diisi jika status revision"
  },
  data: null
}
```

### Status Tidak Valid

```ts
{
  meta: {
    statusCode: 400,
    message: "Status verifikasi tidak valid"
  },
  data: null
}
```

---

## 9. Debugging

Hal yang perlu dicek saat debugging:

- Endpoint verifikasi dapat diakses oleh role Wakil Dekan I.
- Body request berhasil divalidasi.
- Status hanya menerima `pending`, `revision`, dan `approved`.
- Jika status `revision`, keterangan wajib diisi.
- Jika data tidak ditemukan, response error sesuai.
- Jika update status berhasil, data riwayat ikut dibuat.
- Transaction berjalan dengan aman.
- Response success dan error tetap konsisten.
- Tidak terjadi error `Cannot set headers after they are sent`.

---

## 10. Prioritas Pengerjaan

Urutan pengerjaan yang disarankan:

1. Membuat validation untuk verifikasi.
2. Membuat controller verifikasi.
3. Membuat service verifikasi.
4. Membuat route verifikasi.
5. Menambahkan ACL agar hanya Wakil Dekan I yang dapat melakukan verifikasi.
6. Menghubungkan verifikasi dengan riwayat.
7. Membuat transaction untuk update status dan create riwayat.
8. Melakukan testing status `pending`.
9. Melakukan testing status `revision`.
10. Melakukan testing status `approved`.
11. Debug error response.
12. Refactor service agar lebih rapi.

---

## Checklist

- [✅] Validation body verifikasi selesai.
- [✅] Enum status `pending`, `revision`, dan `approved` selesai.
- [✅] Controller verifikasi selesai.
- [✅] Service verifikasi selesai.
- [✅] Route verifikasi selesai.
- [✅] ACL Wakil Dekan I selesai.
- [✅] Update status verifikasi selesai.
- [✅] Validasi keterangan wajib untuk status `revision` selesai.
- [✅] Integrasi dengan riwayat selesai.
- [✅] Transaction update status dan create riwayat selesai.
- [✅] Response success sudah konsisten.
- [✅] Response error sudah konsisten.
- [✅] Debug endpoint status `pending` selesai.
- [✅] Debug endpoint status `revision` selesai.
- [✅] Debug endpoint status `approved` selesai.
- [✅] Refactor kode selesai.

---

## Catatan Tambahan

Jika enum status pada database masih menggunakan bahasa Indonesia seperti:

- `menunggu`
- `revisi`
- `disetujui`

maka status request dapat disesuaikan dengan mapping berikut:

```ts
pending = menunggu;
revision = revisi;
approved = disetujui;
```

Namun jika ingin lebih konsisten dengan request frontend, enum database juga dapat dibuat menggunakan:

```ts
pending;
revision;
approved;
```
