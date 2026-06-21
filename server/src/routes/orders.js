const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { protect } = require("../middleware/authMiddleware");

// ── CREATE ORDER ─────────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { items, total, payment_method, payment_ref, address } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ message: "No items in order" });

    const orderId = "BF-" + Date.now().toString(36).toUpperCase();

    // Insert order
    await client.query(
      `INSERT INTO orders (id, user_id, total, status, payment_method, payment_ref, address, created_at)
       VALUES ($1, $2, $3, 'pending', $4, $5, $6, NOW())`,
      [
        orderId,
        req.user.id,
        parseFloat(total) || 0,
        payment_method || "paystack",
        payment_ref || null,
        address || "",
      ],
    );

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [
          orderId,
          parseInt(item.product_id),
          parseInt(item.quantity),
          parseFloat(item.price),
        ],
      );
      // Decrement stock safely
      await client.query(
        `UPDATE products SET stock = GREATEST(0, COALESCE(stock, 100) - $1) WHERE id = $2`,
        [parseInt(item.quantity), parseInt(item.product_id)],
      );
    }

    await client.query("COMMIT");
    console.log("✅ Order created:", orderId);
    res.status(201).json({ message: "Order created", orderId, id: orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Order creation error:", err.message);
    res.status(500).json({ message: "Order failed: " + err.message });
  } finally {
    client.release();
  }
});

// ── GET USER ORDERS (list) ───────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id, o.total, o.status, o.payment_method, o.address,
         o.created_at, o.cancelled_at, o.cancel_reason,
         COALESCE(o.tracking_status, o.status) as tracking_status,
         json_agg(
           json_build_object(
             'name',       p.name,
             'quantity',   oi.quantity,
             'price',      oi.price,
             'product_id', p.id,
             'image_url',  p.image_url
           ) ORDER BY p.name
         ) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p     ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id, o.total, o.status, o.payment_method,
                o.address, o.created_at, o.cancelled_at,
                o.cancel_reason, o.tracking_status
       ORDER BY o.created_at DESC`,
      [req.user.id],
    );
    res.json({ orders: result.rows });
  } catch (err) {
    console.error("Get orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders: " + err.message });
  }
});

// ── SUBMIT RETURN ────────────────────────────────────────────
// IMPORTANT: these /returns routes must be registered BEFORE the
// GET /:id wildcard route below — Express matches top-to-bottom,
// and "/returns" would otherwise be captured by ":id" (id="returns"),
// silently breaking the Returns page with a false 404.
router.post("/returns", protect, async (req, res) => {
  try {
    const { order_id, product_id, quantity, reason, description } = req.body;
    if (!order_id || !product_id || !reason)
      return res
        .status(400)
        .json({ message: "order_id, product_id, and reason are required" });

    const order = await pool.query(
      "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
      [order_id, req.user.id],
    );
    if (!order.rows.length)
      return res.status(404).json({ message: "Order not found" });

    const result = await pool.query(
      `INSERT INTO returns (order_id, user_id, product_id, quantity, reason, description, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'submitted',NOW()) RETURNING id`,
      [
        order_id,
        req.user.id,
        parseInt(product_id),
        parseInt(quantity) || 1,
        reason,
        description || "",
      ],
    );
    res
      .status(201)
      .json({ message: "Return submitted!", returnId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ message: "Return failed: " + err.message });
  }
});

// ── GET USER RETURNS ─────────────────────────────────────────
router.get("/returns", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as product_name FROM returns r
       JOIN products p ON p.id = r.product_id
       WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [req.user.id],
    );
    res.json({ returns: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed: " + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET SINGLE ORDER DETAIL
//
// This route did not exist before. OrderDetailPage.jsx was reading
// from a hardcoded `mockOrders` object with only 3 fake IDs, and
// silently fell back to mockOrders[0] whenever a real order ID
// (e.g. "BF-MQM20HLE") wasn't found in that fake list — which is
// why clicking into ANY real order showed the same unrelated fake
// order every time. This endpoint returns the real order from the
// database, shaped identically to the list endpoint above so the
// frontend can reuse the same item-mapping logic.
//
// IMPORTANT: scoped to `WHERE o.id = $1 AND o.user_id = $2` — not
// just `WHERE o.id = $1`. Without the user_id check, any logged-in
// user could view any other user's order details just by guessing
// or incrementing an order ID in the URL. This closes that gap.
//
// Registered AFTER /returns above so the wildcard ":id" can never
// shadow the literal "/returns" path.
// ═══════════════════════════════════════════════════════════════
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         o.id, o.total, o.status, o.payment_method, o.payment_ref, o.address,
         o.created_at, o.cancelled_at, o.cancel_reason,
         COALESCE(o.tracking_status, o.status) as tracking_status,
         o.tracking_notes,
         json_agg(
           json_build_object(
             'name',       p.name,
             'quantity',   oi.quantity,
             'price',      oi.price,
             'product_id', p.id,
             'image_url',  p.image_url
           ) ORDER BY p.name
         ) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p     ON p.id = oi.product_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id, o.total, o.status, o.payment_method, o.payment_ref,
                o.address, o.created_at, o.cancelled_at,
                o.cancel_reason, o.tracking_status, o.tracking_notes`,
      [id, req.user.id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order: result.rows[0] });
  } catch (err) {
    console.error("Get order detail error:", err.message);
    res.status(500).json({ message: "Failed to fetch order: " + err.message });
  }
});

// ── CANCEL ORDER ─────────────────────────────────────────────
router.patch("/:id/cancel", protect, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 3)
      return res
        .status(400)
        .json({ message: "Cancellation reason is required" });

    const order = await client.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );
    if (!order.rows.length)
      return res.status(404).json({ message: "Order not found" });

    const o = order.rows[0];
    if (!["pending", "order_placed"].includes(o.status))
      return res
        .status(400)
        .json({ message: "This order can no longer be cancelled" });

    await client.query("BEGIN");
    await client.query(
      `UPDATE orders SET status='cancelled', cancel_reason=$1, cancelled_at=NOW() WHERE id=$2`,
      [reason.trim(), id],
    );
    // Restore stock
    const items = await client.query(
      "SELECT product_id, quantity FROM order_items WHERE order_id=$1",
      [id],
    );
    for (const item of items.rows) {
      await client.query(
        "UPDATE products SET stock = COALESCE(stock, 0) + $1 WHERE id = $2",
        [item.quantity, item.product_id],
      );
    }
    await client.query("COMMIT");
    res.json({ message: "Order cancelled. Refund in 3-5 business days." });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Cancellation failed: " + err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
