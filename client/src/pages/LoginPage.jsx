import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useLocation } from "react-router-dom";
import { useResponsive } from "../hooks/useResponsive";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();
  const from = location.state?.from || "/home";
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleSubmit = async () => {
    if (!form.email || !form.password)
      return setError("Please fill all fields");
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Left — Illustration */}
        {!isMobile && (
          <div
            style={{
              backgroundColor: "#F1F8F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: "-60px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                backgroundColor: "rgba(46,125,50,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                right: "-40px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                backgroundColor: "rgba(245,124,0,0.06)",
              }}
            />
            <div
              style={{ textAlign: "center", position: "relative", zIndex: 1 }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  fontSize: "160px",
                  lineHeight: 1,
                  filter: "drop-shadow(0 20px 40px rgba(46,125,50,0.2))",
                }}
              >
                🌿
              </motion.div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#2E7D32",
                  marginTop: "24px",
                  marginBottom: "12px",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                Welcome to BemsFarm
              </h2>
              <p
                style={{
                  color: "#5F6368",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  maxWidth: "320px",
                }}
              >
                Nigeria's freshest farm foods delivered straight to your
                doorstep
              </p>
            </div>
          </div>
        )}

        {/* Right — Form */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "40px 20px" : "60px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#202124",
                marginBottom: "8px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              Sign in to BemsFarm
            </h1>
            <p
              style={{
                color: "#9AA0A6",
                marginBottom: "32px",
                fontSize: "15px",
              }}
            >
              Enter your details below
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: "#FFEBEE",
                  border: "1px solid #FFCDD2",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  color: "#C62828",
                  fontSize: "14px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  setError("");
                }}
                placeholder="Email or Phone Number"
                style={{
                  width: "100%",
                  padding: "14px 0",
                  border: "none",
                  borderBottom: `2px solid ${form.email ? "#2E7D32" : "#E8EAED"}`,
                  outline: "none",
                  fontSize: "15px",
                  backgroundColor: "transparent",
                  color: "#202124",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "8px", position: "relative" }}>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm((p) => ({ ...p, password: e.target.value }));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Password"
                style={{
                  width: "100%",
                  padding: "14px 40px 14px 0",
                  border: "none",
                  borderBottom: `2px solid ${form.password ? "#2E7D32" : "#E8EAED"}`,
                  outline: "none",
                  fontSize: "15px",
                  backgroundColor: "transparent",
                  color: "#202124",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  opacity: 0.5,
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <div style={{ textAlign: "right", marginBottom: "28px" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#F57C00",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Forget Password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
                marginBottom: "20px",
              }}
            >
              {loading ? "⏳ Signing in..." : "Log In"}
            </motion.button>

            <div style={{ marginBottom: "20px" }}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  // Auto-login with Google
                  login(
                    {
                      id: decoded.sub,
                      name: decoded.name,
                      email: decoded.email,
                      picture: decoded.picture,
                    },
                    credentialResponse.credential,
                  );
                  navigate(from);
                }}
                onError={() =>
                  setError("Google login failed. Please try again.")
                }
                width="100%"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>

            <div
              style={{
                textAlign: "center",
                color: "#9AA0A6",
                fontSize: "14px",
              }}
            >
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#2E7D32",
                  fontWeight: 700,
                  fontSize: "14px",
                  borderBottom: "1px solid #2E7D32",
                }}
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
