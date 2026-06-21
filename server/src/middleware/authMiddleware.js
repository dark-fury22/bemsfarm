const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const { requiredEnv } = require("../config/env");

const JWT_SECRET = requiredEnv("JWT_SECRET", "dev_jwt_secret_change_me");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header (Bearer token)
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback: check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized — no token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user from DB
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [decoded.id],
    );

    if (!result.rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Authorization failed" });
  }
};

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, adminOnly };
