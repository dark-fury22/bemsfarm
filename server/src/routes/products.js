const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  getFeaturedProducts 
} = require('../controllers/productsController');

// IMPORTANT: /featured must come BEFORE /:id
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;