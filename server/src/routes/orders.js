const express = require('express')
const router  = express.Router()
const pool    = require('../db/pool')
const { protect } = require('../middleware/authMiddleware')

// Create order
router.post('/', protect, async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { items, total, payment_method, payment_ref, address } = req.body

    // Generate order ID
    const orderId = 'BF-' + Math.random().toString(36).substring(2, 10).toUpperCase()

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (id, user_id, total, status, payment_method, payment_ref, address)
       VALUES ($1, $2, $3, 'pending', $4, $5, $6) RETURNING *`,
      [orderId, req.user.id, total, payment_method, payment_ref || null, address || '']
    )

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      )
    }

    await client.query('COMMIT')
    res.status(201).json({ message: 'Order placed successfully', order: orderResult.rows[0] })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Order creation error:', err.message)
    res.status(500).json({ message: 'Error creating order' })
  } finally {
    client.release()
  }
})

// Get user orders
router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        json_agg(json_build_object(
          'name', p.name, 'quantity', oi.quantity, 'price', oi.price
        )) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    )
    res.json({ orders: result.rows })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

module.exports = router