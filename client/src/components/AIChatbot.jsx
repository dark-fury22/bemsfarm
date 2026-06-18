import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const QUICK_QUESTIONS = [
  {
    text: "🛒 What products do you sell?",
    value: "What fresh Nigerian products do you have available?",
  },
  {
    text: "🚚 How fast is delivery?",
    value: "How fast is delivery and what areas do you cover?",
  },
  {
    text: "🍲 Recipe ideas with beans?",
    value: "Give me a Nigerian recipe idea using beans from BemsFarms",
  },
  {
    text: "💰 Any discounts available?",
    value: "Do you have any discount codes or promotions right now?",
  },
  { text: "↩️ Return policy?", value: "What is the return and refund policy?" },
  {
    text: "🌾 Best products for diabetes?",
    value: "What BemsFarms products are good for someone with diabetes?",
  },
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to BemsFarms! 🌿 I'm your AI shopping assistant. I can help you find fresh products, suggest recipes, give dietary advice, or answer any questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [open, messages]);

  const sendMessage = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Use backend proxy — no CORS issues
      const res = await api.post("/ai/chat", {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (!open) setUnread((prev) => prev + 1);
    } catch (err) {
      console.error("Chat error:", err);
      const fallback = getFallbackResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallback },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Smart fallback if AI is unavailable
  const getFallbackResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("deliver"))
      return "🚚 We deliver same-day in Lagos (2-4 hours) and 1-3 days nationwide. Free delivery on orders over ₦15,000!";
    if (lower.includes("return") || lower.includes("refund"))
      return "↩️ Returns are accepted within 7 days of delivery. Submit a return request from your Orders page. Refunds take 3-5 business days.";
    if (lower.includes("discount") || lower.includes("coupon"))
      return "💰 Use code FRESH20 for 20% off your order! New customers also get BEMS10 for 10% off.";
    if (lower.includes("product") || lower.includes("sell"))
      return "🌾 We sell fresh Nigerian produce: Ofada Rice, Long Grain Rice, Palm Oil, Groundnut Oil, Beans, Garri, Fresh Tomatoes, Dried Crayfish, Cocoyam, Ugu Leaves and more!";
    if (lower.includes("pay"))
      return "💳 We accept card payments, bank transfer, USSD, and cash on delivery — all secured by Paystack.";
    return "😊 I'm having trouble connecting right now. Please contact us at hello@bemsfarms.ng or call +234 800 BEMS FARM. No wahala!";
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              bottom: "90px",
              right: "20px",
              zIndex: 9999,
              width: "380px",
              maxWidth: "calc(100vw - 32px)",
              backgroundColor: "white",
              borderRadius: "24px",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.2), 0 8px 32px rgba(27,67,50,0.15)",
              border: "1px solid rgba(27,67,50,0.1)",
              display: "flex",
              flexDirection: "column",
              height: "540px",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1B4332 0%, #40916C 100%)",
                padding: "16px 20px",
                borderRadius: "24px 24px 0 0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                🌿
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{ color: "white", fontWeight: 700, fontSize: "15px" }}
                >
                  BemsFarms AI
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "1px",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#4ADE80",
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "12px",
                    }}
                  >
                    {loading ? "Thinking..." : "Online — ready to help"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                scrollbarWidth: "thin",
                scrollbarColor: "#E5E7EB transparent",
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(135deg, #1B4332, #40916C)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                      }}
                    >
                      🌿
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "10px 14px",
                      borderRadius:
                        msg.role === "user"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                      backgroundColor:
                        msg.role === "user" ? "#1B4332" : "#F8FAFB",
                      color: msg.role === "user" ? "white" : "#1F2937",
                      fontSize: "13px",
                      lineHeight: 1.55,
                      fontFamily: "Nunito, sans-serif",
                      border:
                        msg.role === "assistant" ? "1px solid #F3F4F6" : "none",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: "#F59E0B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      👤
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1B4332, #40916C)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                    }}
                  >
                    🌿
                  </div>
                  <div
                    style={{
                      backgroundColor: "#F8FAFB",
                      border: "1px solid #F3F4F6",
                      padding: "12px 16px",
                      borderRadius: "20px 20px 20px 4px",
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -5, 0],
                          backgroundColor: ["#9CA3AF", "#40916C", "#9CA3AF"],
                        }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          backgroundColor: "#9CA3AF",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions — show only for first message */}
            {messages.length === 1 && (
              <div style={{ padding: "0 14px 10px", flexShrink: 0 }}>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9CA3AF",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: 600,
                  }}
                >
                  Quick questions
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                    <button
                      key={q.text}
                      onClick={() => sendMessage(q.value)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#F0FFF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "50px",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#065F46",
                        fontWeight: 500,
                        fontFamily: "Nunito, sans-serif",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#D1FAE5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#F0FFF4")
                      }
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                gap: "8px",
                alignItems: "flex-end",
                flexShrink: 0,
                borderRadius: "0 0 24px 24px",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 80) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything... (Enter to send)"
                rows={1}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  fontSize: "13px",
                  outline: "none",
                  resize: "none",
                  fontFamily: "Nunito, sans-serif",
                  lineHeight: 1.5,
                  minHeight: "40px",
                  maxHeight: "80px",
                  color: "#111827",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#40916C")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  border: "none",
                  flexShrink: 0,
                  background:
                    !input.trim() || loading
                      ? "#E5E7EB"
                      : "linear-gradient(135deg, #1B4332, #40916C)",
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  transition: "all 0.2s",
                  boxShadow:
                    !input.trim() || loading
                      ? "none"
                      : "0 4px 14px rgba(27,67,50,0.35)",
                }}
              >
                {loading ? "⏳" : "➤"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        animate={!open && unread > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={
          !open && unread > 0 ? { duration: 2, repeat: Infinity } : {}
        }
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 10000,
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          border: "none",
          background: open
            ? "linear-gradient(135deg, #EF4444, #DC2626)"
            : "linear-gradient(135deg, #1B4332, #40916C)",
          cursor: "pointer",
          boxShadow: open
            ? "0 8px 24px rgba(239,68,68,0.4)"
            : "0 8px 28px rgba(27,67,50,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: open ? "22px" : "28px",
          transition: "background 0.3s",
        }}
      >
        {open ? "✕" : "🌿"}
        {!open && unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              minWidth: "20px",
              height: "20px",
              borderRadius: "10px",
              backgroundColor: "#F59E0B",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 800,
              color: "white",
              padding: "0 4px",
            }}
          >
            {unread}
          </motion.div>
        )}
      </motion.button>
    </>
  );
}
