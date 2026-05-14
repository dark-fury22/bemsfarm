require('dotenv').config()
const pool = require('../db/pool')

// ── GET Admin Stats (real data) ──────────────────────────────
const getStats = async (req, res) => {
  try {
    const [ordersResult, customersResult, productsResult, revenueResult, topProducts, recentOrders] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM orders'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM products'),
      pool.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'"),
      pool.query(`
        SELECT p.name, p.price, COUNT(oi.id) as order_count, SUM(oi.quantity) as total_sold
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        GROUP BY p.id, p.name, p.price
        ORDER BY total_sold DESC NULLS LAST
        LIMIT 5
      `),
      pool.query(`
        SELECT o.id, u.name as customer, o.total as amount, o.status, o.created_at as date
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),
    ])

    res.json({
      stats: {
        totalRevenue:   parseFloat(revenueResult.rows[0].total) || 0,
        totalOrders:    parseInt(ordersResult.rows[0].count)    || 0,
        totalCustomers: parseInt(customersResult.rows[0].count) || 0,
        totalProducts:  parseInt(productsResult.rows[0].count)  || 0,
      },
      topProducts:  topProducts.rows,
      recentOrders: recentOrders.rows,
    })
  } catch (error) {
    console.error('Admin stats error:', error.message)
    res.status(500).json({ message: 'Error fetching stats' })
  }
}

// ── UPDATE Product ────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, unit, description, is_featured, image_url } = req.body

    // Convert price: if it's already in naira (>100), divide by 1500; if it's fractional, use as-is
    const priceInDB = price > 100 ? price / 1500 : price

    const result = await pool.query(
      `UPDATE products 
       SET name=$1, price=$2, unit=$3, description=$4, is_featured=$5, image_url=$6
       WHERE id=$7 RETURNING *`,
      [name, priceInDB, unit, description || '', is_featured || false, image_url || '', parseInt(id)]
    )
    if (!result.rows.length) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Updated', product: result.rows[0] })
  } catch (err) {
    console.error('Update error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ── DELETE Product ────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    // First delete order_items referencing this product (to avoid FK constraint)
    await pool.query('DELETE FROM order_items WHERE product_id = $1', [parseInt(id)])
    await pool.query('DELETE FROM cart_items WHERE product_id = $1', [parseInt(id)])
    await pool.query('DELETE FROM products WHERE id = $1', [parseInt(id)])
    res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error('Delete error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ── ADD Product ───────────────────────────────────────────────
const addProduct = async (req, res) => {
  try {
    const { name, price, unit, description, is_featured, image_url, category_id, stock } = req.body

    const result = await pool.query(
      `INSERT INTO products (name, price, unit, description, is_featured, image_url, category_id, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, price / 1500, unit, description || '', is_featured || false, image_url || '', category_id || 1, stock || 100]
    )

    res.status(201).json({ message: 'Product added successfully', product: result.rows[0] })
  } catch (error) {
    console.error('Add product error:', error.message)
    res.status(500).json({ message: 'Error adding product' })
  }
}

module.exports = { getStats, updateProduct, deleteProduct, addProduct }