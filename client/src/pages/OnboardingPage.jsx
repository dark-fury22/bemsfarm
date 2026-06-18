import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/bemsfarms_logo.png";

const TOTAL_STEPS = 4;

const FAMILY_SIZES = [
  { value: "solo", label: "Just me", emoji: "🧍", desc: "1 person" },
  { value: "couple", label: "Couple", emoji: "👫", desc: "2 people" },
  { value: "small", label: "Small family", emoji: "👨‍👩‍👦", desc: "3–4 people" },
  { value: "large", label: "Large family", emoji: "👨‍👩‍👧‍👦", desc: "5+ people" },
];

const BUDGETS = [
  { value: 5000, label: "₦5,000", emoji: "💚", desc: "Budget-friendly" },
  { value: 10000, label: "₦10,000", emoji: "💛", desc: "Moderate" },
  { value: 25000, label: "₦25,000", emoji: "🧡", desc: "Comfortable" },
  { value: 50000, label: "₦50,000+", emoji: "💜", desc: "Premium" },
];

const HEALTH_GOALS = [
  { value: "general", label: "General health", emoji: "💪" },
  { value: "weight_loss", label: "Weight management", emoji: "⚖️" },
  { value: "diabetes", label: "Diabetes-friendly", emoji: "🩺" },
  { value: "heart_health", label: "Heart health", emoji: "❤️" },
  { value: "pregnancy", label: "Pregnancy / nursing", emoji: "🤰" },
  { value: "muscle_gain", label: "Muscle & fitness", emoji: "🏋️" },
  { value: "children", label: "Kids & family", emoji: "🧒" },
  { value: "hypertension", label: "Low sodium", emoji: "🧂" },
];

const STEPS = [
  {
    id: "welcome",
    illustration: "🌿",
    headline: "Fresh from Nigerian farms\nto your door",
    sub: "BemsFarms uses AI to personalise your shopping — better prices, smarter picks, recipes you'll actually cook.",
  },
  {
    id: "family",
    illustration: "🏠",
    headline: "Who are you shopping for?",
    sub: "We'll suggest the right quantities and bundle deals for your household.",
  },
  {
    id: "budget",
    illustration: "💰",
    headline: "What's your weekly food budget?",
    sub: "We'll highlight the best value options and alert you to deals in your range.",
  },
  {
    id: "health",
    illustration: "🥗",
    headline: "Any health goals? (optional)",
    sub: "Pick as many as you like. Our AI will prioritise products that support your goals.",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [familySize, setFamilySize] = useState(null);
  const [budget, setBudget] = useState(null);
  const [healthGoals, setHealthGoals] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleGoal = (val) => {
    setHealthGoals((prev) =>
      prev.includes(val) ? prev.filter((g) => g !== val) : [...prev, val],
    );
  };

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
    // Save preferences to localStorage for AI to read
    try {
      const prefs = {
        familySize,
        budget,
        healthGoals,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem("bemsfarms_prefs", JSON.stringify(prefs));
      // Optionally POST to backend:
      // await api.post('/auth/preferences', prefs)
    } catch (e) {
      /* silently skip */
    }
    setTimeout(() => navigate("/home"), 600);
  };

  const canContinue = () => {
    if (step === 0) return true;
    if (step === 1) return familySize !== null;
    if (step === 2) return budget !== null;
    if (step === 3) return true; // health goals are optional
    return false;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const currentStep = STEPS[step];
  const progress = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #F0FFF4 0%, #ECFDF5 40%, #D1FAE5 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <img
          src={logo}
          alt="BemsFarms"
          style={{ height: "36px", objectFit: "contain" }}
        />

        <button
          onClick={skip}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Nunito, sans-serif",
            padding: "6px 12px",
          }}
        >
          Skip →
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          height: "3px",
          backgroundColor: "rgba(27,67,50,0.1)",
          margin: "0 24px",
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #1B4332, #40916C)",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* STEP DOTS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: i <= step ? "#1B4332" : "rgba(27,67,50,0.2)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 24px 40px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "480px" }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Illustration */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                  fontSize: "72px",
                }}
              >
                {currentStep.illustration}
              </motion.div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#1B4332",
                  textAlign: "center",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}
              >
                {currentStep.headline}
              </h1>

              <p
                style={{
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginBottom: "32px",
                }}
              >
                {currentStep.sub}
              </p>

              {/* STEP 1: WELCOME — feature pills */}
              {step === 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {[
                    { emoji: "🔍", text: "AI-powered search" },
                    { emoji: "🌾", text: "Direct from farms" },
                    { emoji: "💰", text: "Smart pricing" },
                    { emoji: "🍲", text: "Recipe suggestions" },
                  ].map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "14px",
                        padding: "14px",
                        border: "1px solid #D1FAE5",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>{feat.emoji}</span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1B4332",
                          fontFamily: "Nunito, sans-serif",
                        }}
                      >
                        {feat.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* STEP 2: FAMILY SIZE */}
              {step === 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {FAMILY_SIZES.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setFamilySize(opt.value)}
                      style={{
                        padding: "16px 12px",
                        borderRadius: "14px",
                        border:
                          familySize === opt.value
                            ? "2px solid #1B4332"
                            : "2px solid #E5E7EB",
                        backgroundColor:
                          familySize === opt.value ? "#F0FFF4" : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "6px" }}>
                        {opt.emoji}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1B4332",
                          fontFamily: "Nunito, sans-serif",
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#9CA3AF",
                          marginTop: "2px",
                        }}
                      >
                        {opt.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* STEP 3: BUDGET */}
              {step === 2 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {BUDGETS.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setBudget(opt.value)}
                      style={{
                        padding: "16px 12px",
                        borderRadius: "14px",
                        border:
                          budget === opt.value
                            ? "2px solid #1B4332"
                            : "2px solid #E5E7EB",
                        backgroundColor:
                          budget === opt.value ? "#F0FFF4" : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: "28px", marginBottom: "6px" }}>
                        {opt.emoji}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#1B4332",
                          fontFamily: "Syne, sans-serif",
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#9CA3AF",
                          marginTop: "2px",
                        }}
                      >
                        {opt.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* STEP 4: HEALTH GOALS */}
              {step === 3 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
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
                          padding: "12px",
                          borderRadius: "12px",
                          border: selected
                            ? "2px solid #1B4332"
                            : "2px solid #E5E7EB",
                          backgroundColor: selected ? "#F0FFF4" : "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>{goal.emoji}</span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: selected ? "#1B4332" : "#4B5563",
                            fontFamily: "Nunito, sans-serif",
                            textAlign: "left",
                          }}
                        >
                          {goal.label}
                        </span>
                        {selected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              marginLeft: "auto",
                              color: "#1B4332",
                              fontWeight: 800,
                            }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
              alignItems: "center",
            }}
          >
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={goBack}
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
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
                borderRadius: "12px",
                border: "none",
                background: canContinue()
                  ? "linear-gradient(135deg, #1B4332, #40916C)"
                  : "#E5E7EB",
                color: canContinue() ? "white" : "#9CA3AF",
                fontWeight: 800,
                cursor: canContinue() ? "pointer" : "default",
                fontSize: "15px",
                fontFamily: "Nunito, sans-serif",
                boxShadow: canContinue()
                  ? "0 6px 20px rgba(27,67,50,0.3)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              {saving
                ? "✨ Setting up..."
                : step === 0
                  ? "Let's Go →"
                  : step === TOTAL_STEPS - 1
                    ? "🚀 Start Shopping"
                    : "Continue →"}
            </motion.button>
          </div>

          {/* Skip hint on last step */}
          {step === 3 && (
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#9CA3AF",
                marginTop: "12px",
              }}
            >
              Health goals are optional — you can update them anytime in your
              profile
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
