import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/layout/PageWrapper";
import ProductCard from "../components/ui/ProductCard";
import api from "../services/api";
import { useResponsive } from "../hooks/useResponsive";

export default function HomePage() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Most Ordered");
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data.products);
        setCategories(c.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  const tabs = ["Most Ordered", "In Season", "Fresh Deals", "Best Value"];

  const banners = [
    {
      bg: "linear-gradient(135deg, #1B5E20, #2E7D32)",
      title: "Freshness Delivered",
      sub: "Straight from the farm",
      btn: "Find Out",
      emoji: "🧺",
      path: "/products",
    },
    {
      bg: "linear-gradient(135deg, #E65100, #F57C00)",
      title: "Skip the Store",
      sub: "Straight to your doorstep",
      btn: "Order Now",
      emoji: "📦",
      path: "/products",
    },
    {
      bg: "linear-gradient(135deg, #BF360C, #E64A19)",
      title: "Up to 40% Off",
      sub: "Save now, thank us later",
      btn: "Claim Offer",
      emoji: "🎁",
      path: "/deals",
    },
  ];

  return (
    <PageWrapper>
      <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}
        >
          {/* Welcome */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "24px" }}
            >
              <h2
                style={{ fontSize: "22px", fontWeight: 700, color: "#202124" }}
              >
                Welcome back, {user.name?.split(" ")[0]}! 👋
              </h2>
              <p style={{ color: "#9AA0A6", fontSize: "14px" }}>
                What fresh Nigerian food are you looking for today?
              </p>
            </motion.div>
          )}

          {/* Banners */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "1fr 1fr"
                  : "2fr 1fr 1fr",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {banners.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                }}
                style={{
                  borderRadius: "20px",
                  background: b.bg,
                  padding: i === 0 ? "32px" : "24px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: i === 0 ? "200px" : "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => navigate("/deals")}
              >
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    {b.title}
                  </p>
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: i === 0 ? "22px" : "16px",
                      lineHeight: 1.3,
                      marginBottom: "16px",
                    }}
                  >
                    {b.sub}
                  </h3>
                </div>
                <button
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {b.btn}
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    fontSize: i === 0 ? "60px" : "40px",
                    opacity: 0.9,
                  }}
                >
                  {b.emoji}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs + Products */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              marginBottom: "24px",
            }}
            className="hide-scrollbar"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "15px",
                  fontWeight: 600,
                  paddingBottom: "8px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: `2px solid ${activeTab === tab ? "#F57C00" : "transparent"}`,
                  color: activeTab === tab ? "#F57C00" : "#9AA0A6",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{
                    height: "260px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: "16px",
                marginBottom: "48px",
              }}
            >
              {products.slice(0, 6).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/b.path")}
              style={{
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "14px 36px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
              }}
            >
              View All Products →
            </motion.button>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{ fontSize: "20px", fontWeight: 800, color: "#202124" }}
              >
                🌿 Shop by Category
              </h2>
              <button
                onClick={() => navigate("/b.path")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#F57C00",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                See all
              </button>
            </div>
            <div
              style={{ display: "flex", gap: "16px", overflowX: "auto" }}
              className="hide-scrollbar"
            >
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    minWidth: "80px",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "30px",
                      marginBottom: "8px",
                      border: "2px solid #E8EAED",
                    }}
                  >
                    {cat.icon}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#5F6368",
                      fontWeight: 500,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.name.split(" ")[0]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
