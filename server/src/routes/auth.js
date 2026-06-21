const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../db/pool");
const { requiredEnv } = require("../config/env");
const { protect } = require("../middleware/authMiddleware");

const DEV_GOOGLE_CLIENT_ID =
  "399237493446-7k3fijdcv9q4d6pfr4bhnllcbi13vt97.apps.googleusercontent.com";
const JWT_SECRET = requiredEnv("JWT_SECRET", "dev_jwt_secret_change_me");
const REFRESH_SECRET = requiredEnv(
  "REFRESH_SECRET",
  "dev_refresh_secret_change_me",
);
const GOOGLE_CLIENT_ID = requiredEnv("GOOGLE_CLIENT_ID", DEV_GOOGLE_CLIENT_ID);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "7d" }, // 7 days for now (reduce to 15m in production with refresh flow)
  );
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "30d" });
}

async function verifyGoogleCredential(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || payload.email_verified !== true) {
    throw new Error("Google account email is not verified");
  }

  return {
    googleId: payload.sub,
    name: payload.name,
    email: payload.email.toLowerCase(),
    picture: payload.picture,
  };
}

// ── REGISTER ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name?.trim())
      return res.status(400).json({ message: "Name is required" });
    if (!email?.includes("@"))
      return res.status(400).json({ message: "Valid email required" });
    if (!password || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    // Check existing user
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email],
    );
    if (existing.rows.length > 0)
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });

    const hashedPw = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, created_at)
       VALUES ($1, $2, $3, 'user', NOW())
       RETURNING id, name, email, role`,
      [name.trim(), email.toLowerCase().trim(), hashedPw],
    );
    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    await pool.query("UPDATE users SET refresh_token=$1 WHERE id=$2", [
      refreshToken,
      user.id,
    ]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
});

// ── LOGIN ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()],
    );
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw)
      return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
      "UPDATE users SET refresh_token=$1, last_login=NOW() WHERE id=$2",
      [refreshToken, user.id],
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed: " + err.message });
  }
});

// GOOGLE LOGIN / SIGNUP
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const googleUser = await verifyGoogleCredential(credential);
    const existing = await pool.query(
      "SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER($1)",
      [googleUser.email],
    );

    let user = existing.rows[0];

    if (!user) {
      const created = await pool.query(
        `INSERT INTO users (name, email, role, email_verified, created_at)
         VALUES ($1, $2, 'user', true, NOW())
         RETURNING id, name, email, role`,
        [googleUser.name || googleUser.email, googleUser.email],
      );
      user = created.rows[0];
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
      "UPDATE users SET refresh_token=$1, last_login=NOW() WHERE id=$2",
      [refreshToken, user.id],
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google auth error:", err.message);
    res.status(401).json({ message: "Google sign-in failed" });
  }
});

// ── REFRESH TOKEN ────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1 AND refresh_token=$2",
      [decoded.id, token],
    );
    if (!result.rows.length)
      return res.status(401).json({ message: "Refresh token not recognized" });

    const user = result.rows[0];
    const newAccess = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user.id);

    await pool.query("UPDATE users SET refresh_token=$1 WHERE id=$2", [
      newRefresh,
      user.id,
    ]);
    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ token: newAccess });
  } catch (err) {
    res.status(401).json({ message: "Refresh failed: " + err.message });
  }
});

// ── GET ME ───────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// ── LOGOUT ───────────────────────────────────────────────────
router.post("/logout", protect, async (req, res) => {
  await pool.query("UPDATE users SET refresh_token=NULL WHERE id=$1", [
    req.user.id,
  ]);
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

module.exports = router;
