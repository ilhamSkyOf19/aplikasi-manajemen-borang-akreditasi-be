# Rencana Kerja Lanjutan: Service Dokumentasi Borang

## Tujuan Umum

Melanjutkan pengembangan fitur **Dokumentasi Borang** agar proses pengumpulan dokumen dapat berjalan dengan rapi, aman, dan sesuai dengan kebutuhan sistem.

Fitur ini digunakan untuk mengelola dokumentasi borang berdasarkan kebutuhan dokumentasi yang telah disetujui. Dokumentasi borang dapat berisi file yang diupload langsung, file yang dimasukkan ke dalam folder, maupun file lama yang digunakan kembali.

---

## 1. Konsep Cara Kerja

Alur kerja fitur dokumentasi borang adalah sebagai berikut:

1. Sistem menerima request pembuatan dokumentasi borang berdasarkan `kebutuhan_dokumentasi_id`.
2. Sistem mengecek apakah kebutuhan dokumentasi tersedia.
3. Sistem membuat atau menggunakan data `DokumentasiBorang` yang sudah ada.
4. Jika request menggunakan folder baru, sistem membuat data `FolderDokumen`.
5. Jika request menggunakan folder lama, sistem menggunakan `old_folder`.
6. Jika request tidak menggunakan folder, file akan langsung masuk ke dokumentasi borang.
7. Sistem memproses file satu per satu.
8. Jika menggunakan file lama, sistem mengecek data file berdasarkan `old_file`.
9. Jika menggunakan file baru, sistem menyimpan file ke storage sesuai `storage_provider`.
10. Sistem membuat data `FileDokumen`.
11. Sistem membuat detail file default pada `FileDokumenDefault`.
12. Sistem membuat relasi file ke dokumentasi borang melalui tabel pivot `DokumentasiBorangFile`.
13. Sistem mengembalikan response yang siap digunakan frontend.

---

## 2. Konsep Relasi Database

Struktur relasi yang digunakan:

```txt
KebutuhanDokumentasi
  └── DokumentasiBorang
        ├── FolderDokumen
        └── DokumentasiBorangFile
              └── FileDokumen
                    └── FileDokumenDefault
```

Penjelasan:

- `KebutuhanDokumentasi` adalah data kebutuhan dokumen yang harus dipenuhi.
- `DokumentasiBorang` adalah wadah utama dokumentasi untuk satu kebutuhan dokumentasi.
- `FolderDokumen` digunakan untuk mengelompokkan file dalam satu dokumentasi borang.
- `FileDokumen` adalah master file yang dapat digunakan ulang.
- `DokumentasiBorangFile` adalah tabel pivot antara dokumentasi borang dan file.
- `FileDokumenDefault` menyimpan metadata tambahan khusus file default.

---

## 3. Aturan Dokumentasi Borang

Dokumentasi borang tidak boleh selalu dibuat baru setiap kali upload file.

Aturan yang digunakan:

```txt
1 KebutuhanDokumentasi hanya memiliki 1 DokumentasiBorang.
1 DokumentasiBorang dapat memiliki banyak folder.
1 DokumentasiBorang dapat memiliki banyak file.
```

Untuk menjaga aturan tersebut, `kebutuhan_dokumentasi_id` pada model `DokumentasiBorang` perlu dibuat unique.

Contoh:

```prisma
model DokumentasiBorang {
  id                       Int      @id @default(autoincrement())
  kebutuhan_dokumentasi_id Int      @unique
  status                   Status   @default(PENDING)
  keterangan               String   @db.VarChar(1000)
  created_at               DateTime @default(now())
  updated_at               DateTime @updatedAt

  kebutuhan_dokumentasi KebutuhanDokumentasi @relation(fields: [kebutuhan_dokumentasi_id], references: [id], onDelete: Cascade)

  folders FolderDokumen[]
  files   DokumentasiBorangFile[]

  @@map("dokumentasi_borang")
}
```

---

## 4. Aturan Folder Dokumen

Folder dokumen bersifat optional.

Kemungkinan penggunaan folder:

### A. Menggunakan Folder Baru

Jika request mengirim `new_folder`, sistem akan membuat folder baru.

```txt
new_folder ada
-> create FolderDokumen
```

### B. Menggunakan Folder Lama

Jika request mengirim `old_folder`, sistem akan menggunakan folder yang sudah ada.

```txt
old_folder ada
-> gunakan folder lama
```

### C. Tanpa Folder

Jika tidak menggunakan folder, maka file langsung masuk ke dokumentasi borang.

```txt
new_folder kosong
old_folder kosong
-> folder_dokumen_id = null
```

Aturan tambahan:

```txt
new_folder dan old_folder tidak boleh diisi bersamaan.
```

---

## 5. Aturan File Dokumen

File dokumen dapat berasal dari dua sumber:

### A. File Lama

Jika request mengirim `old_file`, maka sistem akan:

1. Mengecek apakah file lama tersedia.
2. Jika file tidak ditemukan, sistem mengembalikan error.
3. Jika file ditemukan, file digunakan kembali.
4. Sistem tidak membuat data baru di `FileDokumen`.

Aturan:

```txt
Jika old_file ada, maka nama_file dan storage_provider tidak boleh diisi.
```

---

### B. File Baru

Jika request mengirim `nama_file`, maka sistem akan:

1. Mengambil file dari `req.files`.
2. Menentukan storage berdasarkan `storage_provider`.
3. Jika storage `SISTEM`, file disimpan ke folder server.
4. Jika storage `GDRIVE`, file diupload ke Google Drive.
5. Sistem membuat data baru di `FileDokumen`.
6. Sistem membuat data detail di `FileDokumenDefault`.
7. Sistem menghubungkan file ke dokumentasi borang.

Aturan:

```txt
Jika nama_file ada, maka storage_provider wajib diisi.
Jika nama_file ada, maka old_file tidak boleh diisi.
```

---

## 6. Upload File

Upload file menggunakan `multer.memoryStorage()`.

Dengan penggunaan memory storage:

```txt
req.files tidak perlu dihapus manual.
```

File hanya perlu dihapus jika sudah benar-benar tersimpan ke:

- folder sistem;
- Google Drive.

Jika salah satu proses upload gagal, maka file yang sudah sempat berhasil diupload harus dibersihkan.

Data yang perlu dibersihkan:

```txt
uploadedGDriveIds
uploadedSistemPaths
```

Contoh cleanup:

```ts
await Promise.all(
  uploadedGDriveIds.map((id) => DriveApiService.deleteFile(id)),
);

uploadedSistemPaths.forEach((path) => FileService.deleteFile(path));
```

---

## 7. Transaction

Proses create dokumentasi borang harus menggunakan transaction agar data tetap konsisten.

Alur transaction:

```txt
cek kebutuhan dokumentasi
-> create atau ambil DokumentasiBorang
-> create folder jika ada
-> loop file
   -> cek file lama atau create file baru
   -> create detail file default jika file baru
   -> create pivot DokumentasiBorangFile
-> return response
```

Catatan:

- Jika ada proses yang gagal, semua proses database harus dibatalkan.
- Jangan menggunakan `return null` setelah ada proses create di dalam transaction.
- Gunakan `throw` agar transaction melakukan rollback.

---

## 8. Validasi Request

Validasi request perlu memastikan:

- `kebutuhan_dokumentasi_id` wajib number positif.
- `new_folder` dan `old_folder` tidak boleh diisi bersamaan.
- `old_file` dan `nama_file` tidak boleh diisi bersamaan.
- Jika `old_file` ada, `storage_provider` harus kosong.
- Jika `nama_file` ada, `storage_provider` wajib ada.
- `keterangan` file wajib diisi.
- `storage_provider` hanya boleh `SISTEM` atau `GDRIVE`.
- Data folder tidak boleh duplikat.
- Data file lama harus benar-benar tersedia di database.

---

## 9. Response

Response create dokumentasi borang dibuat sederhana.

Data yang dapat dikembalikan:

```ts
{
  dokumentasi_borang_id: number;
  folder_dokumen_id?: number | null;
  file_dokumen_id: number[];
  keterangan: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
}
```

Response tidak perlu terlalu lengkap karena detail lengkap dapat diambil melalui endpoint detail.

---

## 10. Debugging

Hal yang perlu dicek:

- Request `files` dari multipart berhasil diparse dari JSON string menjadi array.
- `req.files` sesuai dengan jumlah file baru yang dikirim.
- File lama tidak mengambil data dari `req.files`.
- File baru mengambil data dari `req.files`.
- Folder baru berhasil dibuat.
- Folder lama berhasil digunakan.
- File tanpa folder berhasil disimpan dengan `folder_dokumen_id = null`.
- File dengan folder berhasil disimpan dengan `folder_dokumen_id`.
- File yang gagal upload melakukan cleanup.
- Transaction rollback jika ada error.
- Constraint folder duplikat berjalan.
- Error Prisma `P2002` dan `P2003` ditangani dengan baik.

---

## 11. Prioritas Pengerjaan

Urutan pengerjaan yang disarankan:

1. Menyesuaikan schema `DokumentasiBorang`.
2. Menambahkan unique pada `kebutuhan_dokumentasi_id`.
3. Membuat migration Prisma.
4. Membuat validation request dokumentasi borang.
5. Membuat helper upload file dari request.
6. Membuat cleanup file sistem dan Google Drive.
7. Membuat service create dokumentasi borang default.
8. Menambahkan pengecekan kebutuhan dokumentasi.
9. Membuat atau mengambil `DokumentasiBorang`.
10. Membuat folder jika ada `new_folder`.
11. Menggunakan folder lama jika ada `old_folder`.
12. Memproses file lama dan file baru.
13. Membuat pivot `DokumentasiBorangFile`.
14. Membuat response sederhana.
15. Debug semua skenario request.
16. Refactor service agar lebih rapi.

---

## Checklist

- [✅] Konsep relasi dokumentasi borang selesai.
- [✅] Konsep 1 kebutuhan dokumentasi memiliki 1 dokumentasi borang selesai.
- [✅] Konsep folder dalam dokumentasi borang selesai.
- [✅] Konsep file langsung tanpa folder selesai.
- [✅] Konsep file dalam folder selesai.
- [✅] Konsep file lama dapat digunakan ulang selesai.
- [✅] Konsep `FileDokumen` sebagai master file selesai.
- [✅] Konsep `DokumentasiBorangFile` sebagai pivot selesai.
- [✅] Konsep `FileDokumenDefault` sebagai metadata file default selesai.
- [✅] Validasi old file dan new file selesai.
- [✅] Validasi folder lama dan folder baru selesai.
- [✅] Helper upload file dari request selesai.
- [✅] Cleanup file Google Drive selesai.
- [✅] Cleanup file sistem selesai.
- [✅] Pembahasan `multer.memoryStorage()` selesai.
- [✅] Pemahaman bahwa `req.files` tidak perlu dihapus selesai.
- [✅] Service create default mulai disusun.
- [✅] Transaction create dokumentasi borang selesai.
- [✅] Debug error `files.map is not a function` selesai.
- [✅] Debug error JSON tidak valid selesai.
- [✅] Debug error Prisma `Unknown argument` selesai.
- [✅] Debug error Prisma foreign key selesai.
- [✅] Pembahasan constraint folder duplikat selesai.
- [✅] Pembahasan penggunaan `Set` untuk cek data duplikat selesai.

---

## Catatan Tambahan

Poin penting dari fitur ini adalah memastikan bahwa `DokumentasiBorang` tidak selalu dibuat baru.

Jika selalu dibuat baru, maka folder dan file akan tersebar ke banyak wadah dokumentasi. Hal ini membuat constraint seperti:

```prisma
@@unique([dokumentasi_borang_id, nama_folder])
```

tidak berjalan sesuai tujuan, karena setiap folder akan masuk ke `dokumentasi_borang_id` yang berbeda.

Pola akhir yang digunakan:

```txt
cek kebutuhan dokumentasi
-> ambil atau buat DokumentasiBorang
-> buat atau gunakan folder
-> proses file
-> simpan pivot
-> return response
```
