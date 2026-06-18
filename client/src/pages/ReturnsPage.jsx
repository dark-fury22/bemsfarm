import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../services/api";

const RETURN_REASONS = [
  {
    value: "damaged",
    label: "🚫 Item arrived damaged",
    desc: "Product was broken, crushed, or spoiled on arrival",
  },
  {
    value: "wrong_item",
    label: "❓ Received wrong item",
    desc: "I received a different product than what I ordered",
  },
  {
    value: "quality",
    label: "😞 Quality not as expected",
    desc: "The quality did not meet the description",
  },
  {
    value: "changed_mind",
    label: "💭 Changed my mind",
    desc: "I no longer need this item",
  },
  {
    value: "other",
    label: "📝 Other reason",
    desc: "Something else — please describe below",
  },
];

export default function ReturnsPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [myReturns, setMyReturns] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState("new");

  useEffect(() => {
    api
      .get("/orders")
      .then((r) =>
        setOrders(r.data.orders.filter((o) => o.status === "delivered")),
      );
    api.get("/orders/returns").then((r) => setMyReturns(r.data.returns));
  }, []);

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedItem || !reason)
      return alert("Please select an order, item, and reason");
    setSubmitting(true);
    try {
      await api.post("/orders/returns", {
        order_id: selectedOrder.id,
        product_id: selectedItem.product_id,
        quantity: selectedItem.quantity,
        reason,
        description,
      });
      setSuccess(true);
      api.get("/orders/returns").then((r) => setMyReturns(r.data.returns));
    } catch (err) {
      alert(err.response?.data?.message || "Return submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = {
    submitted: { bg: "#FEF3C7", color: "#92400E", label: "Under Review" },
    approved: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
    rejected: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
    refunded: { bg: "#DBEAFE", color: "#1E40AF", label: "Refunded" },
    exchanged: { bg: "#E0E7FF", color: "#3730A3", label: "Exchanged" },
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
          padding: "48px 40px 36px",
          marginBottom: "0",
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
              }}
            >
              Home
            </button>
            <span> / </span>
            <span style={{ color: "white" }}>Returns & Refunds</span>
          </div>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "white",
              marginBottom: "8px",
            }}
          >
            Returns & Refunds
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
            Return an item within 7 days of delivery • Refunds processed in 3-5
            business days
          </p>
        </div>
      </div>

      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #F3F4F6",
            marginBottom: "28px",
          }}
        >
          {["new", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: tab === t ? 700 : 500,
                fontFamily: "Nunito, sans-serif",
                backgroundColor: "transparent",
                color: tab === t ? "#1B4332" : "#9CA3AF",
                borderBottom: `2px solid ${tab === t ? "#40916C" : "transparent"}`,
                marginBottom: "-2px",
              }}
            >
              {t === "new"
                ? "+ New Return Request"
                : `My Returns (${myReturns.length})`}
            </button>
          ))}
        </div>

        {tab === "new" ? (
          success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "white",
                borderRadius: "24px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
              <h2
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#1B4332",
                  marginBottom: "12px",
                }}
              >
                Return Request Submitted!
              </h2>
              <p
                style={{
                  color: "#6B7280",
                  marginBottom: "24px",
                  maxWidth: "400px",
                  margin: "0 auto 24px",
                  lineHeight: 1.6,
                }}
              >
                We've received your return request and will review it within 24
                hours. You'll be notified by email.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSuccess(false);
                    setSelectedOrder(null);
                    setSelectedItem(null);
                    setReason("");
                    setDescription("");
                  }}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#1B4332",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Submit Another Return
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab("history")}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "white",
                    color: "#1B4332",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  View My Returns
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Return Policy Banner */}
              <div
                style={{
                  backgroundColor: "#F0FFF4",
                  border: "1px solid #A7F3D0",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "24px", flexShrink: 0 }}>ℹ️</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#065F46",
                      marginBottom: "6px",
                      fontSize: "14px",
                    }}
                  >
                    Return Policy
                  </p>
                  <ul
                    style={{
                      color: "#047857",
                      fontSize: "13px",
                      paddingLeft: "16px",
                      lineHeight: 2,
                    }}
                  >
                    <li>Returns accepted within 7 days of delivery</li>
                    <li>
                      Items must be in original, unopened condition (except
                      damaged items)
                    </li>
                    <li>
                      Refund processed to original payment method in 3-5
                      business days
                    </li>
                    <li>You may also opt for an exchange of equal value</li>
                  </ul>
                </div>
              </div>

              {/* Step 1: Select Order */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  border: "1px solid #F3F4F6",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#111827",
                    marginBottom: "16px",
                  }}
                >
                  Step 1 — Select the Order
                </h3>
                {orders.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#9CA3AF",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                      📦
                    </div>
                    <p style={{ fontSize: "14px" }}>
                      No delivered orders eligible for return
                    </p>
                    <p style={{ fontSize: "13px" }}>
                      Only orders delivered within the last 7 days can be
                      returned
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrder(order);
                          setSelectedItem(null);
                        }}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          border: `2px solid ${selectedOrder?.id === order.id ? "#40916C" : "#E5E7EB"}`,
                          backgroundColor:
                            selectedOrder?.id === order.id
                              ? "#F0FFF4"
                              : "white",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontWeight: 700,
                                fontSize: "14px",
                                color: "#111827",
                              }}
                            >
                              #{order.id}
                            </p>
                            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                              {new Date(
                                order.created_at || order.date,
                              ).toLocaleDateString()}{" "}
                              • {order.items?.length || 0} items
                            </p>
                          </div>
                          <p
                            style={{
                              fontWeight: 800,
                              color: "#1B4332",
                              fontSize: "15px",
                            }}
                          >
                            ₦{parseFloat(order.total).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Select Item */}
              {selectedOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #F3F4F6",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#111827",
                      marginBottom: "16px",
                    }}
                  >
                    Step 2 — Which item are you returning?
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {selectedOrder.items?.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          border: `2px solid ${selectedItem?.product_id === item.product_id ? "#40916C" : "#E5E7EB"}`,
                          backgroundColor:
                            selectedItem?.product_id === item.product_id
                              ? "#F0FFF4"
                              : "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            backgroundColor: "#F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            flexShrink: 0,
                          }}
                        >
                          🛒
                        </div>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "#111827",
                            }}
                          >
                            {item.name}
                          </p>
                          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p
                          style={{
                            fontWeight: 700,
                            color: "#1B4332",
                            fontSize: "14px",
                          }}
                        >
                          ₦
                          {(item.price * 1500 * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Reason */}
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #F3F4F6",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#111827",
                      marginBottom: "16px",
                    }}
                  >
                    Step 3 — Reason for Return
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {RETURN_REASONS.map((r) => (
                      <div
                        key={r.value}
                        onClick={() => setReason(r.value)}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          border: `2px solid ${reason === r.value ? "#40916C" : "#E5E7EB"}`,
                          backgroundColor:
                            reason === r.value ? "#F0FFF4" : "white",
                          transition: "all 0.2s",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#111827",
                            marginBottom: "2px",
                          }}
                        >
                          {r.label}
                        </p>
                        <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                          {r.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#4B5563",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Additional Details (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please describe the issue in more detail..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "Nunito, sans-serif",
                      color: "#111827",
                      boxSizing: "border-box",
                      marginBottom: "20px",
                    }}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={submitting || !reason}
                    style={{
                      width: "100%",
                      backgroundColor: !reason ? "#9CA3AF" : "#1B4332",
                      color: "white",
                      border: "none",
                      borderRadius: "14px",
                      padding: "16px",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: !reason ? "not-allowed" : "pointer",
                      fontFamily: "Nunito, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting ? (
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
                        Submitting...
                      </>
                    ) : (
                      "📤 Submit Return Request"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          )
        ) : (
          /* HISTORY TAB */
          <div>
            {myReturns.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "white",
                  borderRadius: "24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  No Returns Yet
                </h3>
                <p style={{ color: "#9CA3AF", marginBottom: "20px" }}>
                  You haven't submitted any return requests
                </p>
                <button
                  onClick={() => setTab("new")}
                  style={{
                    backgroundColor: "#1B4332",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 28px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Submit a Return
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {myReturns.map((ret) => {
                  const s = statusColors[ret.status] || statusColors.submitted;
                  return (
                    <div
                      key={ret.id}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        border: "1px solid #F3F4F6",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: "15px",
                              color: "#111827",
                            }}
                          >
                            {ret.product_name}
                          </p>
                          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                            Return #{ret.id} • Order #{ret.order_id}
                          </p>
                        </div>
                        <span
                          style={{
                            backgroundColor: s.bg,
                            color: s.color,
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "4px 12px",
                            borderRadius: "50px",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <p style={{ fontSize: "13px", color: "#4B5563" }}>
                          <strong>Reason:</strong>{" "}
                          {RETURN_REASONS.find((r) => r.value === ret.reason)
                            ?.label || ret.reason}
                        </p>
                        <p style={{ fontSize: "13px", color: "#4B5563" }}>
                          <strong>Submitted:</strong>{" "}
                          {new Date(ret.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {ret.description && (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#9CA3AF",
                            marginTop: "8px",
                            fontStyle: "italic",
                          }}
                        >
                          "{ret.description}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
