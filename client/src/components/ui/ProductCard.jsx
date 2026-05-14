import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

export function getProductImage(name) {
  const map = {
    "Ofada Rice":
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80",
    "Long Grain Rice":
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=300&q=80",
    "Palm Oil":
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
    "Groundnut Oil":
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
    "Black-eyed Beans":
      "https://images.unsplash.com/photo-1515543904379-3d757efe72e4?w=300&q=80",
    "Brown Beans":
      "https://images.unsplash.com/photo-1515543904379-3d757efe72e4?w=300&q=80",
    "Garri (White)":
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&q=80",
    "Garri (Yellow)":
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&q=80",
    "Fresh Tomatoes":
      "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=300&q=80",
    "Dried Crayfish":
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80",
    Cocoyam:
      "https://images.unsplash.com/photo-1617957743089-c3902b2e89cb?w=300&q=80",
    "Ugu Leaves":
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80",
  };
  return (
    map[name] ||
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"
  );
}

export function getProductBg(name) {
  const map = {
    "Ofada Rice": "#FFF8E1",
    "Long Grain Rice": "#FFFDE7",
    "Palm Oil": "#FBE9E7",
    "Groundnut Oil": "#FFF3E0",
    "Black-eyed Beans": "#F3E5F5",
    "Brown Beans": "#EDE7F6",
    "Garri (White)": "#FAFAFA",
    "Garri (Yellow)": "#FFFDE7",
    "Fresh Tomatoes": "#FFEBEE",
    "Dried Crayfish": "#FBE9E7",
    Cocoyam: "#E8F5E9",
    "Ugu Leaves": "#E8F5E9",
  };
  return map[name] || "#F8F9FA";
}

export function getProductEmoji(name) {
  const map = {
    "Ofada Rice": "🌾",
    "Long Grain Rice": "🍚",
    "Palm Oil": "🫙",
    "Groundnut Oil": "🥜",
    "Black-eyed Beans": "🫘",
    "Brown Beans": "🫘",
    "Garri (White)": "🍚",
    "Garri (Yellow)": "🟡",
    "Fresh Tomatoes": "🍅",
    "Dried Crayfish": "🦐",
    Cocoyam: "🍠",
    "Ugu Leaves": "🥬",
  };
  return map[name] || "🛒";
}

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #E8EAED",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {/* Featured badge */}
      {product.is_featured && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 2,
            backgroundColor: "#F57C00",
            color: "white",
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: "6px",
            letterSpacing: "0.5px",
          }}
        >
          ⭐ TOP
        </div>
      )}

      {/* Wishlist */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 2,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "white",
          border: "1px solid #E8EAED",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        ♡
      </motion.button>

      {/* Image */}
      <div
        style={{
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f8f9fa",
        }}
      >
        <motion.img
          src={getProductImage(product.name)}
          alt={product.name}
          animate={
            added ? { scale: 1.1 } : hovered ? { scale: 1.08 } : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* Fallback emoji */}
        <div
          style={{
            display: "none",
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            backgroundColor: getProductBg(product.name),
          }}
        >
          {getProductEmoji(product.name)}
        </div>
        {/* Add to cart overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(46,125,50,0.92)",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleAdd}
        >
          <span style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>
            {added ? "✓ Added!" : "🛒 Add to Cart"}
          </span>
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px" }}>
        <p
          style={{
            fontSize: "11px",
            color: "#9AA0A6",
            marginBottom: "4px",
            fontWeight: 500,
          }}
        >
          {product.category_name}
        </p>
        <p
          style={{
            fontWeight: 700,
            fontSize: "14px",
            color: "#202124",
            marginBottom: "2px",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <p style={{ fontSize: "12px", color: "#9AA0A6", marginBottom: "10px" }}>
          {product.unit}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontWeight: 800, fontSize: "16px", color: "#2E7D32" }}>
              ₦{(product.price * 1500).toLocaleString()}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleAdd}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              backgroundColor: added ? "#2E7D32" : "#F57C00",
              border: "none",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
              boxShadow: `0 4px 12px ${added ? "rgba(46,125,50,0.4)" : "rgba(245,124,0,0.4)"}`,
            }}
          >
            {added ? "✓" : "+"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
