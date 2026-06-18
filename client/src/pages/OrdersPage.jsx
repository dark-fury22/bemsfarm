import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

const STATUS_CONFIG = {
  pending: { color: "#92400E", bg: "#FEF3C7", label: "Pending", icon: "⏳" },
  confirmed: {
    color: "#1E40AF",
    bg: "#DBEAFE",
    label: "Confirmed",
    icon: "✅",
  },
  being_packed: {
    color: "#5B21B6",
    bg: "#EDE9FE",
    label: "Being Packed",
    icon: "📦",
  },
  out_for_delivery: {
    color: "#065F46",
    bg: "#D1FAE5",
    label: "Out for Delivery",
    icon: "🚚",
  },
  delivered: {
    color: "#065F46",
    bg: "#D1FAE5",
    label: "Delivered",
    icon: "🎉",
  },
  cancelled: {
    color: "#991B1B",
    bg: "#FEE2E2",
    label: "Cancelled",
    icon: "❌",
  },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async () => {
    if (!cancelReason.trim()) return alert("Please enter a reason");
    setCancelling(true);
    try {
      await api.patch(`/orders/${cancelModal.id}/cancel`, {
        reason: cancelReason,
      });
      setCancelModal(null);
      setCancelReason("");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

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
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "12px",
            }}
          >
            <button
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
            <span style={{ color: "white" }}>My Orders</span>
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: isMobile ? "26px" : "32px",
              fontWeight: 800,
              color: "white",
              marginBottom: "6px",
            }}
          >
            My Orders
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
            {loading
              ? "Loading..."
              : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: isMobile ? "20px 16px" : "32px 24px",
        }}
      >
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {[
            { key: "all", label: `All (${orders.length})` },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "delivered", label: "Delivered" },
            { key: "cancelled", label: "Cancelled" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "Nunito, sans-serif",
                backgroundColor: filter === f.key ? "#1B4332" : "white",
                color: filter === f.key ? "white" : "#6B7280",
                boxShadow:
                  filter === f.key
                    ? "0 4px 12px rgba(27,67,50,0.3)"
                    : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#DC2626",
                  marginBottom: "4px",
                }}
              >
                Failed to load orders
              </p>
              <p style={{ fontSize: "13px", color: "#DC2626" }}>{error}</p>
            </div>
            <button
              onClick={fetchOrders}
              style={{
                marginLeft: "auto",
                padding: "8px 16px",
                backgroundColor: "#DC2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="skeleton"
                  style={{ height: "16px", width: "40%", marginBottom: "10px" }}
                />
                <div
                  className="skeleton"
                  style={{ height: "12px", width: "25%", marginBottom: "16px" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="skeleton"
                      style={{
                        height: "28px",
                        width: "80px",
                        borderRadius: "50px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "white",
              borderRadius: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "72px", marginBottom: "20px" }}>📭</div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "10px",
              }}
            >
              {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                marginBottom: "24px",
                fontSize: "15px",
              }}
            >
              {filter === "all"
                ? "Your order history will appear here"
                : `You have no ${filter} orders`}
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#1B4332",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "14px 32px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "15px",
                fontFamily: "Nunito, sans-serif",
                boxShadow: "0 4px 16px rgba(27,67,50,0.3)",
              }}
            >
              🛒 Start Shopping
            </motion.button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {filtered.map((order, i) => {
              const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const canCancel = order.status === "pending";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #F3F4F6",
                    overflow: "hidden",
                  }}
                >
                  {/* Order header */}
                  <div
                    style={{
                      padding: "18px 20px",
                      borderBottom: "1px solid #F9FAFB",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "4px",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "Syne, sans-serif",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "#111827",
                          }}
                        >
                          #{order.id}
                        </h3>
                        <span
                          style={{
                            backgroundColor: s.bg,
                            color: s.color,
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "50px",
                          }}
                        >
                          {s.icon} {s.label}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                        {" • "}
                        {order.items?.length || 0} item
                        {(order.items?.length || 0) !== 1 ? "s" : ""}
                        {" • "}
                        {order.payment_method?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 800,
                        fontSize: "20px",
                        color: "#1B4332",
                      }}
                    >
                      ₦{parseFloat(order.total).toLocaleString()}
                    </p>
                  </div>

                  {/* Items */}
                  <div
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #F9FAFB",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {order.items?.slice(0, 4).map((item, j) => (
                        <span
                          key={j}
                          style={{
                            backgroundColor: "#F3F4F6",
                            color: "#4B5563",
                            fontSize: "12px",
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: "8px",
                          }}
                        >
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <span
                          style={{
                            backgroundColor: "#F3F4F6",
                            color: "#9CA3AF",
                            fontSize: "12px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                          }}
                        >
                          +{order.items.length - 4} more
                        </span>
                      )}
                    </div>
                    {order.cancel_reason && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#EF4444",
                          marginTop: "8px",
                          fontStyle: "italic",
                        }}
                      >
                        Cancelled: "{order.cancel_reason}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      padding: "14px 20px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        padding: "9px 18px",
                        backgroundColor: "#1B4332",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "13px",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      View Details →
                    </motion.button>

                    {order.status === "delivered" && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate("/returns")}
                        style={{
                          padding: "9px 18px",
                          backgroundColor: "white",
                          color: "#F59E0B",
                          border: "1px solid #F59E0B",
                          borderRadius: "10px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontFamily: "Nunito, sans-serif",
                        }}
                      >
                        ↩ Return Item
                      </motion.button>
                    )}

                    {canCancel && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCancelModal(order)}
                        style={{
                          padding: "9px 18px",
                          backgroundColor: "white",
                          color: "#EF4444",
                          border: "1px solid #EF4444",
                          borderRadius: "10px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontFamily: "Nunito, sans-serif",
                        }}
                      >
                        Cancel Order
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={(e) =>
              e.target === e.currentTarget && setCancelModal(null)
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                padding: "28px",
                width: "100%",
                maxWidth: "440px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#111827",
                }}
              >
                Cancel Order #{cancelModal.id}?
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "14px",
                  marginBottom: "20px",
                  lineHeight: 1.5,
                }}
              >
                This action cannot be undone. A refund will be processed in 3-5
                business days.
              </p>

              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4B5563",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Why are you cancelling? *
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {[
                  "Changed my mind",
                  "Ordered by mistake",
                  "Found a better price",
                  "Taking too long",
                  "Other",
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => setCancelReason(r)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      textAlign: "left",
                      border: `2px solid ${cancelReason === r ? "#1B4332" : "#E5E7EB"}`,
                      backgroundColor: cancelReason === r ? "#F0FFF4" : "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontFamily: "Nunito, sans-serif",
                      color: cancelReason === r ? "#1B4332" : "#4B5563",
                      fontWeight: cancelReason === r ? 700 : 400,
                      transition: "all 0.2s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                value={cancelReason === "Other" ? "" : cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Or type your own reason..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  fontFamily: "Nunito, sans-serif",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setCancelModal(null)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Keep Order
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCancel}
                  disabled={!cancelReason || cancelling}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "none",
                    borderRadius: "12px",
                    backgroundColor: !cancelReason ? "#9CA3AF" : "#EF4444",
                    color: "white",
                    cursor: !cancelReason ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {cancelling ? "..." : "Cancel Order"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
