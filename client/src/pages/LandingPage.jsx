import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/bemsfarms_logo.png";

/*
  4D AGRO-TECH DESIGN SYSTEM
  ─────────────────────────────────────────────────────────────────
  Deep soil   #0A1A0A  — hero base (near-black, green undertone)
  Farm green  #1A5C2A  — structural green
  Acid scan   #39FF14  — SINGLE neon accent (the tech signal)
  Warm harvest #F4A01C — CTAs, energy
  Data white  #F0F4EE  — body text (slightly green-tinted)
  Steel grey  #3D4A3D  — card surfaces

  Type: Space Grotesk (display) · Inter (body) · Space Mono (data/HUD)

  Signature element: live-looking FARM STATUS HUD panel overlaid on
  the hero — precision agriculture dashboard aesthetic.
*/

const T = {
  soil: "#0A1A0A",
  green: "#1A5C2A",
  acid: "#39FF14",
  harvest: "#F4A01C",
  white: "#F0F4EE",
  steel: "#3D4A3D",
  muted: "rgba(240,244,238,0.5)",
};

// Real farm photography — dark enough for text overlay
const HERO_IMG =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&q=90";

// HUD data — static but styled as live sensor readouts
const HUD_ROWS = [
  { label: "SOIL TEMP", value: "28.4°C", unit: "optimal", status: "ok" },
  { label: "HUMIDITY", value: "67.2%", unit: "ambient", status: "ok" },
  { label: "STOCK ITEMS", value: "47", unit: "active", status: "ok" },
  { label: "ORDERS TODAY", value: "12", unit: "pending", status: "warn" },
];

// Product feature grid
const FEATURES = [
  {
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141430/ofada_rice_mhhzt2.jpg",
    label: "GRAINS & CEREALS",
    metric: "4 varieties",
  },
  {
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141485/palm_oil_ufbfu6.jpg",
    label: "OILS & FATS",
    metric: "2 varieties",
  },
  {
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141584/tomatoes_omiotj.jpg",
    label: "FRESH PRODUCE",
    metric: "15+ items",
  },
  {
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141864/brown_beans_zxbjos.jpg",
    label: "LEGUMES",
    metric: "6 varieties",
  },
];

const SYSTEM_FEATURES = [
  {
    code: "01",
    title: "AI-Powered Search",
    desc: "Natural language queries. Ask for 'brunch ingredients' and get real results.",
    icon: "⬡",
  },
  {
    code: "02",
    title: "Dynamic Pricing",
    desc: "Prices adjust to seasonal supply, demand, and stock levels in real time.",
    icon: "◈",
  },
  {
    code: "03",
    title: "Chef Bems AI",
    desc: "A Nigerian culinary AI that turns your cart into complete meal plans.",
    icon: "◉",
  },
  {
    code: "04",
    title: "Paystack Secured",
    desc: "Every transaction protected by Nigeria's most trusted payment infrastructure.",
    icon: "⬟",
  },
  {
    code: "05",
    title: "Fraud Detection",
    desc: "ML-powered order analysis flags suspicious activity before it lands.",
    icon: "◆",
  },
  {
    code: "06",
    title: "Zoho IMS Sync",
    desc: "Physical store sales automatically sync inventory across all channels.",
    icon: "⬠",
  },
];

// Ticker phrases cycling in the hero scan line
const TICKER_ITEMS = [
  "FRESHNESS GUARANTEED",
  "FARM-TO-DOOR LOGISTICS",
  "AI-DRIVEN INVENTORY",
  "NIGERIAN AGRO-TECH",
  "PAYSTACK SECURED",
  "REALTIME STOCK SYNC",
];

function useAnimatedCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

function StatCounter({ value, suffix = "" }) {
  const v = useAnimatedCounter(parseInt(value));
  return (
    <>
      {v}
      {suffix}
    </>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tickerIdx, setTickerIdx] = useState(0);
  const [hudPulse, setHudPulse] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated]);

  // Ticker rotation
  useEffect(() => {
    const t = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  // HUD "live" pulse every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setHudPulse((p) => !p);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        backgroundColor: T.soil,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "14px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(10,26,10,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid rgba(57,255,20,0.12)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logo}
            alt="BemsFarms"
            style={{ height: "36px", filter: "brightness(0) invert(1)" }}
            onError={(e) => (e.target.style.display = "none")}
          />
          {/* Acid accent line under logo — the one use of #39FF14 */}
          <div
            style={{
              width: "1px",
              height: "28px",
              backgroundColor: T.acid,
              boxShadow: `0 0 8px ${T.acid}`,
              marginLeft: "4px",
            }}
          />
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              color: T.acid,
              letterSpacing: "2px",
              opacity: 0.9,
            }}
          >
            AGRO-TECH PLATFORM
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <motion.button
            whileHover={{ backgroundColor: "rgba(244,160,28,0.1)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            style={{
              padding: "9px 22px",
              backgroundColor: "transparent",
              border: `1px solid rgba(244,160,28,0.4)`,
              borderRadius: "8px",
              color: T.harvest,
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background 0.2s",
            }}
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: `0 8px 24px rgba(244,160,28,0.4)`,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/register")}
            style={{
              padding: "9px 22px",
              backgroundColor: T.harvest,
              border: "none",
              borderRadius: "8px",
              color: T.soil,
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingTop: "72px",
        }}
      >
        {/* Background farm photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.28) saturate(0.6)",
          }}
        />

        {/* Grid overlay — the "4D" texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(57,255,20,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57,255,20,0.04) 1px, transparent 1px)
          `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(10,26,10,0.7) 100%)`,
          }}
        />

        {/* Scanline ticker at top of hero */}
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            right: 0,
            backgroundColor: "rgba(57,255,20,0.08)",
            borderBottom: `1px solid rgba(57,255,20,0.2)`,
            borderTop: `1px solid rgba(57,255,20,0.2)`,
            padding: "7px 40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "9px",
              color: T.acid,
              letterSpacing: "3px",
              flexShrink: 0,
            }}
          >
            SYS ▶
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={tickerIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "10px",
                color: T.acid,
                letterSpacing: "3px",
                opacity: 0.85,
              }}
            >
              {TICKER_ITEMS[tickerIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Main hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "80px 40px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "60px",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left: headline + CTAs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                BF-2026 · PLATFORM v2.4
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "clamp(44px, 6vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.0,
                color: T.white,
                marginBottom: "8px",
                letterSpacing: "-2px",
              }}
            >
              Nigerian
              <br />
              <span style={{ color: T.harvest }}>Farm-Fresh</span>
              <br />
              Redefined.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(15px, 2vw, 17px)",
                color: T.muted,
                lineHeight: 1.7,
                marginBottom: "40px",
                maxWidth: "480px",
              }}
            >
              AI-powered search, dynamic pricing, and chef-grade recommendations
              — all backed by direct Nigerian farm sourcing and Paystack-secured
              payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 12px 32px rgba(244,160,28,0.45)`,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                style={{
                  padding: "16px 40px",
                  backgroundColor: T.harvest,
                  border: "none",
                  borderRadius: "10px",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  color: T.soil,
                  cursor: "pointer",
                  boxShadow: `0 6px 20px rgba(244,160,28,0.3)`,
                }}
              >
                Start Shopping
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "rgba(240,244,238,0.08)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                style={{
                  padding: "16px 32px",
                  backgroundColor: "transparent",
                  border: `1px solid rgba(240,244,238,0.25)`,
                  borderRadius: "10px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: T.white,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Sign In →
              </motion.button>
            </motion.div>
          </div>

          {/* Right: FARM STATUS HUD — the signature element */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              backgroundColor: "rgba(10,26,10,0.75)",
              border: `1px solid rgba(57,255,20,0.2)`,
              borderRadius: "12px",
              padding: "24px",
              backdropFilter: "blur(16px)",
              boxShadow: `0 0 40px rgba(57,255,20,0.05), inset 0 1px 0 rgba(57,255,20,0.1)`,
              fontFamily: "Space Mono, monospace",
            }}
          >
            {/* HUD header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: `1px solid rgba(57,255,20,0.15)`,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: T.acid,
                }}
              >
                FARM STATUS
              </span>
              <motion.div
                animate={{ opacity: hudPulse ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: T.acid,
                    boxShadow: `0 0 6px ${T.acid}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "9px",
                    color: T.acid,
                    letterSpacing: "2px",
                  }}
                >
                  LIVE
                </span>
              </motion.div>
            </div>

            {/* HUD rows */}
            {HUD_ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    i < HUD_ROWS.length - 1
                      ? `1px solid rgba(57,255,20,0.06)`
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    color: T.muted,
                    letterSpacing: "2px",
                  }}
                >
                  {row.label}
                </span>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: row.status === "warn" ? T.harvest : T.white,
                    }}
                  >
                    {row.value}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: T.muted,
                      marginLeft: "6px",
                      letterSpacing: "1px",
                    }}
                  >
                    {row.unit}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Separator */}
            <div
              style={{
                margin: "20px 0 16px",
                borderTop: `1px solid rgba(57,255,20,0.15)`,
              }}
            />

            {/* Mini product thumbnails */}
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "2.5px",
                color: T.muted,
                marginBottom: "12px",
              }}
            >
              ACTIVE CATALOGUE
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  style={{
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: `1px solid rgba(57,255,20,0.1)`,
                    position: "relative",
                    height: "60px",
                  }}
                >
                  <img
                    src={f.img}
                    alt={f.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.5) saturate(0.7)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "6px",
                      fontSize: "8px",
                      color: T.white,
                      letterSpacing: "1px",
                    }}
                  >
                    {f.label.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <div
        style={{
          backgroundColor: T.steel,
          borderTop: `1px solid rgba(57,255,20,0.1)`,
          borderBottom: `1px solid rgba(57,255,20,0.1)`,
          padding: "24px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {[
            { val: 47, suffix: "+", label: "Farm products" },
            { val: 8, suffix: "", label: "Categories" },
            { val: 100, suffix: "%", label: "Nigerian sourced" },
            { val: 6, suffix: "", label: "AI features" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 900,
                  color: T.white,
                  margin: 0,
                }}
              >
                <StatCounter value={s.val} suffix={s.suffix} />
              </p>
              <p
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "10px",
                  color: T.muted,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SYSTEM FEATURES ── */}
      <section
        style={{ padding: "80px 40px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              letterSpacing: "3px",
              color: T.muted,
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            PLATFORM CAPABILITIES
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              color: T.white,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
          >
            Built different.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {SYSTEM_FEATURES.map((f, i) => (
            <motion.div
              key={f.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ borderColor: "rgba(244,160,28,0.3)", y: -4 }}
              style={{
                backgroundColor: T.steel,
                border: `1px solid rgba(240,244,238,0.08)`,
                borderRadius: "12px",
                padding: "28px",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "22px",
                    color: T.harvest,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "9px",
                      color: T.muted,
                      letterSpacing: "2px",
                      marginBottom: "6px",
                    }}
                  >
                    {f.code}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: T.white,
                      marginBottom: "8px",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: T.muted,
                      lineHeight: 1.6,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT CATALOGUE STRIP ── */}
      <section
        style={{
          backgroundColor: T.green,
          padding: "60px 40px",
          borderTop: `1px solid rgba(57,255,20,0.1)`,
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              color: "rgba(240,244,238,0.5)",
              letterSpacing: "3px",
              marginBottom: "32px",
            }}
          >
            LIVE CATALOGUE — FARM FRESH PRODUCTS
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/register")}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  height: "160px",
                }}
              >
                <img
                  src={f.img}
                  alt={f.label}
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
                      "linear-gradient(to top, rgba(10,26,10,0.85) 0%, transparent 55%)",
                  }}
                />
                <div
                  style={{ position: "absolute", bottom: "12px", left: "14px" }}
                >
                  <p
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "9px",
                      letterSpacing: "2px",
                      color: T.acid,
                      marginBottom: "3px",
                    }}
                  >
                    {f.metric}
                  </p>
                  <p
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: T.white,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {f.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "100px 40px",
          textAlign: "center",
          background: `linear-gradient(to bottom, ${T.soil}, #0D230D)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(57,255,20,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57,255,20,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              letterSpacing: "3px",
              color: T.muted,
              marginBottom: "20px",
            }}
          >
            READY TO DEPLOY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 900,
              color: T.white,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            The future of Nigerian
            <br />
            food shopping is here.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              color: T.muted,
              marginBottom: "40px",
              maxWidth: "480px",
              margin: "0 auto 40px",
            }}
          >
            Farm-fresh ingredients, AI-guided cooking, Paystack-secured
            checkout. Create a free account in under 60 seconds.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 16px 48px rgba(244,160,28,0.5)`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/register")}
            style={{
              padding: "18px 56px",
              backgroundColor: T.harvest,
              border: "none",
              borderRadius: "10px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 900,
              fontSize: "16px",
              color: T.soil,
              cursor: "pointer",
              letterSpacing: "0.5px",
            }}
          >
            Create Free Account
          </motion.button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: "#060D06",
          borderTop: `1px solid rgba(57,255,20,0.08)`,
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={logo}
            alt="BemsFarms"
            style={{ height: "28px", filter: "brightness(0) invert(0.7)" }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "9px",
              color: T.muted,
              letterSpacing: "1.5px",
            }}
          >
            © 2026 BEMSFARMS · NIGERIA
          </span>
        </div>
        <span
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "9px",
            color: "rgba(240,244,238,0.2)",
            letterSpacing: "1.5px",
          }}
        >
          PLATFORM v2.4 · AGRO-TECH EDITION
        </span>
      </footer>
    </div>
  );
}
