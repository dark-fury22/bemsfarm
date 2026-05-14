import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const C = {
  bg: "#F5EFE6",
  surface: "#FFFBF5",
  primary: "#3D6B2E",
  accent: "#E07B39",
  text: "#2C1810",
  muted: "#8B6F47",
  border: "#E8DDD0",
};

export default function AIRecommendations() {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIndex, setAddedIndex] = useState(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [cartItems.length]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.post("/ai/recommendations", { cartItems });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const productNameToId = {
    "Ofada Rice": 1,
    "Long Grain Rice": 2,
    "Palm Oil": 3,
    "Groundnut Oil": 4,
    "Black-eyed Beans": 5,
    "Brown Beans": 6,
    "Garri White": 7,
    "Garri Yellow": 8,
    "Fresh Tomatoes": 9,
    "Dried Crayfish": 10,
    Cocoyam: 11,
    "Ugu Leaves": 12,
  };

  const getEmoji = (name) => {
    const map = {
      "Ofada Rice": "🌾",
      "Long Grain Rice": "🍚",
      "Palm Oil": "🛢️",
      "Groundnut Oil": "🥜",
      "Black-eyed Beans": "⚫",
      "Brown Beans": "🟤",
      "Garri White": "🍚",
      "Garri Yellow": "🟡",
      "Fresh Tomatoes": "🍅",
      "Dried Crayfish": "🦐",
      Cocoyam: "🍠",
      "Ugu Leaves": "🥬",
    };
    return map[name] || "🛒";
  };

  if (cartItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        backgroundColor: C.surface,
        borderRadius: "20px",
        padding: "20px",
        border: `1px solid ${C.border}`,
        marginBottom: "16px",
        boxShadow: "0 2px 12px rgba(44,24,16,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${C.primary}, #4A8038)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          🤖
        </div>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.text }}>
            AI Suggestions
          </h3>
          <p style={{ fontSize: "12px", color: C.muted }}>
            Based on your cart items
          </p>
        </div>
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ marginLeft: "auto", fontSize: "20px" }}
          >
            ⏳
          </motion.div>
        )}
      </div>

      {/* Recommendations */}
      <AnimatePresence>
        {!loading &&
          recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: C.bg,
                borderRadius: "14px",
                marginBottom: "10px",
                border: `1px solid ${C.border}`,
              }}
            >
              {/* Emoji */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: C.surface,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {getEmoji(rec.name)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: C.text,
                    marginBottom: "2px",
                  }}
                >
                  {rec.name}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: C.accent,
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  💡 {rec.reason}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.muted,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  🍲 {rec.recipe_tip}
                </p>
              </div>

              {/* Add Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  const productId = productNameToId[rec.name];
                  if (productId) navigate(`/product/${productId}`);
                  setAddedIndex(i);
                  setTimeout(() => setAddedIndex(null), 600);
                }}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "12px",
                  backgroundColor: addedIndex === i ? C.primary : C.accent,
                  border: "none",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 10px rgba(224,123,57,0.35)",
                  transition: "background-color 0.2s",
                }}
              >
                {addedIndex === i ? "✓" : "+"}
              </motion.button>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Refresh */}
      {!loading && recommendations.length > 0 && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fetchRecommendations}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: `1.5px dashed ${C.border}`,
            borderRadius: "14px",
            padding: "10px",
            fontSize: "13px",
            fontWeight: 600,
            color: C.muted,
            cursor: "pointer",
            marginTop: "4px",
          }}
        >
          🔄 Refresh suggestions
        </motion.button>
      )}
    </motion.div>
  );
}
