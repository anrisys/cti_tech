# Pertanyaan nomor 3

## Pertanyan

Jika query GET /tasks lambat karena tabel berisi >200 ribu record, apa langkah-
langkah yang bisa kamu lakukan untuk mengoptimalkan performanya?

## Jawaban

Beberapa langkah yang dapat dilakukan untuk meng-optimasi endpoint tersebut yaitu:

1. Level database

- Menambahkan index database pada kolom yang sering di-query

2. Level API (Code)

- Mengimplementasikan pagination (dengan limit/offset)
- Me-retrieve data kolom yang benar-benar dibutuhkan (selective field bukan SELECT \*)

3. Arsitektur Level:

- Mengimplementasikan caching untuk query / data yang sering di ambil (sebagai contoh Redis)
- Menggunakan replikasi data (database cluster read dan write)
