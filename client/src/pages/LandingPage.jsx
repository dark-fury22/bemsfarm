import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResponsive } from "../hooks/useResponsive";
import logoImg from "../assets/bemsfarms_logo.png";

// Food photography from Unsplash (free, no attribution needed for web use)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=85", // Nigerian market
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=85", // Fresh vegetables
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=85", // Farm harvest
];

const FOOD_CARDS = [
  {
    name: "Ofada Rice",
    price: "₦3,750",
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141430/ofada_rice_mhhzt2.jpg",
    badge: "🌾 Farm Fresh",
  },
  {
    name: "Palm Oil",
    price: "₦4,800",
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141485/palm_oil_ufbfu6.jpg",
    badge: "🫙 Pure",
  },
  {
    name: "Fresh Tomatoes",
    price: "₦1,800",
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141584/tomatoes_omiotj.jpg",
    badge: "🍅 Seasonal",
  },
  {
    name: "Dried Crayfish",
    price: "₦7,500",
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141631/crayfish_bslwl4.jpg",
    badge: "🦐 Premium",
  },
];

const FEATURES = [
  {
    icon: "🌾",
    title: "Farm Direct",
    desc: "Sourced directly from verified Nigerian farms",
  },
  {
    icon: "⚡",
    title: "2hr Delivery",
    desc: "Same-day delivery across Lagos & Abuja",
  },
  {
    icon: "✅",
    title: "Quality Checked",
    desc: "Every item inspected before it reaches you",
  },
  {
    icon: "💚",
    title: "Fair Prices",
    desc: "Best farm prices, no market middlemen",
  },
];

const TESTIMONIALS = [
  {
    name: "Amaka O.",
    loc: "Lekki, Lagos",
    text: "My Ofada rice arrives fresh every week. Never going back to the market!",
    stars: 5,
  },
  {
    name: "Taiwo A.",
    loc: "Ikeja, Lagos",
    text: "The palm oil is so pure — my egusi soup has never tasted better.",
    stars: 5,
  },
  {
    name: "Chidinma N.",
    loc: "Abuja",
    text: "Fast delivery, great prices. BemsFarms is my go-to for all ingredients.",
    stars: 5,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isMobile, width } = useResponsive();
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef(null);

  // Auto-rotate hero images
  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  // Scroll detection for nav style
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate("/login");
    }
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA", overflowX: "hidden" }}>
      {/* ── Sticky Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: `${scrolled ? "10px" : "16px"} ${isMobile ? "16px" : "40px"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <img
          src={logoImg}
          alt="BemsFarms"
          style={{
            height: isMobile ? "36px" : "44px",
            width: "auto",
            objectFit: "contain",
            filter: scrolled ? "none" : "brightness(0) invert(1)",
            mixBlendMode: scrolled ? "multiply" : "normal",
            transition: "filter 0.3s",
          }}
        />

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 24px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                backgroundColor: scrolled
                  ? "transparent"
                  : "rgba(255,255,255,0.15)",
                border: `1px solid ${scrolled ? "#E8EAED" : "rgba(255,255,255,0.4)"}`,
                color: scrolled ? "#202124" : "white",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              Sign In
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 700,
              backgroundColor: "#F57C00",
              border: "none",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(245,124,0,0.35)",
            }}
          >
            Get Started Free
          </motion.button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background image slideshow */}
        {HERO_IMAGES.map((img, i) => (
          <motion.div
            key={img}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Green tint at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(46,125,50,0.4), transparent)",
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: isMobile ? "100px 20px 60px" : "120px 40px 80px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* Left: Text */}
          <div>
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(46,125,50,0.3)",
                border: "1px solid rgba(76,175,80,0.5)",
                borderRadius: "50px",
                padding: "6px 16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                  boxShadow: "0 0 0 3px rgba(76,175,80,0.3)",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#A5D6A7",
                  letterSpacing: "1.5px",
                }}
              >
                🌿 NIGERIA'S #1 FARM MARKETPLACE
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: isMobile ? "38px" : "58px",
                fontWeight: 900,
                lineHeight: 1.1,
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "20px",
                color: "white",
              }}
            >
              Fresh Nigerian
              <br />
              <span
                style={{
                  color: "#FFB74D",
                  textShadow: "0 0 40px rgba(255,183,77,0.4)",
                }}
              >
                Foods Delivered
              </span>
              <br />
              <span style={{ fontSize: isMobile ? "30px" : "46px" }}>
                Straight to Your Door
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: isMobile ? "15px" : "17px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.7,
                marginBottom: "32px",
                maxWidth: "480px",
              }}
            >
              Rice, palm oil, garri, beans, tomatoes — sourced directly from
              Nigerian farms at the best prices.
              <strong style={{ color: "#A5D6A7" }}>
                {" "}
                Fresh. Fast. Trusted.
              </strong>
            </motion.p>

            {/* Hero search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                display: "flex",
                gap: "0",
                marginBottom: "32px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                maxWidth: "480px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "white",
                  padding: "14px 18px",
                }}
              >
                <span style={{ fontSize: "18px" }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search rice, palm oil, garri..."
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "15px",
                    color: "#202124",
                    background: "transparent",
                  }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  padding: "14px 24px",
                  backgroundColor: "#F57C00",
                  border: "none",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "15px",
                  whiteSpace: "nowrap",
                }}
              >
                Shop Now
              </motion.button>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                gap: isMobile ? "20px" : "32px",
                flexWrap: "wrap",
              }}
            >
              {[
                { num: "50+", label: "Products" },
                { num: "10k+", label: "Customers" },
                { num: "100%", label: "Farm Direct" },
                { num: "2hr", label: "Delivery" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: isMobile ? "22px" : "28px",
                      fontWeight: 900,
                      color: "white",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.6)",
                      marginTop: "2px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating food cards — hide on mobile */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              {FOOD_CARDS.map((card, i) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
                  }}
                  onClick={() => navigate("/login")}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{
                      height: "120px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={card.img}
                      alt={card.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: "rgba(46,125,50,0.9)",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      {card.badge}
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#202124",
                        marginBottom: "4px",
                      }}
                    >
                      {card.name}
                    </p>
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: "15px",
                        color: "#2E7D32",
                      }}
                    >
                      {card.price}
                    </p>
                  </div>
                </motion.div>
              ))}
              {/* CTA card */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/login")}
                style={{
                  gridColumn: "1/-1",
                  backgroundColor: "#F57C00",
                  borderRadius: "16px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 8px 24px rgba(245,124,0,0.4)",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "15px",
                      marginBottom: "2px",
                    }}
                  >
                    🎁 New Customer Offer
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "12px",
                    }}
                  >
                    10% off your first order — use code NEWUSER
                  </p>
                </div>
                <span style={{ color: "white", fontSize: "24px" }}>→</span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Slideshow dots */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 3,
          }}
        >
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{
                width: i === heroIdx ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  i === heroIdx ? "#F57C00" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── FEATURES STRIP ── */}
      <div
        style={{
          backgroundColor: "#2E7D32",
          padding: isMobile ? "32px 20px" : "40px 60px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
            gap: "24px",
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                {f.icon}
              </div>
              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "15px",
                  marginBottom: "6px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PRODUCT SHOWCASE ── */}
      <div
        style={{
          padding: isMobile ? "48px 20px" : "72px 60px",
          backgroundColor: "white",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#F57C00",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              🌿 FARM TO DOORSTEP
            </span>
            <h2
              style={{
                fontSize: isMobile ? "28px" : "40px",
                fontWeight: 900,
                color: "#202124",
                fontFamily: "Space Grotesk, sans-serif",
                marginTop: "10px",
                lineHeight: 1.2,
              }}
            >
              Nigeria's Freshest
              <br />
              Farm Products
            </h2>
            <p
              style={{
                color: "#9AA0A6",
                fontSize: "15px",
                marginTop: "12px",
                maxWidth: "480px",
                margin: "12px auto 0",
              }}
            >
              Everything your kitchen needs, sourced directly from trusted
              Nigerian farms
            </p>
          </div>

          {/* Category grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`,
              gap: "20px",
              marginBottom: "48px",
            }}
          >
            {[
              {
                name: "Rice & Grains",
                img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141706/long_grain_rice_yn01lt.jpg",
                items: "4 varieties",
                color: "#FFF8E1",
              },
              {
                name: "Oils & Fats",
                img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141769/Groundnut-oil_mgv43t.jpg",
                items: "2 varieties",
                color: "#FBE9E7",
              },
              {
                name: "Fresh Produce",
                img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80",
                items: "6 varieties",
                color: "#E8F5E9",
              },
              {
                name: "Legumes",
                img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141864/brown_beans_zxbjos.jpg",
                items: "3 varieties",
                color: "#F3E5F5",
              },
              {
                name: "Spices",
                img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80",
                items: "2 varieties",
                color: "#FFF3E0",
              },
              {
                name: "Tubers & Roots",
                img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141939/cocoyam_wvtyqz.png",
                items: "3 varieties",
                color: "#E0F2F1",
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate("/login")}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  height: isMobile ? "160px" : "200px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{ position: "absolute", bottom: "14px", left: "16px" }}
                >
                  <h3
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: isMobile ? "14px" : "16px",
                      marginBottom: "2px",
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}
                  >
                    {cat.items}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              style={{
                padding: "16px 48px",
                backgroundColor: "#2E7D32",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(46,125,50,0.35)",
              }}
            >
              Shop All Products →
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div
        style={{
          padding: isMobile ? "48px 20px" : "72px 60px",
          backgroundColor: "#F8F9FA",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: isMobile ? "26px" : "36px",
                fontWeight: 900,
                color: "#202124",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              How BemsFarms Works
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${isMobile ? 1 : 3}, 1fr)`,
              gap: "32px",
              position: "relative",
            }}
          >
            {[
              {
                step: "01",
                icon: "🛒",
                title: "Browse & Choose",
                desc: "Pick from 50+ fresh farm products. Filter by category, price, and availability.",
              },
              {
                step: "02",
                icon: "💳",
                title: "Pay Securely",
                desc: "Pay with Paystack, card, bank transfer, or cash on delivery. 100% secure.",
              },
              {
                step: "03",
                icon: "🚚",
                title: "Receive at Door",
                desc: "Your fresh produce arrives within 2 hours in Lagos or next-day nationwide.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  backgroundColor: "white",
                  borderRadius: "24px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#F1F8F1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "0 auto 16px",
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontSize: "40px",
                    fontWeight: 900,
                    color: "rgba(46,125,50,0.08)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#202124",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#9AA0A6",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div
        style={{
          padding: isMobile ? "48px 20px" : "72px 60px",
          backgroundColor: "#1B5E20",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: isMobile ? "26px" : "36px",
                fontWeight: 900,
                color: "white",
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "10px",
              }}
            >
              What Our Customers Say
            </h2>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "4px" }}
            >
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#FFB74D", fontSize: "20px" }}>
                  ★
                </span>
              ))}
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                marginTop: "8px",
                fontSize: "14px",
              }}
            >
              4.9/5 from 2,400+ reviews
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${isMobile ? 1 : 3}, 1fr)`,
              gap: "20px",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{ display: "flex", gap: "2px", marginBottom: "14px" }}
                >
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: "#FFB74D" }}>
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "#F57C00",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      {t.loc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DEALS BANNER ── */}
      <div
        style={{
          margin: isMobile ? "0" : "0",
          backgroundColor: "#F57C00",
          padding: isMobile ? "40px 20px" : "56px 60px",
        }}
      >
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
            <h2
              style={{
                fontSize: isMobile ? "26px" : "40px",
                fontWeight: 900,
                color: "white",
                fontFamily: "Space Grotesk, sans-serif",
                marginBottom: "12px",
              }}
            >
              Up to 40% Off Fresh Farm Products
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: isMobile ? "14px" : "16px",
                marginBottom: "24px",
              }}
            >
              Limited time offer. New customers get 10% off their first order
              automatically.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "16px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "12px 24px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
              >
                Use code:
              </span>
              <span
                style={{
                  color: "#FFF176",
                  fontWeight: 900,
                  fontSize: "20px",
                  letterSpacing: "2px",
                }}
              >
                FRESH20
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText("FRESH20")}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Copy
              </button>
            </div>
            <br />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              style={{
                padding: "16px 48px",
                backgroundColor: "white",
                color: "#F57C00",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
              }}
            >
              Claim Your Discount →
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          backgroundColor: "#1A1A2E",
          color: "white",
          padding: isMobile ? "48px 20px 32px" : "64px 60px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
              gap: "40px",
              marginBottom: "48px",
            }}
          >
            <div>
              <img
                src={logoImg}
                alt="BemsFarms"
                style={{
                  height: "40px",
                  marginBottom: "12px",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  maxWidth: "220px",
                }}
              >
                Nigeria's premier online farm-fresh food marketplace. Quality
                produce delivered to your door.
              </p>
            </div>
            {[
              {
                title: "Quick Links",
                links: ["Products", "About Us", "Contact", "Deals"],
              },
              {
                title: "Account",
                links: ["Sign In", "Register", "My Orders", "Profile"],
              },
              {
                title: "Support",
                links: ["Help Centre", "Returns", "Track Order", "FAQs"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  style={{
                    fontWeight: 700,
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {col.title}
                </h4>
                {col.links.map((l) => (
                  <button
                    key={l}
                    onClick={() => navigate("/login")}
                    style={{
                      display: "block",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.55)",
                      cursor: "pointer",
                      fontSize: "13px",
                      marginBottom: "10px",
                      textAlign: "left",
                      padding: 0,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
              © 2026 BemsFarms. All rights reserved. Made with 🌿 in Nigeria
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["📘", "𝕏", "📸", "💼"].map((icon, i) => (
                <div
                  key={i}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(76,175,80,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(76,175,80,0.1); }
        }
      `}</style>
    </div>
  );
}
