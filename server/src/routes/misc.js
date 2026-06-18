const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// ── SUBSCRIBE ─────────────────────────────────────────────────
router.post("/subscribe", async (req, res) => {
  console.log("📧 Subscribe hit. Body:", req.body);

  const { email } = req.body;

  // Validate
  if (!email) {
    console.log("❌ No email provided");
    return res.status(400).json({ message: "Email is required" });
  }
  if (
    typeof email !== "string" ||
    !email.includes("@") ||
    !email.includes(".")
  ) {
    console.log("❌ Invalid email:", email);
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // Auto-create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_subscriptions (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        discount_code VARCHAR(20) DEFAULT 'BEMS10',
        is_active     BOOLEAN DEFAULT true,
        subscribed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert or update
    const result = await pool.query(
      `INSERT INTO email_subscriptions (email, discount_code, is_active, subscribed_at)
       VALUES ($1, 'BEMS10', true, NOW())
       ON CONFLICT (email)
       DO UPDATE SET is_active = true, subscribed_at = NOW()
       RETURNING id, email, discount_code`,
      [cleanEmail],
    );

    console.log("✅ Subscribed:", result.rows[0]);
    res.json({
      success: true,
      message: "Subscribed! Use code BEMS10 for 10% off your next order.",
      code: "BEMS10",
    });
  } catch (err) {
    console.error("❌ Subscribe DB error:", err.message);
    res.status(500).json({ message: "Database error: " + err.message });
  }
});

// ── PAYSTACK WEBHOOK ──────────────────────────────────────────
router.post(
  "/webhooks/paystack",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const crypto = require("crypto");
      const secret = process.env.PAYSTACK_SECRET || "";
      const hash = crypto
        .createHmac("sha512", secret)
        .update(req.body)
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        return res.sendStatus(401);
      }

      const event = JSON.parse(req.body);
      if (event.event === "charge.success") {
        await pool.query(
          `UPDATE orders SET status='confirmed' WHERE payment_ref=$1`,
          [event.data.reference],
        );
        console.log("✅ Payment confirmed for ref:", event.data.reference);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("Webhook error:", err.message);
      res.sendStatus(500);
    }
  },
);

module.exports = router;
