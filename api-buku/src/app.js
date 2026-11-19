// APP: menyusun aplikasi Express (middleware, route, error handler)
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Buku berjalan. Coba GET /api/books' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
