import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  const links = [
    { label: "Home", path: "/home" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/products?search=${search}`);
      setSearch("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{
          backgroundColor: "#1A1A2E",
          color: "white",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "13px",
        }}
      >
        🌾 Fresh Nigerian Foods — Free Delivery on Orders Over ₦15,000!{" "}
        <button
          onClick={() => navigate("/products")}
          style={{
            color: "#F57C00",
            fontWeight: 700,
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Shop Now
        </button>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #E8EAED",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            height: "70px",
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={logoImg}
              alt="BemsFarm"
              style={{ height: "40px", width: "auto", objectFit: "contain" }}
            />
          </motion.div>
          {/* Desktop Nav Links — hidden on mobile */}
          {!isMobile && (
            <div style={{ display: "flex", gap: "2px" }}>
              {links.map((link) => (
                <motion.button
                  key={link.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(link.path)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor:
                      location.pathname === link.path
                        ? "#F1F8F1"
                        : "transparent",
                    color:
                      location.pathname === link.path ? "#2E7D32" : "#5F6368",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          )}
          {/* Search Bar */}
          {!isMobile && (
            <div
              style={{
                flex: 1,
                maxWidth: "360px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#F1F3F4",
                borderRadius: "12px",
                padding: "10px 16px",
              }}
            >
              <span style={{ fontSize: "16px", opacity: 0.5 }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search rice, palm oil, garri..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  color: "#202124",
                }}
              />
            </div>
          )}
          {/* Right Icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            {/* Mobile Search */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/products")}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#F1F3F4",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                🔍
              </motion.button>
            )}

            {/* Cart */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/cart")}
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#F1F3F4",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🛒
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#F57C00",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <div style={{ position: "relative" }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setUserMenu(!userMenu)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: isLoggedIn ? "#2E7D32" : "#F1F3F4",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isLoggedIn ? "16px" : "18px",
                  color: isLoggedIn ? "white" : "inherit",
                  fontWeight: 700,
                }}
              >
                {isLoggedIn ? user?.name?.[0]?.toUpperCase() || "👤" : "👤"}
              </motion.button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      width: "200px",
                      backgroundColor: "white",
                      borderRadius: "16px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      border: "1px solid #E8EAED",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        <div
                          style={{
                            padding: "14px 16px",
                            borderBottom: "1px solid #E8EAED",
                            backgroundColor: "#F8F9FA",
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: "14px",
                              color: "#202124",
                            }}
                          >
                            {user?.name}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#9AA0A6",
                              marginTop: "2px",
                            }}
                          >
                            {user?.email}
                          </p>
                        </div>
                        {[
                          { icon: "👤", label: "My Profile", path: "/profile" },
                          { icon: "📋", label: "My Orders", path: "/orders" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              navigate(item.path);
                              setUserMenu(false);
                            }}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              color: "#202124",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#F8F9FA")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            {item.icon} {item.label}
                          </button>
                        ))}

                        {user?.email === "est0295@gmail.com" && (
                          <button
                            onClick={() => {
                              navigate("/admin");
                              setUserMenu(false);
                            }}
                            style={{
                              width: "100%",
                              padding: "12px 16px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              color: "#F57C00",
                              fontWeight: 600,
                              borderBottom: "1px solid #E8EAED",
                            }}
                          >
                            ⚙️ Admin Dashboard
                          </button>
                        )}

                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setUserMenu(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "14px",
                            color: "#D32F2F",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderTop: "1px solid #E8EAED",
                          }}
                        >
                          🚪 Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate("/login");
                            setUserMenu(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "14px 16px",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#2E7D32",
                          }}
                        >
                          🌿 Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register");
                            setUserMenu(false);
                          }}
                          style={{
                            width: "100%",
                            padding: "14px 16px",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "14px",
                            borderTop: "1px solid #E8EAED",
                            color: "#202124",
                          }}
                        >
                          ✨ Create Account
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger — ONLY on mobile */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#F1F3F4",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                {menuOpen ? "✕" : "☰"}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid #E8EAED",
                backgroundColor: "white",
              }}
            >
              {/* Mobile Search */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #E8EAED",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#F1F3F4",
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                >
                  <span style={{ opacity: 0.5 }}>🔍</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search products..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div style={{ padding: "8px 16px 16px" }}>
                {links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(link.path);
                      setMenuOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "15px",
                      fontWeight: 500,
                      backgroundColor:
                        location.pathname === link.path
                          ? "#F1F8F1"
                          : "transparent",
                      color:
                        location.pathname === link.path ? "#2E7D32" : "#5F6368",
                      marginBottom: "4px",
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
