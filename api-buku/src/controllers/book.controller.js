const bookService = require('../services/book.service');

async function getBooks(req, res, next) {
  try {
    const { search } = req.query;
    const books = await bookService.getAllBooks({ search });

    res.status(200).json({
      success: true,
      message: 'Data buku berhasil diambil',
      total: books.length,
      data: books,
    });
  } catch (err) {
    next(err); 
  }
}

module.exports = { getBooks };
