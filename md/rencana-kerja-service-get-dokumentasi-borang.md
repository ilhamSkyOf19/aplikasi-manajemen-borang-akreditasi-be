# Rencana Kerja Lanjutan: Get Dokumentasi Borang

## Tujuan Umum

Membuat service untuk menampilkan data dokumentasi borang, folder, dan file yang sudah diunggah berdasarkan kebutuhan dokumentasi.

---

## 1. Get All Dokumentasi Borang

### Tujuan

Menampilkan seluruh dokumentasi borang yang sudah dibuat.

### Cakupan Pekerjaan

- Membuat service get all dokumentasi borang.
- Menampilkan data kebutuhan dokumentasi.
- Menampilkan status dokumentasi borang.
- Menampilkan keterangan dokumentasi borang.
- Menampilkan jumlah folder.
- Menampilkan jumlah file.
- Menambahkan pagination.
- Menambahkan search jika diperlukan.
- Menambahkan filter berdasarkan status.
- Menambahkan sorting berdasarkan `created_at` atau `updated_at`.

### Checklist

- [ ] Service get all dokumentasi borang selesai.
- [ ] Query pagination selesai.
- [ ] Query search selesai.
- [ ] Filter status selesai.
- [ ] Sorting selesai.
- [ ] Response list selesai.
- [ ] Controller get all selesai.
- [ ] Route get all selesai.
- [ ] Testing get all selesai.

---

## 2. Get Detail Dokumentasi Borang

### Tujuan

Menampilkan detail dokumentasi borang berdasarkan ID.

### Cakupan Pekerjaan

- Mengambil data dokumentasi borang berdasarkan ID.
- Menampilkan data kebutuhan dokumentasi.
- Menampilkan folder yang dimiliki dokumentasi borang.
- Menampilkan file langsung tanpa folder.
- Menampilkan file yang berada di dalam folder.
- Menampilkan detail file dokumen.
- Menampilkan metadata file default jika ada.

### Checklist

- [ ] Service detail dokumentasi borang selesai.
- [ ] Cek dokumentasi borang berdasarkan ID selesai.
- [ ] Query folder selesai.
- [ ] Query file langsung selesai.
- [ ] Query file dalam folder selesai.
- [ ] Query metadata file default selesai.
- [ ] Controller detail selesai.
- [ ] Route detail selesai.
- [ ] Testing detail selesai.

---

## 3. Get File by Folder

### Tujuan

Menampilkan seluruh file yang berada di dalam satu folder dokumentasi borang.

### Cakupan Pekerjaan

- Menerima `folder_dokumen_id` dari params.
- Mengecek apakah folder tersedia.
- Mengambil semua file berdasarkan `folder_dokumen_id`.
- Menampilkan data file dokumen.
- Menampilkan keterangan file dari pivot `DokumentasiBorangFile`.
- Menampilkan status file.
- Menampilkan metadata default file jika ada.
- Mengembalikan array kosong jika folder ada tetapi belum memiliki file.

### Checklist

- [ ] Validation params `folder_dokumen_id` selesai.
- [ ] Service get file by folder selesai.
- [ ] Cek folder berdasarkan ID selesai.
- [ ] Query file berdasarkan folder selesai.
- [ ] Query detail file selesai.
- [ ] Query metadata file default selesai.
- [ ] Controller get file by folder selesai.
- [ ] Route get file by folder selesai.
- [ ] Testing folder ditemukan selesai.
- [ ] Testing folder tidak ditemukan selesai.
- [ ] Testing folder kosong selesai.

---

## 4. Get File Tanpa Folder

### Tujuan

Menampilkan file yang langsung berada di dokumentasi borang tanpa folder.

### Cakupan Pekerjaan

- Menerima `dokumentasi_borang_id`.
- Mengecek apakah dokumentasi borang tersedia.
- Mengambil file dengan `folder_dokumen_id = null`.
- Menampilkan data file dokumen.
- Menampilkan keterangan file.
- Menampilkan status file.
- Menampilkan metadata default jika ada.

### Checklist

- [ ] Validation params `dokumentasi_borang_id` selesai.
- [ ] Service get file tanpa folder selesai.
- [ ] Query file dengan `folder_dokumen_id = null` selesai.
- [ ] Controller selesai.
- [ ] Route selesai.
- [ ] Testing file tanpa folder selesai.

---

## 5. Endpoint yang Direncanakan

```ts
GET /api/dokumentasi-borang
GET /api/dokumentasi-borang/:id
GET /api/dokumentasi-borang/:id/files
GET /api/folder-dokumen/:folder_dokumen_id/files
```
