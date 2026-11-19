# API Buku - Tugas Pemrograman Web

REST API sederhana untuk menampilkan data buku.
Stack: **Node.js + Express** (backend) dan **Supabase / PostgreSQL** (database online).

## 1. Endpoint

| Method | URL                         | Fungsi                                  |
|--------|-----------------------------|-----------------------------------------|
| GET    | `/api/books`                | Menampilkan semua data buku             |
| GET    | `/api/books?search=clean`   | (opsional) Cari buku berdasarkan judul  |

Contoh response:

```json
{
  "success": true,
  "message": "Data buku berhasil diambil",
  "total": 6,
  "data": [
    {
      "id": 1,
      "title": "Laskar Pelangi",
      "author": "Andrea Hirata",
      "publisher": "Bentang Pustaka",
      "year": 2005,
      "price": 85000,
      "created_at": "2026-11-19T02:30:00+00:00"
    }
  ]
}
```

## 2. Struktur Folder

```
api-buku/
├── database/
│   └── schema.sql              # SQL tabel books + data contoh
├── src/
│   ├── config/
│   │   └── supabase.js         # koneksi ke database
│   ├── services/
│   │   └── book.service.js     # logika bisnis + query database
│   ├── controllers/
│   │   └── book.controller.js  # terima request, kirim response
│   ├── routes/
│   │   ├── book.routes.js      # module route buku (GET /)
│   │   └── index.js            # router utama (prefix /api)
│   ├── middlewares/
│   │   └── error.middleware.js # penanganan 404 dan error
│   ├── app.js                  # susun aplikasi Express
│   └── server.js               # entry point (app.listen)
├── .env.example
└── package.json
```

## 3. Keterhubungan dan Alur Antar Komponen

```
Postman --> server.js --> app.js --> routes/index.js --> book.routes.js
                                                              |
                                                              v
Postman <-- JSON <-- book.controller.js <-- book.service.js <-- config/supabase.js <--> Database Supabase
```

Alur satu request `GET /api/books`:

1. **Postman** mengirim request `GET http://localhost:3000/api/books`.
2. **server.js** adalah entry point yang menjalankan server dan mengimpor `app.js`.
3. **app.js** memasang middleware (`cors`, `express.json`) lalu mengarahkan semua URL berawalan `/api` ke `routes/index.js`.
4. **routes/index.js** (router utama) meneruskan `/api/books` ke module `book.routes.js`.
5. **book.routes.js** mencocokkan `GET /` dengan fungsi `getBooks` milik controller.
6. **book.controller.js** membaca parameter request (`req.query.search`), lalu memanggil `bookService.getAllBooks()`. Controller tidak menyentuh database langsung.
7. **book.service.js** menyusun query ke tabel `books` memakai client Supabase, lalu mengembalikan datanya ke controller.
8. **config/supabase.js** menyediakan client yang sudah terhubung ke Supabase lewat `SUPABASE_URL` dan `SUPABASE_KEY` dari file `.env`.
9. **Database Supabase** menjalankan query (`SELECT ... FROM books`) dan mengirim hasilnya balik.
10. **Controller** membungkus hasil menjadi JSON (`success`, `message`, `total`, `data`) dan mengirimnya sebagai response ke Postman.
11. Bila terjadi error di service, `next(err)` meneruskannya ke **error.middleware.js** yang membalas dengan status 500.

Peran tiap komponen:

| Komponen   | Tanggung jawab                                         | Bergantung pada |
|------------|--------------------------------------------------------|-----------------|
| Route      | Menentukan URL dan HTTP method, memilih controller     | Controller      |
| Controller | Mengelola request/response HTTP                        | Service         |
| Service    | Logika bisnis dan query database                       | Config Supabase |
| Config     | Membuat koneksi database                               | `.env`          |
| Middleware | Hal lintas-request: error handling, CORS, parsing JSON | -               |

Alasan dipisah: setiap lapisan punya satu tugas (separation of concerns), sehingga kode mudah dibaca, dites, dan diganti. Misalnya jika database diganti dari Supabase ke MySQL, hanya `service` dan `config` yang berubah, sedangkan route dan controller tetap.

## 4. Cara Menjalankan

### a. Siapkan database Supabase
1. Daftar di https://supabase.com lalu buat **New Project**.
2. Buka **SQL Editor** > **New query**, tempel isi `database/schema.sql`, lalu klik **Run**.
3. Buka **Table Editor** > tabel `books` dan pastikan 6 baris data muncul (**screenshot ini untuk laporan**).
4. Buka **Project Settings > API**, salin **Project URL** dan **anon public key**.

### b. Jalankan project
```bash
cd api-buku
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env, isi SUPABASE_URL dan SUPABASE_KEY
npm start
```
Jika berhasil, terminal menampilkan: `Server berjalan di http://localhost:3000`

## 5. Panduan Hit API via Postman

1. Buka Postman, klik **New > HTTP Request**.
2. Pilih method **GET**.
3. URL: `http://localhost:3000/api/books`
4. Klik **Send**.
5. Perhatikan: **Status `200 OK`**, waktu respons, dan body JSON berisi daftar buku.

### Screenshot yang perlu diambil

| No | Screenshot                                                       | Yang harus terlihat                                  |
|----|------------------------------------------------------------------|------------------------------------------------------|
| 1  | Supabase Table Editor tabel `books`                              | Data buku di database                                |
| 2  | Terminal `npm start`                                             | Pesan "Server berjalan di http://localhost:3000"     |
| 3  | Postman `GET /api/books`                                         | Method, URL, status 200 OK, body JSON                |
| 4  | Postman `GET /api/books?search=clean` (opsional)                 | Hasil terfilter 1 buku                               |
| 5  | Postman route salah, mis. `GET /api/buku` (opsional)             | Status 404 dari error middleware                     |

### Cara menjelaskan screenshot Postman di laporan

- **Request**: method GET ke `/api/books` tanpa body karena hanya membaca data.
- **Status 200 OK**: request berhasil diproses server.
- **Body JSON**: `success` penanda berhasil, `total` jumlah buku, `data` array buku yang diambil dari tabel `books` di Supabase.
- **Kaitan dengan alur**: response ini hasil perjalanan request melalui Route, Controller, Service, lalu Database, dan kembali ke Postman.

## 6. Troubleshooting

| Masalah                               | Penyebab / solusi                                                    |
|---------------------------------------|----------------------------------------------------------------------|
| `SUPABASE_URL dan SUPABASE_KEY belum diisi` | File `.env` belum dibuat atau isinya kosong                    |
| `data: []` (kosong) padahal tabel ada | RLS aktif tanpa policy. Jalankan ulang bagian policy di `schema.sql` |
| `Invalid API key`                     | Salah salin key. Pakai **anon public**, bukan secret                 |
| `Cannot GET /books`                   | URL salah, harus `/api/books`                                        |
