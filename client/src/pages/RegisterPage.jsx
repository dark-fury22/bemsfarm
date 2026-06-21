import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useResponsive } from "../hooks/useResponsive";
import { GoogleLogin } from "@react-oauth/google";
import AuthWrapper from "../components/layout/AuthWrapper";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { isMobile } = useResponsive();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return setError("Please fill all required fields");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", form);

      login(res.data.user, res.data.token);
      // In RegisterPage.jsx, after successful register:
      const hasOnboarded = localStorage.getItem("bemsfarms_prefs");
      navigate(hasOnboarded ? "/home" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      login(res.data.user, res.data.token);

      const hasOnboarded = localStorage.getItem("bemsfarms_prefs");
      navigate(hasOnboarded ? "/home" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div>
        <Navbar />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          {/* LEFT PANEL */}
          {!isMobile && (
            <div
              style={{
                backgroundColor: "#F1F8F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ fontSize: "140px" }}
                >
                  🌾
                </motion.div>

                <h2 style={{ color: "#2E7D32", fontSize: "28px" }}>
                  Join BemsFarm Today
                </h2>

                <p style={{ color: "#5F6368" }}>
                  Fresh farm foods delivered to you
                </p>
              </div>
            </div>
          )}

          {/* RIGHT PANEL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "40px 20px" : "60px",
            }}
          >
            <motion.div style={{ width: "100%", maxWidth: "400px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: 800 }}>
                Create Account
              </h1>

              {error && (
                <div
                  style={{
                    background: "#FFEBEE",
                    padding: "10px",
                    marginTop: "10px",
                    color: "#C62828",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Name */}
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle(form.name)}
              />

              {/* Email */}
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle(form.email)}
              />

              {/* Phone */}
              <input
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle(form.phone)}
              />

              {/* Password */}
              <div style={{ position: "relative", marginTop: "10px" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  style={inputStyle(form.password, true)}
                />

                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* ✅ PASSWORD STRENGTH METER (NOW ACTUALLY USED) */}
              <PasswordStrengthMeter password={form.password} />

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "14px",
                  background: "#2E7D32",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {/* Google */}
              <div style={{ marginTop: "15px" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign up failed")}
                />
              </div>

              <p style={{ marginTop: "15px", textAlign: "center" }}>
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{ color: "#2E7D32", cursor: "pointer" }}
                >
                  Login
                </span>
              </p>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthWrapper>
  );
}

/* ---------- PASSWORD STRENGTH METER (PROPERLY OUTSIDE COMPONENT) ---------- */

function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Symbol", pass: /[!@#$%^&*]/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;

  const colors = ["#EF4444", "#F59E0B", "#F59E0B", "#22C55E", "#16A34A"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "4px",
              background: i <= score ? colors[score] : "#E5E7EB",
            }}
          />
        ))}
      </div>

      {score > 0 && (
        <p style={{ fontSize: "12px", color: colors[score] }}>
          {labels[score]} password
        </p>
      )}
    </div>
  );
}

/* ---------- INPUT STYLE HELPER ---------- */

function inputStyle(value, password = false) {
  return {
    width: "100%",
    padding: "14px 0",
    marginTop: "10px",
    border: "none",
    borderBottom: `2px solid ${value ? "#2E7D32" : "#E8EAED"}`,
    outline: "none",
    fontSize: "15px",
    background: "transparent",
  };
}
