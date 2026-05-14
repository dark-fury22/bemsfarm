import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useResponsive } from "../hooks/useResponsive";
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <PageWrapper>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B5E20, #2E7D32)",
          padding: "64px 24px",
          textAlign: "center",
          color: "white",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "3px",
            fontSize: "13px",
            marginBottom: "12px",
          }}
        >
          GET IN TOUCH
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 900,
            marginBottom: "12px",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          Contact Us
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px" }}>
          We're here to help — reach out anytime
        </p>
      </div>

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 24px" }}
      >
        {/* Breadcrumb */}
        <div
          style={{ fontSize: "13px", color: "#9AA0A6", marginBottom: "40px" }}
        >
          Home /{" "}
          <span style={{ color: "#202124", fontWeight: 600 }}>Contact</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
            gap: "40px",
          }}
        >
          {/* Contact Info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {[
              {
                icon: "📞",
                title: "Call To Us",
                lines: [
                  "We are available 24/7, 7 days a week",
                  "Phone: +234 800 BEMS FARM",
                  "WhatsApp: +234 800 236 7327",
                ],
              },
              {
                icon: "📧",
                title: "Write To Us",
                lines: [
                  "Fill out the form and we'll contact you within 24 hours",
                  "Email: hello@bemsfarm.ng",
                  "Support: support@bemsfarm.ng",
                ],
              },
              {
                icon: "📍",
                title: "Visit Us",
                lines: ["BemsFarm HQ", "Lagos Island, Lagos State", "Nigeria"],
              },
            ].map((info) => (
              <div
                key={info.title}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #E8EAED",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: "#F1F8F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {info.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#202124",
                    }}
                  >
                    {info.title}
                  </h3>
                </div>
                <div
                  style={{ borderTop: "1px solid #E8EAED", paddingTop: "12px" }}
                >
                  {info.lines.map((line) => (
                    <p
                      key={line}
                      style={{
                        fontSize: "13px",
                        color: "#5F6368",
                        marginBottom: "6px",
                        lineHeight: 1.5,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #E8EAED",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "40px 20px" }}
              >
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#2E7D32",
                    marginBottom: "12px",
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: "#9AA0A6", fontSize: "15px" }}>
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "", message: "" });
                  }}
                  style={{
                    marginTop: "24px",
                    backgroundColor: "#2E7D32",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 28px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {[
                    { key: "name", placeholder: "Your Name *", type: "text" },
                    {
                      key: "email",
                      placeholder: "Your Email *",
                      type: "email",
                    },
                    { key: "phone", placeholder: "Your Phone", type: "tel" },
                  ].map((f) => (
                    <input
                      key={f.key}
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                      placeholder={f.placeholder}
                      style={{
                        padding: "14px 16px",
                        border: "1px solid #E8EAED",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "#F8F9FA",
                        color: "#202124",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                      onBlur={(e) => (e.target.style.borderColor = "#E8EAED")}
                    />
                  ))}
                </div>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Your Message *"
                  rows={7}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #E8EAED",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#F8F9FA",
                    resize: "vertical",
                    fontFamily: "Inter, sans-serif",
                    color: "#202124",
                    marginBottom: "20px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8EAED")}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSend}
                    disabled={loading}
                    style={{
                      backgroundColor: "#F57C00",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      padding: "16px 32px",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(245,124,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ⏳
                        </motion.span>{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Message →"
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
