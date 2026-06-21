const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getStats,
  updateOrderStatus,
  getAllOrders,
  updateProduct,
  deleteProduct,
  addProduct,
  getSubscribers,
} = require("../controllers/adminController");

const {
  getAllReturns,
  updateReturn,
} = require("../controllers/returnsController");
const pool = require("../db/pool");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/subscribers", getSubscribers);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/returns", getAllReturns);
router.patch("/returns/:id", updateReturn);

// Products CRUD
router.get("/products", async (req, res) => {
  const r = await pool.query(
    `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id ORDER BY p.id`,
  );
  res.json({ products: r.rows });
});
router.post("/products", async (req, res) => {
  const {
    name,
    price,
    unit,
    description,
    is_featured,
    image_url,
    category_id,
    stock,
  } = req.body;
  const r = await pool.query(
    `INSERT INTO products (name, price, unit, description, is_featured, image_url, category_id, stock)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      name,
      parseFloat(price) / 1500,
      unit,
      description || "",
      is_featured || false,
      image_url || "",
      parseInt(category_id) || 1,
      parseInt(stock) || 100,
    ],
  );
  res.status(201).json({ product: r.rows[0] });
});
router.put("/products/:id", async (req, res) => {
  const { name, price, unit, description, is_featured, image_url, stock } =
    req.body;
  const r = await pool.query(
    `UPDATE products SET name=$1,price=$2,unit=$3,description=$4,is_featured=$5,image_url=$6,stock=$7 WHERE id=$8 RETURNING *`,
    [
      name,
      parseFloat(price) / 1500,
      unit,
      description || "",
      is_featured || false,
      image_url || "",
      parseInt(stock) || 100,
      parseInt(req.params.id),
    ],
  );
  res.json({ product: r.rows[0] });
});
router.delete("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await pool.query("DELETE FROM products WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

// Returns (admin)
router.get("/returns", async (req, res) => {
  const r = await pool.query(`
    SELECT r.*, p.name as product_name, u.name as customer_name, u.email as customer_email
    FROM returns r JOIN products p ON p.id=r.product_id JOIN users u ON u.id=r.user_id
    ORDER BY r.created_at DESC
  `);
  res.json({ returns: r.rows });
});
router.patch("/returns/:id", async (req, res) => {
  const { status } = req.body;
  await pool.query("UPDATE returns SET status=$1 WHERE id=$2", [
    status,
    req.params.id,
  ]);
  res.json({ message: "Updated" });
});

// Subscribers
router.get("/subscribers", async (req, res) => {
  const r = await pool.query(
    "SELECT * FROM email_subscriptions ORDER BY subscribed_at DESC",
  );
  res.json({ subscribers: r.rows });
});

module.exports = router;
