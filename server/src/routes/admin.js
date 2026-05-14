const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getStats, updateProduct, deleteProduct, addProduct } = require('../controllers/adminController')

router.get('/stats',           protect, getStats)
router.post('/products',       protect, addProduct)
router.put('/products/:id',    protect, updateProduct)
router.delete('/products/:id', protect, deleteProduct)

module.exports = router