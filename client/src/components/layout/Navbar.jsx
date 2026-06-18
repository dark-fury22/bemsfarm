import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/bemsfarms_logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const isActive = (p) => location.pathname === p;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const NAV_LINKS = [
    { label: "Home", path: "/home" },
    { label: "Shop", path: "/products" },
    { label: "Deals", path: "/deals" },
    { label: "About", path: "/about" },
  ];

  const DROPDOWN_ITEMS = [
    { icon: "👤", label: "My Profile", path: "/profile" },
    { icon: "📦", label: "My Orders", path: "/orders" },
    { icon: "↩️", label: "Returns", path: "/returns" },
    { icon: "🔍", label: "Smart Search", path: "/semantic-search" },
    ...(user?.role === "admin"
      ? [
          { icon: "⚙️", label: "Admin Panel", path: "/admin" },
          { icon: "🔐", label: "Fraud Monitor", path: "/fraud-detection" },
          { icon: "📈", label: "Forecasting", path: "/demand-forecasting" },
        ]
      : []),
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        backgroundColor: "white",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 16px rgba(27,67,50,0.06)" : "none",
        transition: "box-shadow 0.3s, border-color 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* ── LOGO ─────────────────────────────────────── */}
        {/* Logo image has a cream bg — always show on white so it looks correct */}
        <Link
          to={user ? "/home" : "/"}
          style={{
            textDecoration: "none",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="BemsFarms"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              borderRadius: "6px",
            }}
          />
        </Link>

        {/* ── DESKTOP NAV LINKS ────────────────────────── */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flex: 1,
            }}
          >
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: isActive(path) ? 700 : 500,
                    color: isActive(path) ? "#1B4332" : "#6B7280",
                    backgroundColor: isActive(path) ? "#F0FFF4" : "transparent",
                    fontFamily: "Nunito, sans-serif",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(path))
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(path))
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {label}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* spacer when not logged in */}
        {!user && <div style={{ flex: 1 }} />}

        {/* ── RIGHT SIDE ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {user ? (
            <>
              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "10px",
                  lineHeight: 1,
                }}
              >
                <span style={{ fontSize: "20px" }}>🛒</span>
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      backgroundColor: "#F59E0B",
                      color: "white",
                      width: "17px",
                      height: "17px",
                      borderRadius: "50%",
                      fontSize: "9px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Avatar dropdown */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px 6px 6px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "50px",
                    background: "white",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#1B4332")
                  }
                  onMouseLeave={(e) => {
                    if (!menuOpen)
                      e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1B4332, #40916C)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#374151",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#9CA3AF",
                      marginLeft: "2px",
                    }}
                  >
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "14px",
                        padding: "6px",
                        minWidth: "210px",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
                        zIndex: 300,
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 12px 10px",
                          marginBottom: "2px",
                          borderBottom: "1px solid #F3F4F6",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#111827",
                            margin: 0,
                          }}
                        >
                          {user?.name}
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#9CA3AF",
                            margin: "2px 0 0",
                          }}
                        >
                          {user?.email}
                        </p>
                      </div>

                      {DROPDOWN_ITEMS.map((item) => (
                        <div
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setMenuOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "9px 12px",
                            borderRadius: "9px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#374151",
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#F0FFF4")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}

                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "#F3F4F6",
                          margin: "4px 0",
                        }}
                      />
                      <div
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "9px 12px",
                          borderRadius: "9px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#DC2626",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#FEF2F2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Not logged in */
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "9px 20px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "10px",
                  color: "#374151",
                  background: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1B4332";
                  e.currentTarget.style.color = "#1B4332";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "9px 20px",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  background: "#1B4332",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2D6A4F")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1B4332")
                }
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
