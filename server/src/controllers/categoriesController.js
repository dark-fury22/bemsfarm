const pool = require('../db/pool');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY id ASC'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('getCategories error:', error.message);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

module.exports = { getCategories };