import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/bemsfarms_logo.png";

const TOTAL_STEPS = 4;

// Step panel images — real farm/food photography for each step
const STEP_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=90", // market stall
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=90", // farm harvest
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=90", // fresh veg
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=90", // produce
];

const FAMILY_SIZES = [
  {
    value: "solo",
    label: "Just me",
    desc: "1 person",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
  },
  {
    value: "couple",
    label: "Couple",
    desc: "2 people",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80",
  },
  {
    value: "small",
    label: "Small family",
    desc: "3–4 people",
    img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&q=80",
  },
  {
    value: "large",
    label: "Large family",
    desc: "5+ people",
    img: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&q=80",
  },
];

const BUDGETS = [
  {
    value: 5000,
    label: "₦5,000",
    desc: "Budget-friendly",
    gradient: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
    textColor: "#1B4332",
  },
  {
    value: 10000,
    label: "₦10,000",
    desc: "Moderate",
    gradient: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
    textColor: "#7B5800",
  },
  {
    value: 25000,
    label: "₦25,000",
    desc: "Comfortable",
    gradient: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
    textColor: "#8B3A00",
  },
  {
    value: 50000,
    label: "₦50,000+",
    desc: "Premium",
    gradient: "linear-gradient(135deg, #1B4332, #40916C)",
    textColor: "#FFFFFF",
  },
];

const HEALTH_GOALS = [
  {
    value: "general",
    label: "General health",
    img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=80&q=80",
  },
  {
    value: "weight_loss",
    label: "Weight management",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&q=80",
  },
  {
    value: "diabetes",
    label: "Diabetes-friendly",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&q=80",
  },
  {
    value: "heart_health",
    label: "Heart health",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=80&q=80",
  },
  {
    value: "pregnancy",
    label: "Pregnancy / nursing",
    img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=80&q=80",
  },
  {
    value: "muscle_gain",
    label: "Muscle & fitness",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=80",
  },
  {
    value: "children",
    label: "Kids & family",
    img: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=80&q=80",
  },
  {
    value: "hypertension",
    label: "Low sodium",
    img: "https://images.unsplash.com/photo-1567741358010-587b3ff2e3f5?w=80&q=80",
  },
];

const FEATURE_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80",
    title: "AI-powered search",
    desc: "Finds exactly what you need",
  },
  {
    img: "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141430/ofada_rice_mhhzt2.jpg",
    title: "Direct from farms",
    desc: "No middlemen, better prices",
  },
  {
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80",
    title: "Smart pricing",
    desc: "Fair, transparent costs",
  },
  {
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
    title: "Recipe suggestions",
    desc: "Cook better, eat fresher",
  },
];

const STEPS_META = [
  {
    headline: "Fresh from Nigerian farms\nto your door",
    sub: "BemsFarms uses AI to personalise your shopping — better prices, smarter picks, recipes you'll actually cook.",
  },
  {
    headline: "Who are you\nshopping for?",
    sub: "We'll suggest the right quantities and bundle deals for your household.",
  },
  {
    headline: "What's your weekly\nfood budget?",
    sub: "We'll highlight the best value options and alert you to deals in your range.",
  },
  {
    headline: "Any health goals?\n(optional)",
    sub: "Pick as many as you like. Our AI will prioritise products that support your goals.",
  },
];

const OB_CSS = `
.ob-layout { display: flex; min-height: 100vh; }
.ob-panel { display: none; }
.ob-content { flex: 1; padding: 24px 20px 60px; overflow-y: auto; }
.ob-topbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #F0F0EE; }

@media (min-width: 768px) {
  .ob-panel { display: flex; }
  .ob-content { padding: 48px 56px 60px; }
  .ob-topbar { display: none; }
}
`;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [familySize, setFamilySize] = useState(null);
  const [budget, setBudget] = useState(null);
  const [healthGoals, setHealthGoals] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleGoal = (val) =>
    setHealthGoals((prev) =>
      prev.includes(val) ? prev.filter((g) => g !== val) : [...prev, val],
    );

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };
  const skip = () => navigate("/home");

  const finish = async () => {
    setSaving(true);
    try {
      localStorage.setItem(
        "bemsfarms_prefs",
        JSON.stringify({
          familySize,
          budget,
          healthGoals,
          completedAt: new Date().toISOString(),
        }),
      );
    } catch (e) {}
    setTimeout(() => navigate("/home"), 600);
  };

  const canContinue = () => {
    if (step === 0) return true;
    if (step === 1) return familySize !== null;
    if (step === 2) return budget !== null;
    if (step === 3) return true;
    return false;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };

  const meta = STEPS_META[step];

  return (
    <div
      className="ob-layout"
      style={{ backgroundColor: "#FAFAF8", fontFamily: "Nunito, sans-serif" }}
    >
      <style>{OB_CSS}</style>

      {/* ── LEFT PANEL (desktop only) ─────────────────────── */}
      <div
        className="ob-panel"
        style={{
          width: "38%",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Background image with cross-fade */}
        {STEP_IMAGES.map((img, i) => (
          <motion.div
            key={img}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === step ? 1 : 0 }}
            transition={{ duration: 0.9 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(13,43,26,0.88) 0%, rgba(27,67,50,0.72) 100%)",
          }}
        />

        {/* Panel content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "32px",
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "auto" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "8px 14px",
                display: "inline-block",
                marginBottom: "32px",
              }}
            >
              <img
                src={logo}
                alt="BemsFarms"
                style={{ height: "30px", display: "block" }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "2.5px",
                    fontWeight: 700,
                    color: "rgba(165,214,167,0.9)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Step {step + 1} of {TOTAL_STEPS}
                </p>
                <h2
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 1.25,
                    whiteSpace: "pre-line",
                    marginBottom: "14px",
                  }}
                >
                  {meta.headline}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.7,
                  }}
                >
                  {meta.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step dots */}
          <div style={{ display: "flex", gap: "8px", marginTop: "40px" }}>
            {STEPS_META.map((_, i) => (
              <div
                key={i}
                style={{
                  height: "4px",
                  width: i === step ? "28px" : "10px",
                  borderRadius: "2px",
                  backgroundColor:
                    i <= step ? "#F59E0B" : "rgba(255,255,255,0.25)",
                  transition: "all 0.35s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Mobile top bar */}
        <div className="ob-topbar">
          <div
            style={{
              backgroundColor: "#1B4332",
              borderRadius: "8px",
              padding: "6px 10px",
            }}
          >
            <img
              src={logo}
              alt="BemsFarms"
              style={{
                height: "26px",
                display: "block",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>
          <button
            onClick={skip}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6B7280",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Skip →
          </button>
        </div>

        {/* Mobile progress bar */}
        <div style={{ height: "3px", backgroundColor: "#E5E7EB" }}>
          <motion.div
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #1B4332, #40916C)",
            }}
          />
        </div>

        <div className="ob-content" style={{ flex: 1 }}>
          {/* Desktop skip */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "32px",
            }}
            className="ob-topbar"
            style={{ display: "none" }}
          >
            <button
              onClick={skip}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Skip setup →
            </button>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              {/* STEP 0: WELCOME */}
              {step === 0 && (
                <div>
                  <h1
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "clamp(26px, 4vw, 36px)",
                      fontWeight: 900,
                      color: "#0D1117",
                      lineHeight: 1.2,
                      marginBottom: "8px",
                    }}
                  >
                    Welcome to BemsFarms
                  </h1>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      marginBottom: "32px",
                      maxWidth: "480px",
                    }}
                  >
                    Let's personalise your experience in 3 quick questions.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
                    {FEATURE_CARDS.map((card, i) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={{
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div
                          style={{
                            height: "100px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={card.img}
                            alt={card.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            padding: "12px 14px",
                            backgroundColor: "white",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "Syne, sans-serif",
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#0D1117",
                              marginBottom: "2px",
                            }}
                          >
                            {card.title}
                          </p>
                          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                            {card.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: FAMILY SIZE */}
              {step === 1 && (
                <div>
                  <h1
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "clamp(24px, 4vw, 34px)",
                      fontWeight: 900,
                      color: "#0D1117",
                      marginBottom: "8px",
                    }}
                  >
                    Who are you shopping for?
                  </h1>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "28px",
                    }}
                  >
                    We'll suggest the right quantities for your household.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    {FAMILY_SIZES.map((opt) => {
                      const selected = familySize === opt.value;
                      return (
                        <motion.button
                          key={opt.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFamilySize(opt.value)}
                          style={{
                            padding: 0,
                            borderRadius: "16px",
                            border: `2.5px solid ${selected ? "#1B4332" : "#E5E7EB"}`,
                            cursor: "pointer",
                            overflow: "hidden",
                            boxShadow: selected
                              ? "0 0 0 3px rgba(27,67,50,0.15)"
                              : "0 2px 8px rgba(0,0,0,0.06)",
                            transition: "all 0.2s",
                            position: "relative",
                            textAlign: "left",
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
                              src={opt.img}
                              alt={opt.label}
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
                                inset: 0,
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
                              }}
                            />
                            {selected && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  right: "10px",
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  backgroundColor: "#1B4332",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                  }}
                                >
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              padding: "12px 14px",
                              backgroundColor: selected ? "#F0FFF4" : "white",
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "Syne, sans-serif",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#0D1117",
                                marginBottom: "2px",
                              }}
                            >
                              {opt.label}
                            </p>
                            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                              {opt.desc}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: BUDGET */}
              {step === 2 && (
                <div>
                  <h1
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "clamp(24px, 4vw, 34px)",
                      fontWeight: 900,
                      color: "#0D1117",
                      marginBottom: "8px",
                    }}
                  >
                    Weekly food budget?
                  </h1>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "28px",
                    }}
                  >
                    We'll highlight the best value options in your range.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    {BUDGETS.map((opt) => {
                      const selected = budget === opt.value;
                      return (
                        <motion.button
                          key={opt.value}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setBudget(opt.value)}
                          style={{
                            padding: "24px 18px",
                            borderRadius: "16px",
                            border: `2.5px solid ${selected ? "#1B4332" : "transparent"}`,
                            cursor: "pointer",
                            background: opt.gradient,
                            boxShadow: selected
                              ? "0 0 0 3px rgba(27,67,50,0.15), 0 8px 24px rgba(0,0,0,0.12)"
                              : "0 2px 8px rgba(0,0,0,0.06)",
                            transition: "all 0.2s",
                            textAlign: "left",
                            position: "relative",
                          }}
                        >
                          {selected && (
                            <div
                              style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                backgroundColor:
                                  opt.textColor === "#FFFFFF"
                                    ? "rgba(255,255,255,0.3)"
                                    : "rgba(27,67,50,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: opt.textColor,
                                  fontSize: "12px",
                                  fontWeight: 800,
                                }}
                              >
                                ✓
                              </span>
                            </div>
                          )}
                          <p
                            style={{
                              fontFamily: "Syne, sans-serif",
                              fontSize: "20px",
                              fontWeight: 900,
                              color: opt.textColor,
                              marginBottom: "4px",
                            }}
                          >
                            {opt.label}
                          </p>
                          <p
                            style={{
                              fontSize: "13px",
                              color: opt.textColor,
                              opacity: 0.75,
                            }}
                          >
                            {opt.desc}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: HEALTH GOALS */}
              {step === 3 && (
                <div>
                  <h1
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "clamp(24px, 4vw, 34px)",
                      fontWeight: 900,
                      color: "#0D1117",
                      marginBottom: "8px",
                    }}
                  >
                    Any health goals?
                  </h1>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "28px",
                    }}
                  >
                    Pick as many as you like — optional.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {HEALTH_GOALS.map((goal) => {
                      const selected = healthGoals.includes(goal.value);
                      return (
                        <motion.button
                          key={goal.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleGoal(goal.value)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 14px",
                            borderRadius: "14px",
                            border: `2px solid ${selected ? "#1B4332" : "#E5E7EB"}`,
                            backgroundColor: selected ? "#F0FFF4" : "white",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s",
                            boxShadow: selected
                              ? "0 0 0 2px rgba(27,67,50,0.1)"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              flexShrink: 0,
                              border: `1px solid ${selected ? "#1B4332" : "#E5E7EB"}`,
                            }}
                          >
                            <img
                              src={goal.img}
                              alt={goal.label}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: selected ? "#1B4332" : "#4B5563",
                              flex: 1,
                              fontFamily: "Nunito, sans-serif",
                              lineHeight: 1.3,
                            }}
                          >
                            {goal.label}
                          </span>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{
                                color: "#1B4332",
                                fontWeight: 800,
                                fontSize: "14px",
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#9CA3AF",
                      marginTop: "16px",
                    }}
                  >
                    You can update these anytime in your profile
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          <div style={{ display: "flex", gap: "12px", marginTop: "36px" }}>
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={goBack}
                style={{
                  padding: "15px 22px",
                  borderRadius: "14px",
                  border: "1.5px solid #E5E7EB",
                  background: "white",
                  color: "#6B7280",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                ← Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: canContinue() ? 1.02 : 1 }}
              whileTap={{ scale: canContinue() ? 0.97 : 1 }}
              onClick={step === TOTAL_STEPS - 1 ? finish : goNext}
              disabled={!canContinue() || saving}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: canContinue()
                  ? "linear-gradient(135deg, #1B4332, #40916C)"
                  : "#F3F4F6",
                color: canContinue() ? "white" : "#9CA3AF",
                fontWeight: 800,
                cursor: canContinue() ? "pointer" : "default",
                fontSize: "15px",
                fontFamily: "Nunito, sans-serif",
                boxShadow: canContinue()
                  ? "0 8px 24px rgba(27,67,50,0.28)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              {saving
                ? "✨ Setting up..."
                : step === 0
                  ? "Let's Go →"
                  : step === TOTAL_STEPS - 1
                    ? "Start Shopping 🚀"
                    : "Continue →"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
