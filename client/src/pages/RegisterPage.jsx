import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useResponsive } from "../hooks/useResponsive";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password)
      return setError("Please fill all required fields");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    try {
      setLoading(true);
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel =
    form.password.length === 0
      ? 0
      : form.password.length < 4
        ? 1
        : form.password.length < 6
          ? 2
          : form.password.length < 8
            ? 3
            : 4;
  const strengthColors = [
    "#E8EAED",
    "#F44336",
    "#FF9800",
    "#2196F3",
    "#4CAF50",
  ];
  const strengthLabels = ["", "Too short", "Weak", "Fair", "Strong"];

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
        {/* Left */}
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
                right: "-60px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                backgroundColor: "rgba(46,125,50,0.06)",
              }}
            />
            <div
              style={{ textAlign: "center", position: "relative", zIndex: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ fontSize: "140px", lineHeight: 1 }}
              >
                🌾
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
                Join BemsFarm Today
              </h2>
              <p
                style={{ color: "#5F6368", fontSize: "15px", lineHeight: 1.6 }}
              >
                Get access to the freshest Nigerian foods and exclusive deals
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  marginTop: "24px",
                }}
              >
                {["🌾 Farm Fresh", "🚚 Fast Delivery", "💯 Quality"].map(
                  (t) => (
                    <span
                      key={t}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #E8EAED",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        color: "#5F6368",
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right */}
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
              Create an Account
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

            {[
              { name: "name", placeholder: "Name *", type: "text" },
              {
                name: "email",
                placeholder: "Email or Phone Number *",
                type: "email",
              },
              { name: "phone", placeholder: "Phone (optional)", type: "tel" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "20px" }}>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [field.name]: e.target.value }));
                    setError("");
                  }}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    border: "none",
                    borderBottom: `2px solid ${form[field.name] ? "#2E7D32" : "#E8EAED"}`,
                    outline: "none",
                    fontSize: "15px",
                    backgroundColor: "transparent",
                    color: "#202124",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            ))}

            {/* Password */}
            <div style={{ marginBottom: "8px", position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm((p) => ({ ...p, password: e.target.value }));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Password *"
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

            {/* Strength bar */}
            {form.password && (
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        backgroundColor:
                          i <= strengthLevel
                            ? strengthColors[strengthLevel]
                            : "#E8EAED",
                        transition: "background-color 0.3s",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: strengthColors[strengthLevel],
                    fontWeight: 500,
                  }}
                >
                  {strengthLabels[strengthLevel]}
                </p>
              </div>
            )}

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
                marginBottom: "16px",
              }}
            >
              {loading ? "⏳ Creating Account..." : "Create Account"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              style={{ marginBottom: "20px" }}
            >
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  login(
                    {
                      id: decoded.sub,
                      name: decoded.name,
                      email: decoded.email,
                      picture: decoded.picture,
                    },
                    credentialResponse.credential,
                  );
                  navigate("/home");
                }}
                onError={() => setError("Google sign up failed.")}
                width="100%"
                text="signup_with"
                shape="rectangular"
              />
            </motion.button>

            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#9AA0A6",
              }}
            >
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
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
                Log In
              </button>
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
