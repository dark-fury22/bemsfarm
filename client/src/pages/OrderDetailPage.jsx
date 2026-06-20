import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import api from "../services/api";

/*
  ── BUG FIX ──────────────────────────────────────────────────
  This page used to read from a hardcoded `mockOrders` object with
  only 3 fake IDs, and silently fell back to the FIRST mock order
  whenever a real order ID wasn't found in that fake list:

      const order = mockOrders[id] || Object.values(mockOrders)[0]

  That's why clicking into ANY real order (e.g. "BF-MQM20HLE")
  always showed the same unrelated order — the fallback masked the
  fact that the real order was never being fetched at all.

  Fixed by calling the new GET /orders/:id endpoint and removing
  the mock data + silent fallback entirely. A genuinely missing or
  inaccessible order now shows a clear "not found" state instead of
  someone else's data.
*/

const statusConfig = {
  pending: { color: "#E65100", bg: "#FFF3E0", label: "Pending", icon: "⏳" },
  order_placed: {
    color: "#E65100",
    bg: "#FFF3E0",
    label: "Order Placed",
    icon: "📋",
  },
  confirmed: {
    color: "#1565C0",
    bg: "#E3F2FD",
    label: "Confirmed",
    icon: "✅",
  },
  being_packed: {
    color: "#6A1B9A",
    bg: "#F3E5F5",
    label: "Being Packed",
    icon: "📦",
  },
  out_for_delivery: {
    color: "#00838F",
    bg: "#E0F7FA",
    label: "Out for Delivery",
    icon: "🚚",
  },
  delivered: {
    color: "#2E7D32",
    bg: "#E8F5E9",
    label: "Delivered",
    icon: "🎉",
  },
  cancelled: {
    color: "#C62828",
    bg: "#FFEBEE",
    label: "Cancelled",
    icon: "❌",
  },
};

const trackingSteps = [
  { key: "order_placed", label: "Order Placed", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "being_packed", label: "Being Packed", icon: "📦" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];

function getFoodEmoji(name) {
  const map = {
    "Palm Oil": "🛢️",
    "Garri (White)": "🍚",
    "Garri (Yellow)": "🟡",
    "Fresh Tomatoes": "🍅",
    "Ofada Rice": "🌾",
    "Black-eyed Beans": "⚫",
    "Groundnut Oil": "🥜",
    "Dried Crayfish": "🦐",
  };
  return map[name] || "🛒";
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    api
      .get(`/orders/${id}`)
      .then((res) => {
        if (!cancelled) setOrder(res.data.order);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("Failed to load order:", err.message);
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "40px" }}
          >
            ⏳
          </motion.div>
          <p style={{ color: "#9AA0A6", fontSize: "14px" }}>
            Loading order details...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (notFound || !order) {
    return (
      <PageWrapper>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "56px" }}>🔍</span>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#202124",
              margin: 0,
            }}
          >
            Order not found
          </h2>
          <p style={{ color: "#9AA0A6", margin: 0 }}>
            We couldn't find an order with ID #{id}
          </p>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "12px 28px",
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back to My Orders
          </button>
        </div>
      </PageWrapper>
    );
  }

  const s =
    statusConfig[order.tracking_status] ||
    statusConfig[order.status] ||
    statusConfig.pending;
  const items = order.items || [];
  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.price) * 1500 * i.quantity,
    0,
  );
  const delivery = order.delivery === 0 || subtotal > 15000 ? 0 : 500;
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const currentStepIndex = trackingSteps.findIndex(
    (step) => step.key === order.tracking_status,
  );

  const handleReorder = async () => {
    setReordering(true);
    try {
      const res = await api.get("/products");
      const allProducts = res.data.products;

      items.forEach((item) => {
        const product = allProducts.find(
          (p) => p.id === item.product_id || p.name === item.name,
        );
        if (product) {
          for (let i = 0; i < item.quantity; i++) {
            addToCart(product);
          }
        }
      });
      navigate("/cart");
    } catch (err) {
      console.error("Reorder failed:", err.message);
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
                fontSize: "clamp(20px, 4vw, 24px)",
                fontWeight: 800,
                color: "#202124",
                marginBottom: "4px",
              }}
            >
              Order #{order.id}
            </h1>
            <p style={{ color: "#9AA0A6", fontSize: "14px" }}>
              Placed on {orderDate}
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

        {/* Tracking Steps — only show if not cancelled */}
        {order.status !== "cancelled" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #E8EAED",
              marginBottom: "20px",
              overflowX: "auto",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Order Tracking
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                minWidth: "420px",
              }}
            >
              {trackingSteps.map((step, i) => {
                const done = i <= currentStepIndex;
                const current = i === currentStepIndex;
                return (
                  <div key={step.key} style={{ flex: 1, textAlign: "center" }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        margin: "0 auto",
                        backgroundColor: done ? "#2E7D32" : "#F1F3F4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        border: current ? "2px solid #4CAF50" : "none",
                        boxShadow: current
                          ? "0 0 0 4px rgba(76,175,80,0.2)"
                          : "none",
                      }}
                    >
                      {step.icon}
                    </motion.div>
                    <p
                      style={{
                        fontSize: "11px",
                        marginTop: "8px",
                        fontWeight: done ? 700 : 400,
                        color: done ? "#2E7D32" : "#9AA0A6",
                      }}
                    >
                      {step.label}
                    </p>
                    {i < trackingSteps.length - 1 && (
                      <div
                        style={{
                          height: "3px",
                          backgroundColor:
                            i < currentStepIndex ? "#2E7D32" : "#E8EAED",
                          marginTop: "10px",
                          borderRadius: "2px",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {order.status === "cancelled" && order.cancel_reason && (
          <div
            style={{
              backgroundColor: "#FFEBEE",
              border: "1px solid #FFCDD2",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "#C62828",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Order Cancelled
            </p>
            <p style={{ color: "#9AA0A6", fontSize: "13px", margin: 0 }}>
              Reason: {order.cancel_reason}
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
              Order Items ({items.length})
            </h3>
            {items.map((item, i) => (
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
                    i < items.length - 1 ? "1px solid #F1F3F4" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    minWidth: 0,
                  }}
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
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      getFoodEmoji(item.name)
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "15px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: "13px", color: "#9AA0A6" }}>
                      Qty: {item.quantity} × ₦
                      {(Number(item.price) * 1500).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 800,
                    color: "#2E7D32",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  ₦
                  {(Number(item.price) * 1500 * item.quantity).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Summary + Address */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
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
                    color: delivery === 0 ? "#2E7D32" : "#202124",
                  }}
                >
                  {delivery === 0 ? "Free 🎉" : `₦${delivery.toLocaleString()}`}
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
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>
            </div>

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
                style={{
                  fontSize: "14px",
                  color: "#5F6368",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                📍 {order.address}
              </p>
            </div>

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
                      </motion.span>
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
