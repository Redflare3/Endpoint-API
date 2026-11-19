const express = require('express');
const bookController = require('../controllers/book.controller');

const router = express.Router();

// GET /api/books
router.get('/', bookController.getBooks);

module.exports = router;
