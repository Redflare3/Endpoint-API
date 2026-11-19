-- Jalankan di Supabase Dashboard > SQL Editor

create table if not exists public.books (
  id          bigint generated always as identity primary key,
  title       text    not null,
  author      text    not null,
  publisher   text,
  year        int,
  price       numeric(12, 2) default 0,
  created_at  timestamptz default now()
);

-- Izinkan akses baca (SELECT) publik lewat anon key
alter table public.books enable row level security;

drop policy if exists "Allow public read books" on public.books;
create policy "Allow public read books"
  on public.books for select
  using (true);

-- Data contoh
insert into public.books (title, author, publisher, year, price) values
  ('Laskar Pelangi',            'Andrea Hirata',        'Bentang Pustaka', 2005, 85000),
  ('Bumi Manusia',              'Pramoedya Ananta Toer','Lentera Dipantara', 1980, 110000),
  ('Filosofi Teras',            'Henry Manampiring',    'Kompas',          2018, 98000),
  ('Atomic Habits',             'James Clear',          'Gramedia',        2019, 108000),
  ('Clean Code',                'Robert C. Martin',     'Prentice Hall',   2008, 450000),
  ('Pemrograman Web dengan Node.js', 'Budi Raharjo',    'Informatika',     2021, 125000);
