// Konfigurasi koneksi ke database (Supabase / PostgreSQL online)
// File ini hanya membuat 1 client yang dipakai bersama oleh seluruh service.
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL dan SUPABASE_KEY belum diisi di file .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
