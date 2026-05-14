const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db/pool');
const authRoutes      = require('./routes/auth');
const productRoutes   = require('./routes/products');
const categoryRoutes  = require('./routes/categories');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Frutella API is running 🥬' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
