import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";

const mockOrders = [
  {
    id: "BF-A1B2C3D4",
    date: "2026-05-07",
    status: "delivered",
    items: ["Palm Oil", "Garri (White)", "Fresh Tomatoes"],
    total: 12750,
    itemCount: 3,
  },
  {
    id: "BF-E5F6G7H8",
    date: "2026-05-06",
    status: "confirmed",
    items: ["Ofada Rice", "Black-eyed Beans"],
    total: 9900,
    itemCount: 2,
  },
  {
    id: "BF-I9J0K1L2",
    date: "2026-05-05",
    status: "pending",
    items: ["Groundnut Oil", "Dried Crayfish"],
    total: 21750,
    itemCount: 2,
  },
];

const statusConfig = {
  pending: { color: "#E65100", bg: "#FFF3E0", label: "Pending", icon: "⏳" },
  confirmed: {
    color: "#1565C0",
    bg: "#E3F2FD",
    label: "Confirmed",
    icon: "✅",
  },
  delivered: {
    color: "#2E7D32",
    bg: "#E8F5E9",
    label: "Delivered",
    icon: "📦",
  },
  cancelled: {
    color: "#C62828",
    bg: "#FFEBEE",
    label: "Cancelled",
    icon: "❌",
  },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("all");
  const tabs = ["all", "pending", "confirmed", "delivered", "cancelled"];
  const filtered =
    active === "all"
      ? mockOrders
      : mockOrders.filter((o) => o.status === active);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

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
            onClick={() => navigate("/profile")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA0A6",
            }}
          >
            My Account
          </button>
          <span>/</span>
          <span style={{ color: "#202124", fontWeight: 600 }}>My Orders</span>
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#202124",
            marginBottom: "8px",
          }}
        >
          My Orders
        </h1>
        <p style={{ color: "#9AA0A6", marginBottom: "28px" }}>
          {mockOrders.length} total orders
        </p>

        {/* Status tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid #E8EAED",
            paddingBottom: "0",
          }}
          className="hide-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                padding: "10px 16px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: active === tab ? 700 : 500,
                color: active === tab ? "#2E7D32" : "#9AA0A6",
                borderBottom: `2px solid ${active === tab ? "#2E7D32" : "transparent"}`,
                marginBottom: "-1px",
                textTransform: "capitalize",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab === "all" ? "All Orders" : tab}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "white",
              borderRadius: "20px",
              border: "1px solid #E8EAED",
            }}
          >
            <div style={{ fontSize: "80px", marginBottom: "16px" }}>📭</div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#202124",
                marginBottom: "8px",
              }}
            >
              No orders here
            </h3>
            <p style={{ color: "#9AA0A6", marginBottom: "24px" }}>
              You haven't placed any {active !== "all" ? active : ""} orders yet
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "14px 28px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Start Shopping 🌾
            </motion.button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filtered.map((order, i) => {
              const s = statusConfig[order.status];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: "1px solid #E8EAED",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#202124",
                          marginBottom: "4px",
                        }}
                      >
                        #{order.id}
                      </p>
                      <p style={{ fontSize: "13px", color: "#9AA0A6" }}>
                        {order.date} • {order.itemCount} items
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: s.bg,
                        color: s.color,
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "6px 14px",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {s.icon} {s.label}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    {order.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          backgroundColor: "#F8F9FA",
                          border: "1px solid #E8EAED",
                          borderRadius: "8px",
                          padding: "4px 12px",
                          fontSize: "13px",
                          color: "#5F6368",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "16px",
                      borderTop: "1px solid #F1F3F4",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#9AA0A6",
                          marginBottom: "2px",
                        }}
                      >
                        Total Amount
                      </p>
                      <p
                        style={{
                          fontWeight: 800,
                          fontSize: "18px",
                          color: "#2E7D32",
                        }}
                      >
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          border: "1px solid #E8EAED",
                          backgroundColor: "white",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#5F6368",
                        }}
                      >
                        View Details →
                      </motion.button>
                      {order.status === "delivered" && (
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            navigate(`/orders/${order.id}?reorder=true`)
                          }
                          style={{
                            padding: "10px 20px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "#2E7D32",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          Reorder
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
