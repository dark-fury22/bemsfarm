const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const pool = require("./db/pool");
const app = express();

// MUST be before routes
app.use(
  cors({
    origin: [
      "https://bemsfarm.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true, // CRITICAL: allows cookies to be sent
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.post(
  "/api/webhooks/paystack",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = process.env.PAYSTACK_SECRET || "";
      if (!secret) return res.sendStatus(500);

      const hash = crypto
        .createHmac("sha512", secret)
        .update(req.body)
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        return res.sendStatus(401);
      }

      const event = JSON.parse(req.body.toString("utf8"));
      if (event.event === "charge.success") {
        await pool.query(
          `UPDATE orders
           SET status='confirmed', tracking_status='confirmed'
           WHERE payment_ref=$1`,
          [event.data.reference],
        );
        console.log("Payment confirmed for ref:", event.data.reference);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("Webhook error:", err.message);
      res.sendStatus(500);
    }
  },
);

/* app.use(cors({
  origin: [
    'https://bemsfarms.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // CRITICAL: parse cookies

// Routes
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const adminRoutes = require("./routes/admin");
const aiRoutes = require("./routes/ai");
const miscRoutes = require("./routes/misc");
const advancedAiRoutes = require("./routes/advanced-ai");

app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", miscRoutes);
app.use("/api/advanced-ai", advancedAiRoutes);

app.get("/health", (req, res) => res.json({ status: "OK", time: new Date() }));
app.get("/test", (req, res) => {
  res.json({ message: "server works" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
console.log("productsRoutes loaded");

module.exports = app;
