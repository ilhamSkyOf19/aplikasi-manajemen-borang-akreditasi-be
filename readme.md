# Aplikasi Manajemen Borang Akreditasi - Backend

Backend REST API untuk **Aplikasi Manajemen Borang Akreditasi Fakultas Ilmu Komputer, Universitas Muhammadiyah Metro**.

Backend ini menyediakan layanan untuk mengelola data akreditasi, kebutuhan dokumentasi, dokumentasi borang, pengguna dan hak akses, penyimpanan dokumen, verifikasi, notifikasi, timeline, statistik, serta pembuatan laporan.

## Tentang Aplikasi

Aplikasi Manajemen Borang Akreditasi dikembangkan untuk membantu Fakultas Ilmu Komputer Universitas Muhammadiyah Metro dalam mengelola proses pengumpulan dan pengelolaan dokumen pendukung akreditasi secara terstruktur.

Backend berfungsi sebagai REST API yang menangani:

- Autentikasi dan otorisasi pengguna.
- Pengelolaan data dosen dan tim akreditasi.
- Pengelolaan periode akreditasi.
- Pengelolaan kriteria akreditasi.
- Pengelolaan PIC kriteria.
- Pengelolaan kebutuhan dokumentasi.
- Pengelolaan dokumentasi borang.
- Pengunggahan dan pengelolaan file dokumen.
- Verifikasi dan revisi dokumentasi.
- Pengelolaan riwayat aktivitas.
- Notifikasi pengguna.
- Timeline kegiatan akreditasi.
- Dokumen panduan.
- Statistik dan laporan akreditasi.

## Tujuan Pengembangan

Backend dikembangkan untuk menyediakan layanan terpusat yang dapat:

1. Mengelola data akreditasi secara terstruktur.
2. Mendukung pembagian tugas berdasarkan peran pengguna.
3. Mengelola kebutuhan dan dokumen pendukung akreditasi.
4. Mendukung proses pengunggahan, penyimpanan, dan pengelolaan file.
5. Mendukung proses verifikasi dan revisi dokumen.
6. Menyediakan data statistik untuk kebutuhan monitoring.
7. Menghasilkan laporan yang berkaitan dengan proses akreditasi.
8. Menyediakan API yang dapat digunakan oleh aplikasi frontend.

## Fitur Utama

### Authentication

Backend menyediakan mekanisme autentikasi dan keamanan pengguna yang meliputi:

- Login.
- Logout.
- Aktivasi akun.
- Kode aktivasi.
- Reset password.
- JSON Web Token.
- Cookie-based authentication.
- Hashing password.
- Middleware autentikasi.
- Middleware authorization berdasarkan role.

### Manajemen Pengguna

Pengelolaan data pengguna terutama dosen dan anggota tim akreditasi.

### Manajemen Role

Sistem menggunakan beberapa role utama:

- `wakil_dekan_1`
- `kaprodi`
- `tim_akreditasi`

Hak akses setiap pengguna dibatasi berdasarkan kebutuhan fungsional aplikasi.

### Periode Akreditasi

Menyediakan pengelolaan periode yang digunakan sebagai konteks data akreditasi.

### Kriteria Akreditasi

Menyediakan pengelolaan data kriteria akreditasi beserta PIC yang bertanggung jawab.

### Kebutuhan Dokumentasi

Digunakan untuk mengelola kebutuhan dokumen yang diperlukan dalam proses akreditasi.

Fungsi yang didukung meliputi:

- Pembuatan kebutuhan dokumentasi.
- Perubahan kebutuhan dokumentasi.
- Distribusi kebutuhan dokumentasi.
- Pengelolaan pendekatan.
- Pengelolaan status dan riwayat.

### Dokumentasi Borang

Menyediakan layanan untuk mengelola dokumentasi yang digunakan sebagai bukti pendukung borang akreditasi.

### Manajemen File

Backend mendukung:

- Upload file.
- Penyimpanan metadata file.
- Pengelolaan folder dokumen.
- Pengelolaan lokasi penyimpanan.
- Penghapusan file.
- Pengunduhan file.
- Penyimpanan file pada sistem atau Google Drive.

File yang digunakan untuk dokumentasi utama menggunakan format PDF dengan batas ukuran yang ditentukan oleh aplikasi.

### Verifikasi Dokumentasi

Dokumentasi dapat melalui beberapa status:

- `PENDING`
- `REVISION`
- `APPROVED`

Status tersebut digunakan untuk mendukung proses pemeriksaan, revisi, dan persetujuan dokumentasi.

### Riwayat

Sistem menyimpan riwayat yang berkaitan dengan proses pengelolaan dokumentasi.

Jenis riwayat utama:

- `DOKUMENTASI_BORANG`
- `KEBUTUHAN_DOKUMENTASI`

### Notifikasi

Backend menyediakan layanan notifikasi untuk menyampaikan informasi terkait aktivitas dan perubahan status pada aplikasi.

### Timeline

Menyediakan pengelolaan timeline kegiatan yang berkaitan dengan proses akreditasi.

### Dokumen Panduan

Menyediakan layanan untuk pengelolaan dokumen panduan yang dapat digunakan sebagai referensi dalam proses akreditasi.

### Statistik dan Laporan

Backend menyediakan data statistik serta layanan laporan untuk membantu monitoring dan evaluasi proses akreditasi.

## Arsitektur Backend

Secara umum, alur aplikasi adalah sebagai berikut:

```text
Client / Frontend
       │
       ▼
     CORS
       │
       ▼
 Express Application
       │
       ├── Rate Limiter
       ├── Authentication
       ├── Authorization
       ├── Router
       │
       ▼
 Controller / Service Logic
       │
       ▼
    Prisma ORM
       │
       ▼
     MySQL
```

Untuk proses pengelolaan file:

```text
Frontend
   │
   ▼
Upload Request
   │
   ▼
Multer
   │
   ├───────────────┐
   ▼               ▼
Sistem         Google Drive
   │               │
   └───────┬───────┘
           ▼
    File Metadata
           │
           ▼
         MySQL
```

## Struktur Project

```text
generated/
└── prisma/

prisma/
├── migrations/
└── schema.prisma

public/

src/
├── controllers/
├── helpers/
├── middlewares/
├── routes/
├── services/
├── types/
├── utils/
├── app.ts
└── index.ts

package.json
tsconfig.json
...
```

### Struktur Utama

| Folder         | Fungsi                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| `controllers/` | Menangani request dan response API                                                   |
| `helpers/`     | Fungsi pembantu aplikasi                                                             |
| `middlewares/` | Authentication, authorization, rate limiting, error handling, dan middleware lainnya |
| `routes/`      | Definisi dan pengelompokan endpoint API                                              |
| `services/`    | Logika bisnis dan komunikasi dengan layanan eksternal                                |
| `types/`       | TypeScript types dan interface                                                       |
| `utils/`       | Utility yang digunakan oleh berbagai bagian aplikasi                                 |
| `prisma/`      | Schema dan migration database                                                        |
| `public/`      | Resource publik aplikasi                                                             |
| `generated/`   | Hasil generate Prisma                                                                |

## Database

Backend menggunakan:

- **MySQL** sebagai database.
- **Prisma ORM** sebagai ORM.
- **Prisma Migrate** untuk pengelolaan migration database.

Schema database didefinisikan pada:

```text
prisma/schema.prisma
```

Migration database disimpan pada:

```text
prisma/migrations/
```

## Model Data

Database menangani berbagai entitas yang berkaitan dengan proses akreditasi, antara lain:

- Dosen.
- Role.
- Periode.
- Kriteria.
- PIC Kriteria.
- Kebutuhan Dokumentasi.
- Pendekatan.
- Dokumentasi Borang.
- Folder.
- File Dokumen.
- Lokasi Penyimpanan.
- Distribusi Kebutuhan Dokumentasi.
- Riwayat.
- Notifikasi.
- Timeline.
- Dokumen Panduan.
- Data pendukung statistik dan laporan.

Relasi antar-entitas dikelola menggunakan Prisma ORM.

## REST API

Endpoint API dikelompokkan berdasarkan fungsi:

```text
/api/public
/api/auth
/api/dosen
/api/periode
/api/kriteria
/api/kriteria-pic
/api/kebutuhan-dokumentasi
/api/verifikasi
/api/dokumentasi-borang
/api/lokasi
/api/nama-kebutuhan-dokumentasi
/api/folder
/api/file-dokumen
/api/distribusi-kebutuhan-dokumentasi
/api/statistik
/api/timeline
/api/dokumen-panduan
/api/activation-code
/api/riwayat
/api/notifikasi
/api/laporan
```

Seluruh endpoint berada di bawah prefix API yang digunakan oleh aplikasi.

## Authentication dan Authorization

Backend menggunakan mekanisme authentication dan authorization untuk membatasi akses terhadap resource.

Proses umum:

```text
Login
  │
  ▼
Validasi Credentials
  │
  ▼
Authentication
  │
  ▼
JWT
  │
  ▼
Cookie / Request Authentication
  │
  ▼
Authentication Middleware
  │
  ▼
Authorization Middleware
  │
  ▼
Controller
```

Authorization diterapkan berdasarkan role pengguna.

Role utama:

```text
wakil_dekan_1
kaprodi
tim_akreditasi
```

## Validasi Data

Validasi input dilakukan menggunakan **Zod** untuk memastikan data request sesuai dengan aturan yang telah ditentukan.

Validasi diterapkan pada berbagai proses, seperti:

- Authentication.
- Data pengguna.
- Data periode.
- Data kriteria.
- Kebutuhan dokumentasi.
- Dokumentasi borang.
- File.
- Data laporan.
- Data lainnya yang membutuhkan validasi.

## Upload dan Manajemen File

Pengelolaan upload file menggunakan **Multer**.

File yang diunggah kemudian dapat disimpan menggunakan provider penyimpanan yang tersedia.

Tipe storage provider:

```text
SISTEM
GDRIVE
```

Metadata file tetap dikelola oleh backend sehingga aplikasi dapat mengetahui informasi file tanpa harus bergantung langsung pada implementasi storage tertentu.

## Storage Provider

Backend mendukung dua jenis penyimpanan:

### Sistem

File disimpan pada storage yang dikelola oleh aplikasi.

### Google Drive

File dapat disimpan menggunakan layanan Google Drive.

Integrasi Google Drive dilakukan melalui Google APIs.

Credential dan konfigurasi layanan eksternal disimpan menggunakan environment configuration dan **tidak disertakan dalam repository**.

## Email

Backend menggunakan **Nodemailer** untuk kebutuhan pengiriman email aplikasi.

Email dapat digunakan untuk kebutuhan seperti:

- Aktivasi akun.
- Informasi autentikasi.
- Informasi sistem.
- Proses lain yang membutuhkan pengiriman email.

Credential SMTP/email bersifat rahasia dan tidak disimpan di source code.

## PDF dan Laporan

Backend menggunakan:

- **PDFKit** untuk pembuatan PDF.
- **EJS** untuk template.
- **Archiver** untuk kebutuhan pengarsipan file.

Fungsionalitas tersebut digunakan untuk mendukung pembuatan laporan dan kebutuhan distribusi dokumen.

## Rate Limiting

Backend menerapkan rate limiting untuk membantu mencegah penyalahgunaan endpoint.

Konfigurasi utama meliputi pembatasan pada:

- Login.
- Aktivasi.
- API umum.

Request yang melebihi batas akan mendapatkan HTTP status:

```text
429 Too Many Requests
```

## Error Handling

Aplikasi memiliki middleware khusus untuk menangani error pada Express.

Response error dikembalikan dalam format yang dapat diproses oleh frontend.

Secara umum:

```text
Request
   │
   ▼
Route
   │
   ▼
Controller / Service
   │
   ├── Success ──► Response
   │
   └── Error ────► Error Middleware
                         │
                         ▼
                      Error Response
```

## Teknologi yang Digunakan

### Runtime dan Bahasa

- Node.js
- TypeScript

### Backend Framework

- Express 5

### Database

- MySQL
- Prisma ORM
- Prisma Migrate

### Authentication dan Security

- JSON Web Token
- bcryptjs
- Cookie
- express-rate-limit

### Validation

- Zod

### File Handling

- Multer
- Google APIs
- Archiver

### Email

- Nodemailer

### PDF dan Template

- PDFKit
- EJS

### Development dan Testing

- ts-node-dev
- Vitest
- Supertest

### Utility

- dotenv
- CORS
- cookie-parser
- body-parser

## Persyaratan Sistem

Sebelum menjalankan project, pastikan environment telah memiliki:

- Node.js.
- Package manager yang kompatibel dengan project.
- MySQL.
- Git.

Untuk kebutuhan fitur tertentu, diperlukan konfigurasi layanan eksternal yang digunakan oleh aplikasi.

## Instalasi

Clone repository:

```bash
git clone https://github.com/ilhamSkyOf19/aplikasi-manajemen-borang-akreditasi-be.git
```

Masuk ke directory project:

```bash
cd aplikasi-manajemen-borang-akreditasi-be
```

Install dependency:

```bash
pnpm install
```

## Konfigurasi Environment

Aplikasi menggunakan environment variables untuk menyimpan konfigurasi yang bersifat dinamis maupun sensitif, termasuk konfigurasi database, authentication, email, storage, dan layanan eksternal.

**Nilai credential, secret, password, token, API key, serta konfigurasi sensitif tidak dicantumkan di README dan tidak boleh di-commit ke repository.**

Gunakan file environment lokal sesuai konfigurasi deployment masing-masing.

Pastikan file environment masuk ke `.gitignore`.

Contoh aturan keamanan repository:

```gitignore
.env
.env.*
!.env.example
```

Jika diperlukan, repository dapat menyediakan `.env.example` yang hanya berisi placeholder tanpa nilai rahasia.

## Database Migration

Setelah konfigurasi database tersedia, migration Prisma dapat dijalankan menggunakan perintah Prisma yang sesuai dengan environment development.

Untuk membuat Prisma Client:

```bash
pnpm prisma generate
```

Untuk menjalankan migration pada environment development:

```bash
pnpm prisma migrate dev
```

Untuk deployment production, gunakan migration deployment yang sesuai dengan workflow Prisma.

## Menjalankan Server

Server development dapat dijalankan menggunakan script yang tersedia pada `package.json`.

Contoh:

```bash
pnpm dev
```

Secara default, aplikasi menggunakan port:

```text
3000
```

API dapat diakses melalui:

```text
http://localhost:3000
```

Port dapat disesuaikan melalui konfigurasi environment deployment.

## Build Production

Build production dilakukan menggunakan script project yang tersedia pada `package.json`.

Setelah proses build selesai, aplikasi dapat dijalankan menggunakan runtime Node.js sesuai konfigurasi deployment.

## Testing

Project menggunakan:

- Vitest.
- Supertest.

Testing digunakan untuk membantu memastikan fungsi backend dan endpoint API berjalan sesuai kebutuhan.

Perintah testing mengikuti script yang tersedia pada `package.json`.

## Alur Request

Secara umum, request API diproses melalui tahapan:

```text
Client
  │
  ▼
CORS
  │
  ▼
Rate Limiter
  │
  ▼
Authentication
  │
  ▼
Authorization
  │
  ▼
Router
  │
  ▼
Controller
  │
  ▼
Service / Business Logic
  │
  ▼
Prisma
  │
  ▼
MySQL
  │
  ▼
Response
```

## Status Dokumentasi

Dokumentasi menggunakan status:

| Status     | Keterangan                              |
| ---------- | --------------------------------------- |
| `PENDING`  | Dokumentasi menunggu proses pemeriksaan |
| `REVISION` | Dokumentasi memerlukan perbaikan        |
| `APPROVED` | Dokumentasi telah disetujui             |

Status digunakan sebagai bagian dari workflow verifikasi dokumentasi.

## Tipe Riwayat

Sistem memiliki tipe riwayat:

| Tipe                    | Keterangan                                          |
| ----------------------- | --------------------------------------------------- |
| `DOKUMENTASI_BORANG`    | Riwayat yang berkaitan dengan dokumentasi borang    |
| `KEBUTUHAN_DOKUMENTASI` | Riwayat yang berkaitan dengan kebutuhan dokumentasi |

## Tipe Dokumentasi

Sistem membedakan tipe dokumentasi:

```text
DEFAULT
PENELITIAN
```

Tipe digunakan untuk membedakan karakteristik dokumentasi yang dikelola aplikasi.

## Konvensi Pengembangan

Beberapa prinsip pengembangan yang digunakan:

- Menggunakan TypeScript.
- Memisahkan routing, controller, service, middleware, dan utility.
- Menggunakan Prisma sebagai abstraction layer database.
- Menggunakan Zod untuk validasi input.
- Menggunakan middleware untuk authentication dan authorization.
- Menggunakan environment configuration untuk konfigurasi aplikasi.
- Tidak menyimpan credential atau secret di source code.
- Menggunakan migration untuk perubahan struktur database.
- Menyediakan testing untuk fungsi dan endpoint yang diperlukan.

## Keamanan

Beberapa aspek keamanan yang diterapkan:

- Password disimpan dalam bentuk hash.
- Authentication menggunakan JWT.
- Authorization berdasarkan role.
- Cookie digunakan dalam mekanisme authentication.
- Rate limiting pada endpoint tertentu.
- Validasi input menggunakan Zod.
- CORS configuration.
- Pembatasan upload file.
- Credential layanan eksternal disimpan melalui environment configuration.
- Secret dan credential tidak disimpan dalam repository.
- Error ditangani melalui centralized error middleware.

**Jangan pernah melakukan commit terhadap file yang berisi:**

- Password.
- JWT secret.
- Database credential.
- API key.
- Access token.
- Refresh token.
- Credential Google.
- Credential SMTP.
- Private key.
- Credential layanan eksternal lainnya.

Jika credential pernah terlanjur masuk ke repository, credential tersebut harus segera di-rotate dan riwayat repository perlu ditangani sesuai kebutuhan keamanan.

## Informasi Project

**Nama:** Aplikasi Manajemen Borang Akreditasi

**Institusi:** Fakultas Ilmu Komputer, Universitas Muhammadiyah Metro

**Komponen:** Backend REST API

**Bahasa:** TypeScript

**Framework:** Express

**Database:** MySQL

**ORM:** Prisma

## Repository

[GitHub Repository Backend](https://github.com/ilhamSkyOf19/aplikasi-manajemen-borang-akreditasi-be?utm_source=chatgpt.com)

## Lisensi

Project ini dikembangkan untuk kebutuhan **Fakultas Ilmu Komputer, Universitas Muhammadiyah Metro**.

Penggunaan, distribusi, dan pengembangan lebih lanjut mengikuti kebijakan dan ketentuan yang berlaku pada institusi.
