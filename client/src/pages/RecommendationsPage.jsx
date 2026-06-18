import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

const DIETARY_OPTIONS = [
  { value: "diabetes", emoji: "🩺", label: "Diabetes" },
  { value: "weight_loss", emoji: "⚖️", label: "Weight Loss" },
  { value: "heart_health", emoji: "❤️", label: "Heart Health" },
  { value: "pregnancy", emoji: "🤰", label: "Pregnancy" },
  { value: "muscle_gain", emoji: "💪", label: "Muscle Building" },
  { value: "hypertension", emoji: "🫀", label: "Blood Pressure" },
  { value: "children", emoji: "👶", label: "Children's Health" },
  { value: "general", emoji: "🥗", label: "General Health" },
];

const FAMILY_SIZES = ["1 person", "2 people", "4 people", "6+ people"];
const BUDGETS = ["₦5,000", "₦10,000", "₦20,000", "₦50,000+"];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isMobile } = useResponsive();

  const [dietaryNeed, setDietaryNeed] = useState("");
  const [familySize, setFamilySize] = useState("4 people");
  const [budget, setBudget] = useState("₦20,000");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState({});
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    if (!dietaryNeed) {
      setError("Please select a health goal.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const res = await api.post("/ai/recommendations", {
        dietary_need: dietaryNeed,
        family_size: familySize,
        budget,
      });

      setResults(res.data);
    } catch (err) {
      console.error("Full error:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not get recommendations.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (rec) => {
    if (!rec.product_id || rec.price == null) {
      navigate("/products");
      return;
    }

    addToCart({
      id: rec.product_id,
      name: rec.product_name,
      price: rec.price,
      unit: rec.suggested_quantity || "1kg",
    });

    setAddedIds((prev) => ({ ...prev, [rec.product_id]: true }));

    setTimeout(() => {
      setAddedIds((prev) => {
        const copy = { ...prev };
        delete copy[rec.product_id];
        return copy;
      });
    }, 2000);
  };

  const priorityConfig = {
    high: { color: "#065F46", bg: "#D1FAE5", label: "Highly Recommended" },
    medium: { color: "#92400E", bg: "#FEF3C7", label: "Recommended" },
    low: { color: "#1E40AF", bg: "#DBEAFE", label: "Also Good" },
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
          padding: isMobile ? "32px 16px 28px" : "48px 40px 36px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            <button
              type="button"
              onClick={() => navigate("/home")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Home
            </button>
            <span> / </span>
            <span style={{ color: "white" }}>AI Recommendations</span>
          </div>

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: 800,
              color: "white",
              marginTop: "10px",
            }}
          >
            AI-Powered Recommendations
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
            Get personalized product suggestions based on your dietary needs
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {/* ERROR DISPLAY */}
        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              border: "1px solid #FCA5A5",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "16px",
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: "16px" }}>
            Tell us about your needs
          </h2>

          {/* DIETARY OPTIONS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {DIETARY_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setDietaryNeed(opt.value);
                  setError("");
                }}
                style={{
                  padding: "12px",
                  borderRadius: "14px",
                  border:
                    dietaryNeed === opt.value
                      ? "2px solid #1B4332"
                      : "2px solid #E5E7EB",
                  background: dietaryNeed === opt.value ? "#F0FFF4" : "white",
                  cursor: "pointer",
                }}
                aria-pressed={dietaryNeed === opt.value}
              >
                <div style={{ fontSize: "20px" }}>{opt.emoji}</div>
                <div style={{ fontSize: "12px" }}>{opt.label}</div>
              </motion.button>
            ))}
          </div>

          {/* FAMILY + BUDGET */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div>
              <h4>Family Size</h4>
              {FAMILY_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFamilySize(s)}
                  style={{
                    marginRight: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    border:
                      familySize === s
                        ? "2px solid #1B4332"
                        : "2px solid #E5E7EB",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div>
              <h4>Budget</h4>
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  style={{
                    marginRight: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    border:
                      budget === b ? "2px solid #1B4332" : "2px solid #E5E7EB",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="button"
            onClick={getRecommendations}
            disabled={!dietaryNeed || loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: loading ? "#E5E7EB" : "#1B4332",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Get Recommendations"}
          </button>
        </div>

        {/* RESULTS */}
        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {results.recommendations?.map((rec) => (
                <div
                  key={rec.product_id}
                  style={{
                    padding: "16px",
                    border: "1px solid #eee",
                    borderRadius: "16px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>{rec.product_name}</h3>

                  <p style={{ fontStyle: "italic" }}>{rec.reason}</p>

                  {rec.price != null && (
                    <p>₦{Number(rec.price).toLocaleString()}</p>
                  )}

                  <button type="button" onClick={() => handleAdd(rec)}>
                    {addedIds[rec.product_id] ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
