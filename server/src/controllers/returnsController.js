const pool = require("../db/pool");

const submitReturn = async (req, res) => {
  try {
    const { order_id, product_id, quantity, reason, description } = req.body;

    if (
      !["damaged", "wrong_item", "quality", "changed_mind", "other"].includes(
        reason,
      )
    )
      return res.status(400).json({ message: "Invalid reason" });

    // Verify the order belongs to this user and is delivered
    const order = await pool.query(
      "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
      [order_id, req.user.id],
    );
    if (!order.rows.length)
      return res.status(404).json({ message: "Order not found" });
    if (order.rows[0].status !== "delivered")
      return res
        .status(400)
        .json({ message: "Only delivered orders can be returned" });

    // Check 7-day window
    const deliveryDate = new Date(order.rows[0].created_at);
    const daysDiff =
      (Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 7)
      return res
        .status(400)
        .json({
          message: "Returns must be requested within 7 days of delivery",
        });

    const result = await pool.query(
      `INSERT INTO returns (order_id, user_id, product_id, quantity, reason, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        order_id,
        req.user.id,
        product_id,
        quantity || 1,
        reason,
        description || "",
      ],
    );
    res
      .status(201)
      .json({
        message: "Return request submitted! We'll review within 24 hours.",
        returnId: result.rows[0].id,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Return submission failed: " + err.message });
  }
};

const getUserReturns = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as product_name, p.image_url
       FROM returns r JOIN products p ON p.id=r.product_id
       WHERE r.user_id=$1 ORDER BY r.created_at DESC`,
      [req.user.id],
    );
    res.json({ returns: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

const getAllReturns = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name as product_name, u.name as customer_name, u.email as customer_email
       FROM returns r
       JOIN products p ON p.id=r.product_id
       JOIN users u ON u.id=r.user_id
       ORDER BY r.created_at DESC`,
    );
    res.json({ returns: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;
    await pool.query(
      "UPDATE returns SET status=$1, resolution=$2, resolved_at=NOW() WHERE id=$3",
      [status, resolution, id],
    );
    res.json({ message: "Return updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = { submitReturn, getUserReturns, getAllReturns, updateReturn };
