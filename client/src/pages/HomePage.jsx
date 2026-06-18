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
  const { isMobile, isTablet, isDesktop, isTabletAny, padding, gap, cols } =
    useResponsive();

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
    bg:    'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
    title: 'Freshness Delivered',
    sub:   'Straight from the farm',
    btn:   'Shop Products',
    img:   'https://images.unsplash.com/photo-1627484142233-50b6ac56d2c8?w=200&q=80',
    path:  '/products',
  },
  {
    bg:    'linear-gradient(135deg, #92400E 0%, #F59E0B 100%)',
    title: 'Skip the Store',
    sub:   'Straight to your doorstep',
    btn:   'Order Now',
    img:   'https://images.unsplash.com/photo-1601493700631-2851bdccf291?w=200&q=80',
    path:  '/products',
  },
  {
    bg:    'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
    title: 'Up to 40% Off',
    sub:   'Save now, thank us later',
    btn:   'Claim Offer',
    img:   'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=200&q=80',
    path:  '/deals',
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
  {banners.map((b, i) => (
    <motion.div key={i}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={() => navigate(b.path)}
      style={{ background: b.bg, borderRadius: '24px', padding: '28px 24px',
        cursor: 'pointer', position: 'relative', overflow: 'hidden', minHeight: '160px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '120px', height: '120px',
        opacity: 0.2, backgroundImage: `url(${b.img})`, backgroundSize: 'cover', borderRadius: '50%' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600,
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
          {b.title}
        </p>
        <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontWeight: 800,
          fontSize: i === 0 ? '22px' : '18px', lineHeight: 1.2, marginBottom: '20px' }}>
          {b.sub}
        </h3>
      </div>
      <motion.button whileTap={{ scale: 0.95 }}
        style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', padding: '8px 18px', borderRadius: '50px', fontWeight: 700,
          cursor: 'pointer', fontSize: '13px', fontFamily: 'Nunito, sans-serif',
          position: 'relative', zIndex: 1 }}>
        {b.btn} →
      </motion.button>
    </motion.div>
  ))}
</div>


          {/* Tabs + Products */}
          {/* Tab bar — replace existing with this: */}
<div style={{ display: 'flex', gap: '4px', marginBottom: '28px',
  borderBottom: '2px solid #F3F4F6', paddingBottom: '0' }}>
  {['Most Ordered', 'In Season', 'Fresh Deals', 'Best Value'].map(tab => (
    <button key={tab} onClick={() => setActiveTab(tab)}
      style={{
        padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: '14px',
        fontWeight: activeTab === tab ? 700 : 500, fontFamily: 'Nunito, sans-serif',
        backgroundColor: 'transparent',
        color: activeTab === tab ? '#1B4332' : '#9CA3AF',
        borderBottom: `2px solid ${activeTab === tab ? '#40916C' : 'transparent'}`,
        marginBottom: '-2px', transition: 'all 0.2s', borderRadius: '0',
      }}>
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
              onClick={() => navigate("/products")}
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
                onClick={() => navigate("/products")}
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
