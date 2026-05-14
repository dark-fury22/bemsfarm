import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoImg from "../../assets/logo.png";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const footerLinks = {
    Support: [
      { label: "Help Center", action: () => navigate("/contact") },
      { label: "Track Order", action: () => navigate("/orders") },
      { label: "Returns", action: () => navigate("/profile") },
      { label: "Contact Us", action: () => navigate("/contact") },
    ],
    Account: [
      { label: "My Account", action: () => navigate("/profile") },
      { label: "Login / Register", action: () => navigate("/login") },
      { label: "Cart", action: () => navigate("/cart") },
      { label: "My Orders", action: () => navigate("/orders") },
    ],
    "Quick Links": [
      { label: "Products", action: () => navigate("/products") },
      { label: "About Us", action: () => navigate("/about") },
      { label: "Privacy Policy", action: () => {} },
      { label: "Terms of Use", action: () => {} },
    ],
  };

  const socialLinks = [
    { label: "𝕏", href: "https://twitter.com/bemsfarm", color: "#000000" },
    { label: "f", href: "https://facebook.com/bemsfarm", color: "#1877F2" },
    {
      label: "in",
      href: "https://linkedin.com/company/bemsfarm",
      color: "#0A66C2",
    },
    { label: "📸", href: "https://instagram.com/bemsfarm", color: "#E1306C" },
  ];

  return (
    <footer
      style={{ backgroundColor: "#1A1A2E", color: "white", marginTop: "80px" }}
    >
      {/* Newsletter */}
      <div style={{ backgroundColor: "#2E7D32", padding: "48px 24px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}
            >
              🌾 Subscribe to Bems Farm
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
              Get 10% off your first order and weekly fresh deals
            </p>
          </div>
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "14px 24px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <p style={{ color: "white", fontWeight: 700 }}>
                ✅ Subscribed! Check your inbox for 10% off.
              </p>
            </motion.div>
          ) : (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  minWidth: "240px",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubscribe}
                style={{
                  padding: "14px 24px",
                  borderRadius: "12px",
                  backgroundColor: "#F57C00",
                  border: "none",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe →
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "60px 24px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={logoImg}
                alt="BemsFarm"
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
            </motion.div>
            <span style={{ fontSize: "18px", fontWeight: 800 }}>BemsFarm</span>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              lineHeight: 1.7,
              marginBottom: "20px",
            }}
          >
            Nigeria's premier online farm-fresh food marketplace.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "transform 0.2s",
                }}
              >
                {s.label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                marginBottom: "18px",
                color: "white",
              }}
            >
              {title}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {links.map((link) => (
                <motion.button
                  key={link.label}
                  whileHover={{ x: 4 }}
                  onClick={link.action}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "14px",
                    textAlign: "left",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.6)")
                  }
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4
            style={{ fontSize: "15px", fontWeight: 700, marginBottom: "18px" }}
          >
            Contact
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
            }}
          >
            {[
              { icon: "📍", text: "Lagos, Nigeria" },
              { icon: "📞", text: "+234 800 BEMS FARM" },
              {
                icon: "📧",
                text: "hello@bemsfarm.ng",
                href: "mailto:hello@bemsfarm.ng",
              },
              { icon: "🕐", text: "Mon - Sat: 8am - 8pm" },
            ].map((item) => (
              <div
                key={item.text}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>{item.icon}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#4CAF50")}
                    onMouseLeave={(e) =>
                      (e.target.style.color = "rgba(255,255,255,0.6)")
                    }
                  >
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "20px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
          © 2026 BemsFarm. All rights reserved. Made with 🌿 in Nigeria
        </p>
      </div>
    </footer>
  );
}
