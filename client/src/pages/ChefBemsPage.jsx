import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

/*
  ── CHEF BEMS AI KITCHEN CHATBOT ─────────────────────────────────
  Replaces the old AI Recommendations page.
  Acts as a personal chef/cook — answers questions about:
  - Nigerian recipes and cooking methods
  - Ingredient substitutions
  - Nutritional advice
  - What to cook with items in their cart
  - Dietary guidance (diabetes-friendly, heart health, etc.)
  - General food/kitchen questions
  
  Backend: POST /api/ai/chef-chat (see chef-chat route in ai.js)
  The chatbot uses the Gemini API with a chef persona system prompt.
  Your co-worker's AI automation will integrate with the same endpoint.
*/

const QUICK_PROMPTS = [
  { icon: "🍲", text: "What can I cook with garri and tomatoes?" },
  { icon: "🌾", text: "How do I make perfect Jollof rice?" },
  { icon: "🥗", text: "Give me a healthy Nigerian meal plan for the week" },
  { icon: "🩺", text: "What foods are good for managing diabetes?" },
  { icon: "🔄", text: "What can I substitute for palm oil in egusi soup?" },
  { icon: "👶", text: "What Nigerian foods are best for toddlers?" },
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content: `Welcome! I'm **Chef Bems** 👨‍🍳 — your personal Nigerian kitchen AI.

I can help you with:
• Recipes for any Nigerian dish
• What to cook with ingredients you have
• Healthy meal planning
• Nutritional guidance
• Cooking tips and substitutions

What would you like to cook today?`,
  timestamp: new Date(),
};

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
    .replace(/•/g, "•");
}

export default function ChefBemsPage() {
  const { isMobile } = useResponsive();
  const { cartItems, addToCart } = useCart();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const userMsg = {
      id: Date.now() + "-user",
      role: "user",
      content: userText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post("/ai/chef-chat", {
        message: userText,
        history,
        cartItems: cartItems
          .map((i) => i.product?.name || i.name)
          .filter(Boolean),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-chef",
          role: "assistant",
          content: res.data.reply || "I didn't catch that. Could you rephrase?",
          timestamp: new Date(),
          suggestions: res.data.suggestions || [],
        },
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Chef Bems is taking a short break. Try again in a moment.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-err",
          role: "assistant",
          content: `⚠️ ${msg}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const cartContext =
    cartItems.length > 0
      ? `(You have ${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart)`
      : "";

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: isMobile ? "0" : "24px 24px 0",
          height: isMobile ? "calc(100vh - 64px)" : "calc(100vh - 112px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
            borderRadius: isMobile ? "0" : "20px 20px 0 0",
            padding: isMobile ? "16px 20px" : "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(245,159,11,0.4)",
            }}
          >
            👨‍🍳
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: isMobile ? "18px" : "22px",
                fontWeight: 800,
                color: "white",
                margin: 0,
                marginBottom: "2px",
              }}
            >
              Chef Bems
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                Your AI Kitchen Assistant {cartContext}
              </p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#FAFAF8",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1B4332, #40916C)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    👨‍🍳
                  </div>
                )}

                <div style={{ maxWidth: "75%", minWidth: 0 }}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      backgroundColor:
                        msg.role === "user"
                          ? "#1B4332"
                          : msg.isError
                            ? "#FEF2F2"
                            : "white",
                      color:
                        msg.role === "user"
                          ? "white"
                          : msg.isError
                            ? "#DC2626"
                            : "#111827",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
                      border: msg.isError ? "1px solid #FECACA" : "none",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      margin: "4px 0 0",
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {msg.role === "user" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#F59E0B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0,
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    U
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1B4332, #40916C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                👨‍🍳
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "14px 18px",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#1B4332",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div
            style={{
              backgroundColor: "white",
              padding: "12px 20px",
              borderTop: "1px solid #F0F0EE",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                fontWeight: 600,
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Quick questions
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {QUICK_PROMPTS.map((p) => (
                <motion.button
                  key={p.text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(p.text)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    borderRadius: "50px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F8FAFB",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#4B5563",
                    fontFamily: "Nunito, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{p.icon}</span>
                  {p.text.slice(0, 30)}
                  {p.text.length > 30 ? "…" : ""}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px 20px",
            borderTop: "1px solid #F0F0EE",
            borderRadius: isMobile ? "0" : "0 0 20px 20px",
            flexShrink: 0,
            boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              backgroundColor: "#F8FAFB",
              borderRadius: "16px",
              border: "1.5px solid #E5E7EB",
              padding: "8px 8px 8px 16px",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Chef Bems anything about Nigerian cooking..."
              rows={1}
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontFamily: "Nunito, sans-serif",
                resize: "none",
                lineHeight: 1.5,
                maxHeight: "120px",
                overflow: "auto",
                color: "#111827",
              }}
            />
            <motion.button
              whileHover={{ scale: input.trim() && !loading ? 1.05 : 1 }}
              whileTap={{ scale: input.trim() && !loading ? 0.95 : 1 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor:
                  input.trim() && !loading ? "#1B4332" : "#E5E7EB",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳" : "↑"}
            </motion.button>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#D1D5DB",
              marginTop: "8px",
            }}
          >
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
