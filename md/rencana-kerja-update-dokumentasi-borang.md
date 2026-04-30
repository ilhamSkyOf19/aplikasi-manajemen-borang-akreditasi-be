# Update Dokumentasi Borang

## Request

```ts
export interface UpdateDokumentasiBorangDefaultRequestType {
  dokumentasi_borang_id: number;
  file_dokumen_id: number;
  folder_id?: number;
  files?: string;
}
```

## Alur

- controller akan cek apakah dokumentasi borang ada
- selanjutnya di cek apakah folder id ada , set ke variabel folder id jika ada
- temukan data file dokumen berdasarkan request file dokumen id
- selanjutnya cek files nya , jika ada maka lakukan pengecekan files apakah pakai file lama atau buat file baru
- jika buat file baru lakukan upload file dan kemudian cek apakah apakah file tersebut active jika tidak active maka hapus file nya
- jika pakai file lama pastikan file tersebut id nya tidak sama seperti file dokumen id yang akan di ubah nya
- selanjutnya update data nya
