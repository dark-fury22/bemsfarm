import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useResponsive } from "../hooks/useResponsive";
import { useState, useEffect } from "react";
import api from "../services/api";

const mockOrders = {
  "BF-A1B2C3D4": {
    id: "BF-A1B2C3D4",
    date: "2026-05-07",
    status: "delivered",
    address: "15C West 42nd Street, Lagos",
    items: [
      { name: "Palm Oil", qty: 2, price: 4800 },
      { name: "Garri (White)", qty: 1, price: 1350 },
      { name: "Fresh Tomatoes", qty: 2, price: 1800 },
    ],
    delivery: 0,
  },
  "BF-E5F6G7H8": {
    id: "BF-E5F6G7H8",
    date: "2026-05-06",
    status: "confirmed",
    address: "15C West 42nd Street, Lagos",
    items: [
      { name: "Ofada Rice", qty: 2, price: 3750 },
      { name: "Black-eyed Beans", qty: 1, price: 2400 },
    ],
    delivery: 1500,
  },
  "BF-I9J0K1L2": {
    id: "BF-I9J0K1L2",
    date: "2026-05-05",
    status: "pending",
    address: "15C West 42nd Street, Lagos",
    items: [
      { name: "Groundnut Oil", qty: 3, price: 6750 },
      { name: "Dried Crayfish", qty: 1, price: 7500 },
    ],
    delivery: 0,
  },
};

const statusConfig = {
  pending: {
    color: "#E65100",
    bg: "#FFF3E0",
    label: "Pending",
    icon: "⏳",
    step: 1,
  },
  confirmed: {
    color: "#1565C0",
    bg: "#E3F2FD",
    label: "Confirmed",
    icon: "✅",
    step: 2,
  },
  delivered: {
    color: "#2E7D32",
    bg: "#E8F5E9",
    label: "Delivered",
    icon: "📦",
    step: 4,
  },
};

const steps = [
  "Order Placed",
  "Confirmed",
  "Being Packed",
  "Out for Delivery",
  "Delivered",
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockOrders[id] || Object.values(mockOrders)[0];
  const s = statusConfig[order.status];
  const subtotal = order.items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const { addToCart } = useCart();
  const { isMobile } = useResponsive();
  const [reordering, setReordering] = useState(false);

  const handleReorder = async () => {
    setReordering(true);
    try {
      // Fetch all products to get full product objects
      const res = await api.get("/products");
      const allProducts = res.data.products;

      order.items.forEach((item) => {
        const product = allProducts.find((p) => p.name === item.name);
        if (product) {
          for (let i = 0; i < item.qty; i++) {
            addToCart(product);
          }
        }
      });
      navigate("/cart");
    } catch (err) {
      // Fallback: add with basic info
      order.items.forEach((item) => {
        for (let i = 0; i < item.qty; i++) {
          addToCart({
            id: Math.random(),
            name: item.name,
            price: item.price / 1500,
            unit: "1kg",
            category_name: "Food",
          });
        }
      });
      navigate("/cart");
    } finally {
      setReordering(false);
    }
  };

  return (
    <PageWrapper>
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            fontSize: "13px",
            color: "#9AA0A6",
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA0A6",
            }}
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/orders")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA0A6",
            }}
          >
            My Orders
          </button>
          <span>/</span>
          <span style={{ color: "#202124", fontWeight: 600 }}>#{order.id}</span>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#202124",
                marginBottom: "4px",
              }}
            >
              Order #{order.id}
            </h1>
            <p style={{ color: "#9AA0A6", fontSize: "14px" }}>
              Placed on {order.date}
            </p>
          </div>
          <span
            style={{
              backgroundColor: s.bg,
              color: s.color,
              fontSize: "14px",
              fontWeight: 700,
              padding: "8px 20px",
              borderRadius: "20px",
            }}
          >
            {s.icon} {s.label}
          </span>
        </div>

        {/* Tracking Steps */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #E8EAED",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}
          >
            Order Tracking
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              overflowX: "auto",
            }}
          >
            {steps.map((step, i) => {
              const done = i < s.step;
              const current = i === s.step - 1;
              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: i < steps.length - 1 ? 1 : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: "80px",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor:
                          done || current ? "#2E7D32" : "#F1F3F4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "8px",
                        border: current ? "3px solid #4CAF50" : "none",
                        boxShadow: current
                          ? "0 0 0 4px rgba(76,175,80,0.2)"
                          : "none",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>
                        {done || current ? "✓" : "○"}
                      </span>
                    </motion.div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: done || current ? "#2E7D32" : "#9AA0A6",
                        fontWeight: done || current ? 700 : 400,
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {step}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: "3px",
                        backgroundColor: done ? "#2E7D32" : "#E8EAED",
                        marginBottom: "28px",
                        borderRadius: "2px",
                        transition: "background-color 0.3s",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
            gap: "20px",
          }}
        >
          {/* Items */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #E8EAED",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Order Items ({order.items.length})
            </h3>
            {order.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "14px",
                  marginBottom: "14px",
                  borderBottom:
                    i < order.items.length - 1 ? "1px solid #F1F3F4" : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "10px",
                      backgroundColor: "#F8F9FA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      border: "1px solid #E8EAED",
                    }}
                  >
                    {getFoodEmoji(item.name)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "15px" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "13px", color: "#9AA0A6" }}>
                      Qty: {item.qty} × ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 800,
                    color: "#2E7D32",
                    fontSize: "16px",
                  }}
                >
                  ₦{(item.price * item.qty).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Summary + Address */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Summary */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #E8EAED",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#9AA0A6", fontSize: "14px" }}>
                  Subtotal
                </span>
                <span style={{ fontWeight: 600 }}>
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px dashed #E8EAED",
                }}
              >
                <span style={{ color: "#9AA0A6", fontSize: "14px" }}>
                  Delivery
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    color: order.delivery === 0 ? "#2E7D32" : "#202124",
                  }}
                >
                  {order.delivery === 0
                    ? "Free 🎉"
                    : `₦${order.delivery.toLocaleString()}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "16px" }}>Total</span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "20px",
                    color: "#2E7D32",
                  }}
                >
                  ₦{(subtotal + order.delivery).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #E8EAED",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Delivery Address
              </h3>
              <p
                style={{ fontSize: "14px", color: "#5F6368", lineHeight: 1.6 }}
              >
                📍 {order.address}
              </p>
            </div>

            {/* Actions */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {order.status === "delivered" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReorder}
                  disabled={reordering}
                  style={{
                    width: "100%",
                    backgroundColor: reordering ? "#5A8F3E" : "#2E7D32",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px",
                    fontWeight: 700,
                    cursor: reordering ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {reordering ? (
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
                      Adding to cart...
                    </>
                  ) : (
                    "🔄 Reorder All Items"
                  )}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/orders")}
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "#202124",
                  border: "1px solid #E8EAED",
                  borderRadius: "12px",
                  padding: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                ← Back to Orders
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function getFoodEmoji(name) {
  const map = {
    "Palm Oil": "🛢️",
    "Garri (White)": "🍚",
    "Fresh Tomatoes": "🍅",
    "Ofada Rice": "🌾",
    "Black-eyed Beans": "⚫",
    "Groundnut Oil": "🥜",
    "Dried Crayfish": "🦐",
  };
  return map[name] || "🛒";
}
