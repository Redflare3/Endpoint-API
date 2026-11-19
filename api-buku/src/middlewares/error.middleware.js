function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
}

function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
  });
}

module.exports = { notFound, errorHandler };
