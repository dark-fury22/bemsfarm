import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/layout/PageWrapper";
import { useResponsive } from "../hooks/useResponsive";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [windowWidth] = useState(() => window.innerWidth);
  const { isMobile, isTablet, isDesktop, isTabletAny, padding, gap, cols } =
    useResponsive();

  if (!isLoggedIn)
    return (
      <PageWrapper>
        <div
          style={{
            maxWidth: "500px",
            margin: "80px auto",
            textAlign: "center",
            padding: "40px 24px",
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔐</div>
          <h2
            style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}
          >
            Please Sign In
          </h2>
          <p style={{ color: "#9AA0A6", marginBottom: "24px" }}>
            You need to be logged in to view your profile
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
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
              Sign In
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "white",
                color: "#202124",
                border: "1px solid #E8EAED",
                borderRadius: "12px",
                padding: "14px 28px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Register
            </motion.button>
          </div>
        </div>
      </PageWrapper>
    );

  const menuSections = [
    {
      title: "Manage My Account",
      items: [
        { id: "profile", label: "My Profile", icon: "👤" },
        { id: "address", label: "Address Book", icon: "📍" },
        { id: "payment", label: "My Payment Options", icon: "💳" },
      ],
    },
    {
      title: "My Orders",
      items: [
        {
          id: "orders",
          label: "My Orders",
          icon: "📦",
          isNav: true,
          path: "/orders",
        },
        { id: "returns", label: "My Returns", icon: "↩️" },
        { id: "cancellations", label: "My Cancellations", icon: "❌" },
      ],
    },
    {
      title: "My WishList",
      items: [{ id: "wishlist", label: "Saved Items", icon: "❤️" }],
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection user={user} saved={saved} setSaved={setSaved} />;
      case "address":
        return <AddressSection adding={adding} setAdding={setAdding} />;
      case "payment":
        return <PaymentSection />;
      case "returns":
        return <PolicySection type="returns" />;
      case "cancellations":
        return <PolicySection type="cancellations" />;
      case "wishlist":
        return <WishlistSection navigate={navigate} />;
      default:
        return <ProfileSection user={user} saved={saved} setSaved={setSaved} />;
    }
  };

  return (
    <PageWrapper>
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
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
            <span style={{ color: "#202124", fontWeight: 600 }}>
              My Account
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#9AA0A6" }}>
            Welcome! <strong style={{ color: "#F57C00" }}>{user?.name}</strong>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "flex-start",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: window.innerWidth < 768 ? "100%" : "240px",
              flexShrink: 0,
            }}
          >
            {window.innerWidth < 768 ? (
              /* Mobile: horizontal scroll tabs */
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  paddingBottom: "12px",
                  marginBottom: "8px",
                }}
              >
                {[
                  { id: "profile", label: "Profile" },
                  { id: "address", label: "Address" },
                  { id: "payment", label: "Payment" },
                  {
                    id: "orders",
                    label: "Orders",
                    isNav: true,
                    path: "/orders",
                  },
                  { id: "returns", label: "Returns" },
                  { id: "cancellations", label: "Cancel" },
                  { id: "wishlist", label: "Wishlist" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      item.isNav
                        ? navigate(item.path)
                        : setActiveSection(item.id)
                    }
                    style={{
                      whiteSpace: "nowrap",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor:
                        activeSection === item.id ? "#F57C00" : "white",
                      color: activeSection === item.id ? "white" : "#5F6368",
                      flexShrink: 0,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              /* Desktop: vertical sidebar */
              <div>
                {menuSections.map((section) => (
                  <div key={section.title} style={{ marginBottom: "24px" }}>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#202124",
                        marginBottom: "8px",
                        padding: "0 4px",
                      }}
                    >
                      {section.title}
                    </h3>
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          item.isNav
                            ? navigate(item.path)
                            : setActiveSection(item.id)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "10px 12px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "14px",
                          color:
                            activeSection === item.id ? "#F57C00" : "#5F6368",
                          fontWeight: activeSection === item.id ? 600 : 400,
                          borderRadius: "10px",
                          backgroundColor:
                            activeSection === item.id
                              ? "#FFF3E0"
                              : "transparent",
                          transition: "all 0.15s",
                          marginBottom: "2px",
                        }}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #FFCDD2",
                    backgroundColor: "#FFEBEE",
                    color: "#C62828",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  🚪 Sign Out
                </motion.button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>

            {/* Mobile logout */}
            {window.innerWidth < 768 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #FFCDD2",
                  backgroundColor: "#FFEBEE",
                  color: "#C62828",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                🚪 Sign Out
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function ProfileCard({ children, title }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "28px 24px",
        border: "1px solid #E8EAED",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#F57C00",
            marginBottom: "24px",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function ProfileSection({ user, saved, setSaved }) {
  const isMobile = window.innerWidth < 768;
  return (
    <ProfileCard title="Edit Your Profile">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "First Name",
            value: user?.name?.split(" ")[0] || "",
            placeholder: "First Name",
          },
          {
            label: "Last Name",
            value: user?.name?.split(" ")[1] || "",
            placeholder: "Last Name",
          },
          { label: "Email", value: user?.email || "", placeholder: "Email" },
          { label: "Phone", value: user?.phone || "", placeholder: "+234..." },
          {
            label: "Address",
            value: user?.address || "",
            placeholder: "Your address",
            fullWidth: true,
          },
        ].map((f) => (
          <div key={f.label} style={f.fullWidth ? { gridColumn: "1/-1" } : {}}>
            <label
              style={{
                fontSize: "13px",
                color: "#9AA0A6",
                marginBottom: "6px",
                display: "block",
              }}
            >
              {f.label}
            </label>
            <input
              defaultValue={f.value}
              placeholder={f.placeholder}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #E8EAED",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#202124",
                outline: "none",
                backgroundColor: "#F8F9FA",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#E8EAED")}
            />
          </div>
        ))}
      </div>

      <h3
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#202124",
          marginBottom: "14px",
        }}
      >
        Password Changes
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {["Current Password", "New Password", "Confirm New Password"].map(
          (p) => (
            <input
              key={p}
              type="password"
              placeholder={p}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #E8EAED",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "#F8F9FA",
                boxSizing: "border-box",
              }}
            />
          ),
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "1px solid #E8EAED",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          style={{
            padding: "12px 28px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: saved ? "#2E7D32" : "#F57C00",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            transition: "background-color 0.3s",
          }}
        >
          {saved ? "✓ Saved!" : "Save Changes"}
        </motion.button>
      </div>
    </ProfileCard>
  );
}

function AddressSection({ adding, setAdding }) {
  const [addresses] = useState([
    {
      id: 1,
      name: "Home",
      address: "15C West 42nd Street, Lagos",
      phone: "+234 801 234 5678",
      default: true,
    },
  ]);

  return (
    <ProfileCard title="Address Book">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        {addresses.map((addr) => (
          <div
            key={addr.id}
            style={{
              border: `2px solid ${addr.default ? "#2E7D32" : "#E8EAED"}`,
              borderRadius: "14px",
              padding: "16px",
              position: "relative",
            }}
          >
            {addr.default && (
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#E8F5E9",
                  color: "#2E7D32",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "20px",
                }}
              >
                Default
              </span>
            )}
            <p
              style={{ fontWeight: 700, marginBottom: "6px", fontSize: "14px" }}
            >
              {addr.name}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#5F6368",
                marginBottom: "4px",
              }}
            >
              {addr.address}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#5F6368",
                marginBottom: "12px",
              }}
            >
              {addr.phone}
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  fontSize: "13px",
                  color: "#F57C00",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Edit
              </button>
              <button
                style={{
                  fontSize: "13px",
                  color: "#C62828",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setAdding(true)}
          style={{
            border: "2px dashed #E8EAED",
            borderRadius: "14px",
            padding: "20px",
            cursor: "pointer",
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#9AA0A6",
            minHeight: "100px",
          }}
        >
          <span style={{ fontSize: "24px" }}>+</span>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>
            Add New Address
          </span>
        </motion.button>
      </div>

      {adding && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            border: "1px solid #E8EAED",
            borderRadius: "14px",
            padding: "20px",
            backgroundColor: "#F8F9FA",
            marginTop: "8px",
          }}
        >
          <h4
            style={{ fontWeight: 700, marginBottom: "14px", fontSize: "15px" }}
          >
            New Address
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            {[
              "Label (Home/Office)",
              "Full Name",
              "Phone Number",
              "Street Address",
              "City",
              "State",
            ].map((p) => (
              <input
                key={p}
                placeholder={p}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #E8EAED",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => setAdding(false)}
              style={{
                padding: "10px 20px",
                border: "1px solid #E8EAED",
                borderRadius: "8px",
                cursor: "pointer",
                background: "white",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setAdding(false)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#2E7D32",
                color: "white",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Save Address
            </button>
          </div>
        </motion.div>
      )}
    </ProfileCard>
  );
}

function PaymentSection() {
  return (
    <ProfileCard title="My Payment Options">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            type: "Visa",
            last4: "5496",
            expiry: "09/27",
            default: true,
            bg: "#1A1F71",
          },
          {
            type: "Mastercard",
            last4: "2341",
            expiry: "03/26",
            default: false,
            bg: "#EB001B",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              border: `2px solid ${card.default ? "#2E7D32" : "#E8EAED"}`,
              borderRadius: "14px",
              backgroundColor: card.default ? "#F8FFF8" : "white",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "30px",
                  borderRadius: "6px",
                  backgroundColor: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ color: "white", fontSize: "10px", fontWeight: 800 }}
                >
                  {card.type.toUpperCase()}
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                >
                  •••• •••• •••• {card.last4}
                </p>
                <p style={{ fontSize: "12px", color: "#9AA0A6" }}>
                  Expires {card.expiry}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {card.default && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#2E7D32",
                    fontWeight: 600,
                  }}
                >
                  Default
                </span>
              )}
              <button
                style={{
                  fontSize: "13px",
                  color: "#F57C00",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Edit
              </button>
              <button
                style={{
                  fontSize: "13px",
                  color: "#C62828",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={{
          padding: "12px 20px",
          border: "2px dashed #E8EAED",
          borderRadius: "12px",
          cursor: "pointer",
          backgroundColor: "transparent",
          fontSize: "14px",
          fontWeight: 600,
          color: "#9AA0A6",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        + Add New Card
      </motion.button>
    </ProfileCard>
  );
}

function PolicySection({ type }) {
  const isReturns = type === "returns";
  return (
    <ProfileCard title={isReturns ? "My Returns" : "My Cancellations"}>
      <div style={{ textAlign: "center", padding: "32px 20px" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>
          {isReturns ? "↩️" : "❌"}
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
          {isReturns ? "No Returns Yet" : "No Cancelled Orders"}
        </h3>
        <p
          style={{
            color: "#9AA0A6",
            fontSize: "14px",
            lineHeight: 1.6,
            marginBottom: "20px",
          }}
        >
          {isReturns
            ? "You can request a return within 7 days of delivery."
            : "Orders can be cancelled within 1 hour of placement."}
        </p>
        <div
          style={{
            backgroundColor: isReturns ? "#F1F8F1" : "#FFF3E0",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: isReturns ? "#2E7D32" : "#F57C00",
              marginBottom: "10px",
            }}
          >
            {isReturns ? "Return Policy" : "Cancellation Policy"}
          </p>
          {(isReturns
            ? [
                "Returns accepted within 7 days",
                "Items must be in original condition",
                "Refund in 3-5 business days",
                "Contact support@bemsfarm.ng",
              ]
            : [
                "Cancel within 1 hour of order",
                "Orders being prepared cannot be cancelled",
                "Full refund for eligible cancellations",
                "Contact us immediately to cancel",
              ]
          ).map((item) => (
            <p
              key={item}
              style={{
                fontSize: "13px",
                color: "#5F6368",
                marginBottom: "6px",
              }}
            >
              ✓ {item}
            </p>
          ))}
        </div>
      </div>
    </ProfileCard>
  );
}

function WishlistSection({ navigate }) {
  const items = [
    {
      id: 1,
      name: "Dried Crayfish",
      price: 7500,
      img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141631/crayfish_bslwl4.jpg",
    },
    {
      id: 2,
      name: "Palm Oil",
      price: 4800,
      img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141485/palm_oil_ufbfu6.jpg",
    },
  ];
  return (
    <ProfileCard title="My Wishlist">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #E8EAED",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{ width: "100%", height: "130px", objectFit: "cover" }}
            />
            <div style={{ padding: "12px" }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  color: "#2E7D32",
                  fontWeight: 800,
                  fontSize: "15px",
                  marginBottom: "10px",
                }}
              >
                ₦{item.price.toLocaleString()}
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  width: "100%",
                  backgroundColor: "#F57C00",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
