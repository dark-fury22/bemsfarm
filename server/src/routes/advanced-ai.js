const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// ═══════════════════════════════════════════════════════════════
// PHASE 3: SEMANTIC SEARCH
// ═══════════════════════════════════════════════════════════════

const SEMANTIC_CATEGORIES = {
  "cooking oil": ["palm oil", "groundnut oil", "oil"],
  "breakfast food": ["garri", "beans", "oatmeal", "oat"],
  "soup ingredients": [
    "tomatoes",
    "onion",
    "crayfish",
    "pepper",
    "ugu",
    "tomato",
  ],
  carbs: ["rice", "garri", "beans", "yam"],
  vegetables: ["ugu", "tomatoes", "pepper", "onion", "spinach"],
  protein: ["beans", "crayfish", "egg", "meat", "fish"],
  "healthy eating": ["ugu", "beans", "tomatoes", "ofada", "oat"],
  "festive meals": ["rice", "palm oil", "tomatoes", "crayfish"],
  "quick meals": ["garri", "noodles", "rice"],
  "nigerian staples": ["rice", "garri", "beans", "palm oil", "yam"],
};

router.post("/semantic-search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ message: "Search query required" });

    const queryLower = query.toLowerCase().trim();
    const matched = Object.entries(SEMANTIC_CATEGORIES).find(
      ([key]) => key.includes(queryLower) || queryLower.includes(key),
    );

    const productsResult = await pool.query(
      `SELECT id, name, price, unit, COALESCE(stock, 100) as stock FROM products
       WHERE COALESCE(stock, 100) > 0 ORDER BY name ASC`,
    );

    let results = [];
    if (matched) {
      const [, keywords] = matched;
      results = productsResult.rows
        .filter((p) =>
          keywords.some((kw) =>
            p.name.toLowerCase().includes(kw.toLowerCase()),
          ),
        )
        .slice(0, 12);
    } else {
      results = productsResult.rows
        .filter((p) => p.name.toLowerCase().includes(queryLower))
        .slice(0, 12);
    }

    res.json({
      query,
      results: results.map((p) => ({
        id: p.id,
        name: p.name,
        price: Math.round((parseFloat(p.price) || 2) * 1500),
        unit: p.unit,
        stock: p.stock,
      })),
    });
  } catch (err) {
    console.error("Semantic search error:", err.message);
    res.status(500).json({ message: "Search error: " + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 4: DYNAMIC PRICING  — BUG FIXED
// Bug was: querying order_items.created_at which may not exist
// Fix: JOIN through orders table to get created_at
// ═══════════════════════════════════════════════════════════════

const SEASONALITY_MULTIPLIERS = {
  tomatoes: {
    Jan: 1.3,
    Feb: 1.25,
    Mar: 1.1,
    Apr: 1.0,
    May: 1.0,
    Jun: 1.0,
    Jul: 1.0,
    Aug: 1.0,
    Sep: 1.0,
    Oct: 1.1,
    Nov: 1.2,
    Dec: 1.4,
  },
  rice: {
    Jan: 1.1,
    Feb: 1.05,
    Mar: 1.0,
    Apr: 1.0,
    May: 1.0,
    Jun: 1.0,
    Jul: 1.0,
    Aug: 1.0,
    Sep: 1.0,
    Oct: 1.0,
    Nov: 1.05,
    Dec: 1.15,
  },
  "palm oil": {
    Jan: 1.1,
    Feb: 1.05,
    Mar: 1.0,
    Apr: 0.95,
    May: 0.9,
    Jun: 0.9,
    Jul: 0.95,
    Aug: 1.0,
    Sep: 1.05,
    Oct: 1.1,
    Nov: 1.15,
    Dec: 1.2,
  },
  ugu: {
    Jan: 1.3,
    Feb: 1.2,
    Mar: 1.1,
    Apr: 1.0,
    May: 1.0,
    Jun: 1.0,
    Jul: 0.95,
    Aug: 0.9,
    Sep: 0.95,
    Oct: 1.0,
    Nov: 1.1,
    Dec: 1.2,
  },
};

router.post("/dynamic-pricing", async (req, res) => {
  try {
    const { product_id } = req.body;
    console.log("Dynamic pricing for product:", product_id);

    const result = await pool.query(
      `SELECT id, name, price, COALESCE(stock, 100) as stock FROM products WHERE id = $1`,
      [parseInt(product_id)],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];
    const basePrice = parseFloat(product.price) * 1500;
    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    const currentStock = parseInt(product.stock) || 100;

    let multiplier = 1.0;

    // 1. Seasonality — match by partial name
    const nameLower = product.name.toLowerCase();
    const seasonalKey = Object.keys(SEASONALITY_MULTIPLIERS).find((k) =>
      nameLower.includes(k),
    );
    const seasonality = seasonalKey ? SEASONALITY_MULTIPLIERS[seasonalKey] : {};
    multiplier *= seasonality[currentMonth] || 1.0;

    // 2. Inventory
    if (currentStock < 5) multiplier *= 1.3;
    else if (currentStock < 20) multiplier *= 1.15;
    else if (currentStock > 100) multiplier *= 0.95;

    // 3. Demand — FIXED: join through orders not order_items.created_at
    let weeklySales = 0;
    try {
      const salesResult = await pool.query(
        `SELECT COUNT(oi.id) as sales
         FROM order_items oi
         JOIN orders o ON o.id = oi.order_id
         WHERE oi.product_id = $1
           AND o.created_at > NOW() - INTERVAL '7 days'`,
        [parseInt(product_id)],
      );
      weeklySales = parseInt(salesResult.rows[0]?.sales || 0);
    } catch (e) {
      console.warn("Sales query skipped:", e.message);
    }

    if (weeklySales > 50) multiplier *= 1.1;
    else if (weeklySales < 5) multiplier *= 0.9;

    // Clamp
    multiplier = Math.min(Math.max(multiplier, 0.7), 1.5);

    const dynamicPrice = Math.round(basePrice * multiplier);

    res.json({
      product_id,
      product_name: product.name,
      base_price: Math.round(basePrice),
      dynamic_price: dynamicPrice,
      discount_percent: multiplier < 1 ? Math.round((1 - multiplier) * 100) : 0,
      markup_percent: multiplier > 1 ? Math.round((multiplier - 1) * 100) : 0,
      factors: {
        seasonality: seasonality[currentMonth]
          ? `${Math.round((seasonality[currentMonth] - 1) * 100)}% seasonal adjustment`
          : "No seasonal adjustment",
        inventory:
          currentStock < 20
            ? `Low stock (${currentStock} units) — premium applied`
            : currentStock > 100
              ? `High stock (${currentStock} units) — discount applied`
              : `Normal stock (${currentStock} units)`,
        demand:
          weeklySales > 50
            ? `High demand — ${weeklySales} sales this week`
            : weeklySales < 5
              ? `Low demand — ${weeklySales} sales this week`
              : `Normal demand — ${weeklySales} sales this week`,
      },
      current_stock: currentStock,
      weekly_sales: weeklySales,
      current_month: currentMonth,
    });
  } catch (err) {
    console.error("Dynamic pricing error:", err.message);
    res.status(500).json({ message: "Pricing error: " + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 5: FRAUD DETECTION
// ═══════════════════════════════════════════════════════════════

router.post("/fraud-check", async (req, res) => {
  try {
    const { user_id, order_amount, payment_method } = req.body;
    const riskFactors = [];
    let riskScore = 0;

    const failed = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE user_id=$1 AND status='cancelled' AND created_at > NOW() - INTERVAL '24 hours'`,
      [parseInt(user_id)],
    );
    if (parseInt(failed.rows[0]?.count || 0) > 3) {
      riskFactors.push("Multiple cancelled orders in the last 24 hours");
      riskScore += 40;
    }

    const avgQ = await pool.query(
      `SELECT AVG(total) as avg_total FROM orders WHERE user_id=$1 AND status != 'cancelled'`,
      [parseInt(user_id)],
    );
    const avgTotal = parseFloat(avgQ.rows[0]?.avg_total || 0);
    if (avgTotal > 0 && order_amount > avgTotal * 5) {
      riskFactors.push("Order is 5x larger than usual spending");
      riskScore += 30;
    }

    const rapid = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE user_id=$1 AND created_at > NOW() - INTERVAL '5 minutes'`,
      [parseInt(user_id)],
    );
    if (parseInt(rapid.rows[0]?.count || 0) > 1) {
      riskFactors.push("Multiple orders placed within 5 minutes");
      riskScore += 35;
    }

    const userQ = await pool.query(
      `SELECT EXTRACT(DAY FROM (NOW() - created_at)) as days_old FROM users WHERE id=$1`,
      [parseInt(user_id)],
    );
    const daysOld = parseInt(userQ.rows[0]?.days_old || 0);
    if (daysOld < 1 && order_amount > 50000) {
      riskFactors.push("New account placing a large first order");
      riskScore += 25;
    }

    const methods = await pool.query(
      `SELECT DISTINCT payment_method FROM orders WHERE user_id=$1`,
      [parseInt(user_id)],
    );
    const known = methods.rows.map((r) => r.payment_method);
    if (known.length > 0 && !known.includes(payment_method)) {
      riskFactors.push("Payment method different from previous orders");
      riskScore += 15;
    }

    const riskLevel =
      riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW";

    res.json({
      user_id,
      risk_level: riskLevel,
      risk_score: riskScore,
      risk_factors: riskFactors,
      should_require_verification: riskScore > 60,
      days_user_active: daysOld,
      average_order_amount: Math.round(avgTotal),
      order_amount,
      recommendation:
        riskScore > 70
          ? "Require manual review before processing"
          : riskScore > 40
            ? "Flag for verification — proceed with caution"
            : "Safe to proceed",
    });
  } catch (err) {
    console.error("Fraud check error:", err.message);
    res.status(500).json({ message: "Fraud check error: " + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 6: DEMAND FORECASTING + INVENTORY ALERTS
// ═══════════════════════════════════════════════════════════════

router.get("/demand-forecast", async (req, res) => {
  try {
    const historical = await pool.query(`
      SELECT p.id, p.name,
        EXTRACT(MONTH FROM o.created_at) as month,
        COUNT(oi.id) as units_sold
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id
        AND o.created_at > NOW() - INTERVAL '90 days'
        AND o.status != 'cancelled'
      GROUP BY p.id, p.name, EXTRACT(MONTH FROM o.created_at)
      ORDER BY p.id, month
    `);

    const productMap = {};
    historical.rows.forEach((row) => {
      if (!productMap[row.id])
        productMap[row.id] = { name: row.name, months: [], total: 0 };
      if (row.month) {
        productMap[row.id].months.push(parseInt(row.units_sold || 0));
        productMap[row.id].total += parseInt(row.units_sold || 0);
      }
    });

    const forecast = Object.entries(productMap)
      .filter(([, d]) => d.total > 0)
      .map(([id, data]) => {
        const avg = data.total / Math.max(data.months.length, 1);
        const last = data.months[data.months.length - 1] || 0;
        const first = data.months[0] || 0;
        const trendFactor =
          data.months.length > 1
            ? last > first
              ? 1.1
              : last < first
                ? 0.9
                : 1.0
            : 1.0;
        return {
          product_id: parseInt(id),
          product_name: data.name,
          historical_monthly_avg: Math.round(avg),
          forecasted_next_month: Math.round(avg * trendFactor),
          trend:
            trendFactor > 1
              ? "INCREASING"
              : trendFactor < 1
                ? "DECREASING"
                : "STABLE",
          confidence: Math.min(95, 50 + data.months.length * 10),
          recommendation:
            trendFactor > 1
              ? "Stock up — demand is rising"
              : "Monitor — demand may be softening",
        };
      })
      .sort((a, b) => b.forecasted_next_month - a.forecasted_next_month)
      .slice(0, 10);

    res.json({ products: forecast, generated_at: new Date().toISOString() });
  } catch (err) {
    console.error("Demand forecast error:", err.message);
    res.status(500).json({ message: "Forecast error: " + err.message });
  }
});

router.get("/inventory-alerts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name,
        COALESCE(stock, 100) as stock,
        COALESCE(low_stock_threshold, 10) as threshold,
        CASE
          WHEN COALESCE(stock, 100) <= COALESCE(low_stock_threshold, 10) THEN 'CRITICAL'
          WHEN COALESCE(stock, 100) <= COALESCE(low_stock_threshold, 10) * 2 THEN 'WARNING'
          ELSE 'OK'
        END as alert_level
      FROM products
      WHERE COALESCE(stock, 100) <= COALESCE(low_stock_threshold, 10) * 2
      ORDER BY stock ASC
    `);

    const critical = result.rows.filter((r) => r.alert_level === "CRITICAL");
    const warning = result.rows.filter((r) => r.alert_level === "WARNING");

    res.json({
      critical_count: critical.length,
      warning_count: warning.length,
      critical_alerts: critical.map((r) => ({
        product_id: r.id,
        name: r.name,
        current_stock: r.stock,
        threshold: r.threshold,
        action: "RESTOCK IMMEDIATELY",
      })),
      warning_alerts: warning.map((r) => ({
        product_id: r.id,
        name: r.name,
        current_stock: r.stock,
        threshold: r.threshold,
        action: "Plan restocking soon",
      })),
    });
  } catch (err) {
    console.error("Inventory alert error:", err.message);
    res.status(500).json({ message: "Alert error: " + err.message });
  }
});

module.exports = router;
