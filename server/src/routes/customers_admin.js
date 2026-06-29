// server/src/routes/customers_admin.js
// Mounted at /api/admin/customers

const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const { protect, requireRole } = require("../middleware/authMiddleware");

router.use(protect);

// ── GET /api/admin/customers ──────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      tier = "",
      status = "",
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const where = [];

    if (search) {
      params.push(`%${search}%`);
      where.push(
        `(c.name ILIKE $${params.length} OR c.phone ILIKE $${params.length} OR c.email ILIKE $${params.length} OR c.customer_code ILIKE $${params.length} OR c.area ILIKE $${params.length})`,
      );
    }
    if (status) {
      params.push(status);
      where.push(`c.status = $${params.length}`);
    }
    if (tier) {
      params.push(tier);
      where.push(`lt.name = $${params.length}`);
    }

    const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM customers c
       LEFT JOIN customer_loyalty cl ON c.id = cl.customer_id
       LEFT JOIN loyalty_tiers lt ON cl.tier_id = lt.id
       ${whereClause}`,
      params,
    );

    params.push(parseInt(limit));
    params.push(offset);

    const rows = await pool.query(
      `
      SELECT
        c.id, c.customer_code, c.name, c.phone, c.email,
        c.area AS zone, c.status, c.total_orders, c.total_spent,
        c.joined_at, c.last_order_at,
        COALESCE(cl.points_balance, 0) AS points,
        COALESCE(lt.name, 'Bronze') AS tier,
        COALESCE(cw.balance, 0) AS wallet_balance
      FROM customers c
      LEFT JOIN customer_loyalty cl ON c.id = cl.customer_id
      LEFT JOIN loyalty_tiers lt ON cl.tier_id = lt.id
      LEFT JOIN customer_wallets cw ON c.id = cw.customer_id
      ${whereClause}
      ORDER BY c.total_spent DESC NULLS LAST
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `,
      params,
    );

    // KPI stats
    const stats = await pool.query(`
      SELECT
        COUNT(*)                                          AS total,
        COUNT(*) FILTER (WHERE status = 'active')        AS active,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', joined_at) = DATE_TRUNC('month', NOW())) AS new_this_month,
        COALESCE(SUM(total_spent), 0)                    AS total_revenue,
        COALESCE(AVG(total_spent), 0)                    AS avg_spent
      FROM customers
    `);

    const platinum = await pool.query(`
      SELECT COUNT(*) FROM customer_loyalty cl
      JOIN loyalty_tiers lt ON cl.tier_id = lt.id
      WHERE lt.name = 'Platinum'
    `);

    res.json({
      customers: rows.rows,
      total: parseInt(countRes.rows[0].count),
      page: parseInt(page),
      pages: Math.ceil(parseInt(countRes.rows[0].count) / parseInt(limit)),
      stats: {
        ...stats.rows[0],
        platinum: parseInt(platinum.rows[0].count),
      },
    });
  } catch (err) {
    console.error("GET /admin/customers:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/customers/:id ──────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const isCode = req.params.id.startsWith("CUS-");
    const whereCol = isCode ? "c.customer_code" : "c.id";

    const result = await pool.query(
      `
      SELECT
        c.*,
        COALESCE(cl.points_balance, 0)  AS points,
        COALESCE(cl.lifetime_points, 0) AS lifetime_points,
        COALESCE(lt.name, 'Bronze')     AS tier,
        lt.id AS tier_id,
        COALESCE(cw.balance, 0)         AS wallet_balance,
        COALESCE(cw.total_topped_up, 0) AS wallet_funded,
        COALESCE(cw.total_spent, 0)     AS wallet_spent
      FROM customers c
      LEFT JOIN customer_loyalty cl ON c.id = cl.customer_id
      LEFT JOIN loyalty_tiers lt ON cl.tier_id = lt.id
      LEFT JOIN customer_wallets cw ON c.id = cw.customer_id
      WHERE ${whereCol} = $1
    `,
      [req.params.id],
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Customer not found" });

    const customer = result.rows[0];

    // Orders
    const orders = await pool.query(
      `
      SELECT id, total, status, created_at,
        (SELECT STRING_AGG(COALESCE(oi.product_name, p.name) || ' ×' || oi.quantity, ', ')
         FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = o.id) AS items_summary
      FROM orders o
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `,
      [customer.id],
    );

    // Loyalty transactions
    const loyalty = await pool.query(
      `
      SELECT type, description, points, created_at
      FROM loyalty_transactions
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [customer.id],
    );

    // Addresses
    const addresses = await pool.query(
      `
      SELECT * FROM customer_addresses WHERE customer_id = $1 ORDER BY is_default DESC
    `,
      [customer.id],
    );

    // Activity log
    const activity = await pool.query(
      `
      SELECT * FROM customer_activity_log WHERE customer_id = $1
      ORDER BY created_at DESC LIMIT 20
    `,
      [customer.id],
    );

    res.json({
      ...customer,
      orders: orders.rows,
      loyalty: loyalty.rows,
      addresses: addresses.rows,
      activity: activity.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/admin/customers ─────────────────────────────────────
router.post(
  "/",
  requireRole("superadmin", "manager", "admin", "cashier"),
  async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const {
        first_name,
        last_name,
        name,
        phone,
        email,
        zone,
        area,
        address,
        landmark,
        tier = "Bronze",
        status = "active",
        referral,
        notes,
        sms_alerts = true,
      } = req.body;

      const fullName = name || `${first_name || ""} ${last_name || ""}`.trim();
      if (!fullName)
        return res.status(400).json({ message: "Customer name required" });
      if (!phone)
        return res.status(400).json({ message: "Phone number required" });

      // Check duplicate phone
      const exists = await client.query(
        "SELECT id FROM customers WHERE phone=$1",
        [phone],
      );
      if (exists.rows.length)
        return res
          .status(400)
          .json({
            message: "A customer with this phone number already exists",
          });

      // Generate customer code
      const countRow = await client.query("SELECT COUNT(*) FROM customers");
      const code = `CUS-${String(parseInt(countRow.rows[0].count) + 1).padStart(3, "0")}`;

      const result = await client.query(
        `
      INSERT INTO customers
        (customer_code, name, phone, email, area, status, notes, joined_at, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      RETURNING *
    `,
        [
          code,
          fullName,
          phone,
          email || null,
          zone || area || null,
          status,
          notes || null,
        ],
      );

      const customer = result.rows[0];

      // Create wallet
      await client.query(
        "INSERT INTO customer_wallets (customer_id, balance, created_at) VALUES ($1, 0, NOW())",
        [customer.id],
      );

      // Set loyalty tier
      const tierRow = await client.query(
        "SELECT id FROM loyalty_tiers WHERE name=$1",
        [tier],
      );
      if (tierRow.rows.length) {
        await client.query(
          `
        INSERT INTO customer_loyalty (customer_id, tier_id, points_balance, lifetime_points, updated_at)
        VALUES ($1,$2,0,0,NOW())
      `,
          [customer.id, tierRow.rows[0].id],
        );
      }

      // Save address if provided
      if (address) {
        await client.query(
          `
        INSERT INTO customer_addresses (customer_id, label, full_address, area, is_default, created_at)
        VALUES ($1,'Home',$2,$3,true,NOW())
      `,
          [customer.id, address, zone || area || null],
        );
      }

      await client.query("COMMIT");
      res
        .status(201)
        .json({ customer, message: "Customer registered successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  },
);

// ── PATCH /api/admin/customers/:id/status ────────────────────────
router.patch(
  "/:id/status",
  requireRole("superadmin", "manager", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      await pool.query(
        "UPDATE customers SET status=$1 WHERE id=$2 OR customer_code=$2",
        [status, req.params.id],
      );
      res.json({ message: "Status updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// ── DELETE /api/admin/customers/:id ──────────────────────────────
router.delete(
  "/:id",
  requireRole("superadmin", "manager"),
  async (req, res) => {
    try {
      // Soft delete — anonymise PII
      await pool.query(
        `
      UPDATE customers SET
        name   = 'Deleted Customer',
        phone  = 'deleted_' || id,
        email  = NULL,
        status = 'inactive'
      WHERE id=$1 OR customer_code=$1
    `,
        [req.params.id],
      );
      res.json({ message: "Customer removed" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// ── POST /api/admin/customers/:id/loyalty ────────────────────────
// Manually award or deduct points
router.post(
  "/:id/loyalty",
  requireRole("superadmin", "manager", "admin"),
  async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { points, type = "bonus", description } = req.body;
      if (!points) return res.status(400).json({ message: "points required" });

      const custRow = await client.query(
        "SELECT id FROM customers WHERE id=$1 OR customer_code=$1",
        [req.params.id],
      );
      if (!custRow.rows.length)
        return res.status(404).json({ message: "Customer not found" });
      const customerId = custRow.rows[0].id;

      await client.query(
        `
      INSERT INTO loyalty_transactions (customer_id, type, points, description, created_by, created_at)
      VALUES ($1,$2,$3,$4,$5,NOW())
    `,
        [
          customerId,
          type,
          parseInt(points),
          description || "Manual adjustment",
          req.user.id,
        ],
      );

      await client.query(
        `
      UPDATE customer_loyalty SET
        points_balance  = points_balance + $1,
        lifetime_points = CASE WHEN $1 > 0 THEN lifetime_points + $1 ELSE lifetime_points END,
        updated_at      = NOW()
      WHERE customer_id = $2
    `,
        [parseInt(points), customerId],
      );

      await client.query("COMMIT");
      res.json({ message: "Points updated" });
    } catch (err) {
      await client.query("ROLLBACK");
      res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  },
);

module.exports = router;
