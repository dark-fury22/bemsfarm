require("dotenv").config();
const pool = require("../db/pool");
const emailService = require("../services/emailService");

// ── GET DASHBOARD STATS ──────────────────────────────────────
const getStats = async (req, res) => {
  try {
    console.log("📊 Fetching admin stats");

    const [
      revenueRes,
      ordersRes,
      customersRes,
      productsRes,
      topProductsRes,
      recentOrdersRes,
      stockLowRes,
      dailyRevenueRes,
    ] = await Promise.all([
      // ✅ FIX: Only CONFIRMED/DELIVERED orders (accurate revenue)
      pool.query(`
        SELECT COALESCE(SUM(total), 0) as total FROM orders
        WHERE status IN ('confirmed', 'delivered', 'being_packed', 'out_for_delivery')
        AND created_at > NOW() - INTERVAL '90 days'
      `),
      // ✅ Total orders (90 days, not cancelled)
      pool.query(`
        SELECT COUNT(*) as count FROM orders
        WHERE status != 'cancelled' AND created_at > NOW() - INTERVAL '90 days'
      `),
      // Total customers
      pool.query(`SELECT COUNT(*) as count FROM users WHERE role = 'user'`),
      // ✅ FIX: Only ACTIVE products (with stock)
      pool.query(`
        SELECT COUNT(*) as count FROM products WHERE COALESCE(stock, 100) > 0
      `),
      // ✅ FIX: 10 top products (not just 5)
      pool.query(`
        SELECT p.id, p.name, p.price, p.image_url,
          COALESCE(SUM(oi.quantity), 0) as total_sold,
          COALESCE(SUM(oi.quantity * oi.price * 1500), 0) as revenue,
          COALESCE(p.stock, 100) as current_stock
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
        GROUP BY p.id, p.name, p.price, p.image_url, p.stock
        ORDER BY total_sold DESC NULLS LAST
        LIMIT 10
      `),
      // ✅ FIX: Include item_count, filter by 30 days
      pool.query(`
        SELECT
          o.id, u.name as customer, u.email,
          o.total as amount, o.status,
          COALESCE(o.tracking_status, o.status) as tracking_status,
          o.payment_method, o.address, o.created_at as date,
          COUNT(oi.id) as item_count
        FROM orders o
        JOIN users u ON u.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.created_at > NOW() - INTERVAL '30 days'
        GROUP BY o.id, u.id, u.name, u.email, o.total, o.status, o.tracking_status, o.payment_method, o.address, o.created_at
        ORDER BY o.created_at DESC
        LIMIT 20
      `),
      // ✅ NEW: Low stock alerts
      pool.query(`
        SELECT id, name, stock, COALESCE(stock, 100) as current_stock
        FROM products
        WHERE COALESCE(stock, 100) <= 10 AND COALESCE(stock, 100) > 0
        ORDER BY stock ASC
      `),
      // Daily revenue (keep from Document 4)
      pool.query(`
        SELECT
          DATE(created_at) as date,
          SUM(total) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE created_at > NOW() - INTERVAL '30 days'
          AND status IN ('confirmed', 'delivered', 'being_packed', 'out_for_delivery')
        GROUP BY DATE(created_at)
        ORDER BY date
      `),
    ]);

    const stats = {
      totalRevenue: parseFloat(revenueRes.rows[0]?.total || 0),
      totalOrders: parseInt(ordersRes.rows[0]?.count || 0),
      totalCustomers: parseInt(customersRes.rows[0]?.count || 0),
      activeProducts: parseInt(productsRes.rows[0]?.count || 0),
      lowStockCount: stockLowRes.rows.length,
    };

    console.log("✅ Stats ready:", stats);

    res.json({
      stats,
      topProducts: topProductsRes.rows,
      recentOrders: recentOrdersRes.rows,
      lowStockProducts: stockLowRes.rows,
      dailyRevenue: dailyRevenueRes.rows,
    });
  } catch (err) {
    console.error("❌ Stats error:", err.message);
    res.status(500).json({ message: "Failed to fetch stats: " + err.message });
  }
};

// ── UPDATE ORDER STATUS (Admin) ──────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_status, tracking_notes } = req.body;

    console.log("🔄 Updating order:", id, "→", status);

    await pool.query(
      `UPDATE orders SET status = $1, tracking_status = $2, tracking_notes = $3 WHERE id = $4`,
      [status, tracking_status || status, tracking_notes || null, id],
    );

    // ✅ NEW: Send email notification to customer
    try {
      const result = await pool.query(
        `SELECT o.id, o.total, u.name, u.email FROM orders o
         JOIN users u ON u.id = o.user_id WHERE o.id = $1`,
        [id],
      );
      if (result.rows.length) {
        const order = result.rows[0];
        await emailService.sendOrderStatusEmail(
          { id: order.id, total: order.total },
          { name: order.name, email: order.email },
          tracking_status || status,
        );
        console.log("✅ Email sent to:", order.email);
      }
    } catch (emailErr) {
      console.error("⚠️ Email failed:", emailErr.message);
    }

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── GET ALL ORDERS (Admin) ───────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    console.log("📋 Fetching all orders");

    const result = await pool.query(`
      SELECT
        o.id, u.name as customer, u.email,
        o.total as amount, o.status,
        COALESCE(o.tracking_status, o.status) as tracking_status,
        o.payment_method, o.address, o.created_at as date,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id, u.id, u.name, u.email, o.total, o.status, o.tracking_status, o.payment_method, o.address, o.created_at
      ORDER BY o.created_at DESC
    `);

    console.log("✅ Found", result.rows.length, "orders");
    res.json({ orders: result.rows, count: result.rows.length });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── ADD PRODUCT ──────────────────────────────────────────────
const addProduct = async (req, res) => {
  try {
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

    console.log("➕ Adding product:", name);

    // Convert price: if naira value (>100), divide by 1500
    const priceInDB = price > 100 ? price / 1500 : price;

    const result = await pool.query(
      `INSERT INTO products (name, price, unit, description, is_featured, image_url, category_id, stock, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        name,
        priceInDB,
        unit,
        description || "",
        is_featured || false,
        image_url || "",
        category_id || 1,
        stock || 100,
      ],
    );

    console.log("✅ Product added:", result.rows[0].id);
    res
      .status(201)
      .json({ message: "Product added successfully", product: result.rows[0] });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE PRODUCT ───────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, unit, description, is_featured, image_url, stock } =
      req.body;

    console.log("✏️ Updating product:", id);

    const priceInDB = price > 100 ? price / 1500 : price;

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, price = $2, unit = $3, description = $4, is_featured = $5, image_url = $6, stock = $7
       WHERE id = $8
       RETURNING *`,
      [
        name,
        priceInDB,
        unit,
        description || "",
        is_featured || false,
        image_url || "",
        stock || 100,
        parseInt(id),
      ],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Not found" });
    }

    console.log("✅ Product updated:", result.rows[0].id);
    res.json({ message: "Updated", product: result.rows[0] });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE PRODUCT ───────────────────────────────────────────
const deleteProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting product:", id);

    await client.query("BEGIN");

    const result = await client.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [parseInt(id)],
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Not found" });
    }

    await client.query("COMMIT");
    console.log("✅ Product deleted:", id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

// ── GET SUBSCRIBERS ──────────────────────────────────────────
const getSubscribers = async (req, res) => {
  try {
    console.log("📧 Fetching subscribers");

    // ✅ FIX: Changed "subscribers" to "email_subscriptions"
    const result = await pool.query(
      `SELECT id, email, discount_code, is_active, subscribed_at
       FROM email_subscriptions
       WHERE is_active = true
       ORDER BY subscribed_at DESC`,
    );

    console.log("✅ Found", result.rows.length, "subscribers");
    res.json({ subscribers: result.rows || [], count: result.rows.length });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch subscribers: " + err.message });
  }
};

module.exports = {
  getStats,
  updateOrderStatus,
  getAllOrders,
  addProduct,
  updateProduct,
  deleteProduct,
  getSubscribers,
};
