// SERVICE: lapisan logika bisnis + akses database.
// Hanya service yang boleh "bicara" dengan Supabase.
const supabase = require('../config/supabase');

async function getAllBooks({ search } = {}) {
  let query = supabase
    .from('books')
    .select('id, title, author, publisher, year, price, created_at')
    .order('id', { ascending: true });

  // Fitur tambahan: pencarian judul, contoh GET /api/books?search=clean
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal mengambil data buku: ${error.message}`);
  }

  return data;
}

module.exports = { getAllBooks };
