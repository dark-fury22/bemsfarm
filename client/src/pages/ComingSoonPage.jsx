import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/bemsfarms_logo.png";

/*
  ── SECRET DEVELOPER ACCESS ──────────────────────────────────────
  The coming soon page shows publicly. To access the real app:
  Click the BemsFarms logo exactly 5 times in a row within 3 seconds.
  This navigates to /launch (the real landing page).

  Only you and your team know this. The route /launch is not linked
  from anywhere on the public site, so regular visitors won't find it.
  You can also navigate directly to /launch in your browser.
*/

const COUNTDOWN = {
  // Set your actual launch date here
  target: new Date("2026-09-01T00:00:00"),
};

function getTimeLeft(target) {
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=85",
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=85",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=85",
];

const TEASER_FEATURES = [
  {
    icon: "🌾",
    label: "Farm-direct produce",
    desc: "Straight from Nigerian farms, no middlemen",
  },
  {
    icon: "🤖",
    label: "AI-powered shopping",
    desc: "Smart search, recommendations & recipe help",
  },
  {
    icon: "🚚",
    label: "Fast local delivery",
    desc: "Fresh food to your door across Lagos & Abuja",
  },
  {
    icon: "💳",
    label: "Secure payments",
    desc: "Powered by Paystack — Nigeria's most trusted",
  },
];

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(getTimeLeft(COUNTDOWN.target));
  const [heroIdx, setHeroIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(COUNTDOWN.target)), 1000);
    return () => clearInterval(t);
  }, []);

  // Hero image rotation
  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  // Secret logo click handler — 5 clicks within 3 seconds → /launch
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (newCount >= 5) {
      setLogoClicks(0);
      navigate("/launch");
      return;
    }

    clickTimerRef.current = setTimeout(() => setLogoClicks(0), 3000);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: POST to /api/subscribe when ready
    setSubmitted(true);
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      {/* Background slideshow */}
      {HERO_IMAGES.map((img, i) => (
        <motion.div
          key={img}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === heroIdx ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark + green gradient overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(10,46,10,0.92) 0%, rgba(27,67,50,0.85) 50%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Animated particles / orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.04, 0.1, 0.04],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.8,
          }}
          style={{
            position: "fixed",
            width: `${120 + i * 60}px`,
            height: `${120 + i * 60}px`,
            borderRadius: "50%",
            background:
              i % 2 === 0 ? "rgba(64,145,108,0.15)" : "rgba(245,159,11,0.1)",
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            zIndex: 1,
            filter: "blur(40px)",
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Nav */}
        <nav
          style={{
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/*
            SECRET BUTTON: click logo 5 times in 3 seconds to access /launch
            Appears as a normal logo to regular users
          */}
          <motion.div
            onClick={handleLogoClick}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: "pointer", userSelect: "none" }}
            title="" // No tooltip that hints at the secret
          >
            <img
              src={logo}
              alt="BemsFarms"
              style={{
                height: "44px",
                filter: "brightness(0) invert(1)",
                transition: "filter 0.2s",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <span
              style={{
                display: "none",
                fontFamily: "Syne, sans-serif",
                fontSize: "22px",
                fontWeight: 900,
                color: "white",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🌿 BemsFarms
            </span>
          </motion.div>

          {/* Tiny click counter — only visible when actively clicking (purely visual feedback for devs) */}
          {logoClicks > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(64,145,108,0.3)",
                border: "1px solid rgba(64,145,108,0.5)",
                borderRadius: "50px",
                padding: "4px 14px",
                fontSize: "12px",
                color: "#A5D6A7",
                fontWeight: 700,
                backdropFilter: "blur(8px)",
                zIndex: 100,
              }}
            >
              {5 - logoClicks} more {5 - logoClicks === 1 ? "click" : "clicks"}
              ...
            </motion.div>
          )}

          <div
            style={{
              backgroundColor: "rgba(245,159,11,0.15)",
              border: "1px solid rgba(245,159,11,0.4)",
              borderRadius: "50px",
              padding: "6px 18px",
              fontSize: "12px",
              color: "#FCD34D",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            🚀 LAUNCHING SOON
          </div>
        </nav>

        {/* Hero content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(64,145,108,0.2)",
              border: "1px solid rgba(64,145,108,0.5)",
              borderRadius: "50px",
              padding: "8px 20px",
              marginBottom: "28px",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#A5D6A7",
                letterSpacing: "1px",
              }}
            >
              🌱 Nigeria's freshest farm marketplace is on its way
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
              maxWidth: "800px",
            }}
          >
            Something Fresh
            <br />
            <span
              style={{
                color: "#F59E0B",
                textShadow: "0 0 60px rgba(245,159,11,0.4)",
              }}
            >
              is Growing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "clamp(15px, 2.5vw, 18px)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: "48px",
              maxWidth: "520px",
            }}
          >
            Farm-fresh Nigerian food, AI-powered recommendations, and fast local
            delivery — all in one place. Be the first to experience it.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              display: "flex",
              gap: "clamp(16px, 4vw, 40px)",
              marginBottom: "48px",
              alignItems: "center",
            }}
          >
            {[
              { value: time.days, label: "Days" },
              { value: time.hours, label: "Hours" },
              { value: time.minutes, label: "Minutes" },
              { value: time.seconds, label: "Seconds" },
            ].map((unit, i) => (
              <div key={unit.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "16px",
                    padding: "clamp(12px, 3vw, 20px) clamp(14px, 3.5vw, 28px)",
                    backdropFilter: "blur(12px)",
                    marginBottom: "8px",
                    minWidth: "clamp(60px, 12vw, 90px)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={pad(unit.value)}
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 12, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "clamp(28px, 6vw, 48px)",
                        fontWeight: 900,
                        color: "white",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {pad(unit.value)}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {unit.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Email capture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ width: "100%", maxWidth: "480px", marginBottom: "64px" }}
          >
            {!submitted ? (
              <>
                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "14px",
                    marginBottom: "14px",
                  }}
                >
                  Get early access + 10% off your first order
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  style={{
                    display: "flex",
                    gap: 0,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    style={{
                      flex: 1,
                      padding: "16px 20px",
                      border: "none",
                      outline: "none",
                      fontSize: "15px",
                      backgroundColor: "white",
                      color: "#111827",
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    style={{
                      padding: "16px 28px",
                      backgroundColor: "#F59E0B",
                      border: "none",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "Nunito, sans-serif",
                    }}
                  >
                    Notify Me →
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: "rgba(64,145,108,0.2)",
                  border: "1px solid rgba(64,145,108,0.5)",
                  borderRadius: "16px",
                  padding: "20px 28px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "20px", marginBottom: "6px" }}>🎉</p>
                <p
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  You're on the list!
                </p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                  We'll notify you the moment we launch. Your 10% discount code
                  is on its way.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Feature teasers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {TEASER_FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "20px",
                  backdropFilter: "blur(8px)",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {f.icon}
                </span>
                <p
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "4px",
                  }}
                >
                  {f.label}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.5,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
            © 2026 BemsFarms. Made with 🌿 in Nigeria
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Instagram", "Twitter", "Facebook"].map((s) => (
              <span
                key={s}
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
