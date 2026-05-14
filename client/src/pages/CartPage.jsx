import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import ProductCard, {
  getProductEmoji,
  getProductBg,
} from "../components/ui/ProductCard";
import { useResponsive } from "../hooks/useResponsive";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const delivery = cartSubtotal > 15000 ? 0 : 1500;
  const total = cartSubtotal + delivery;
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponValid, setCouponValid] = useState(null);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const validCoupons = {
    BEMS10: { type: "percent", value: 10, label: "10% off" },
    FRESH20: { type: "percent", value: 20, label: "20% off" },
    SAVE500: { type: "fixed", value: 500, label: "₦500 off" },
    NEWUSER: { type: "percent", value: 15, label: "15% off" },
  };

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (validCoupons[code]) {
      const c = validCoupons[code];
      const disc =
        c.type === "percent"
          ? Math.round((cartSubtotal * c.value) / 100)
          : c.value;
      setDiscount(disc);
      setCouponMsg(
        `✅ Coupon applied! You saved ₦${disc.toLocaleString()} (${c.label})`,
      );
      setCouponValid(true);
    } else {
      setDiscount(0);
      setCouponMsg("❌ Invalid coupon code. Try BEMS10 or FRESH20");
      setCouponValid(false);
    }
  };

  if (cartItems.length === 0)
    return (
      <PageWrapper>
        <div
          style={{
            maxWidth: "600px",
            margin: "80px auto",
            textAlign: "center",
            padding: "40px 24px",
          }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ fontSize: "100px", marginBottom: "24px" }}
          >
            🛒
          </motion.div>
          <h2
            style={{ fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}
          >
            Your cart is empty
          </h2>
          <p style={{ color: "#9AA0A6", marginBottom: "24px" }}>
            Looks like you haven't added any Nigerian foods yet!
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/products")}
            style={{
              backgroundColor: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "16px 36px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(46,125,50,0.3)",
            }}
          >
            Browse Products 🌾
          </motion.button>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            fontSize: "13px",
            color: "#9AA0A6",
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AA0A6",
            }}
          >
            Home
          </button>
          <span>/</span>
          <span style={{ color: "#202124", fontWeight: 600 }}>Cart</span>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>
          My Cart
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
            gap: "32px",
            alignItems: "flex-start",
          }}
        >
          {/* Cart Items */}
          <div>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "16px",
                padding: "12px 16px",
                backgroundColor: "#F8F9FA",
                borderRadius: "12px",
                marginBottom: "12px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#9AA0A6",
              }}
            >
              <span>Product</span>
              <span style={{ textAlign: "center" }}>Price</span>
              <span style={{ textAlign: "center" }}>Quantity</span>
              <span style={{ textAlign: "right" }}>Subtotal</span>
            </div>

            <AnimatePresence>
              {cartItems.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  style={{
                    display: isMobile ? "flex" : "grid",
                    flexDirection: isMobile ? "column" : "row",
                    gridTemplateColumns: isMobile
                      ? undefined
                      : "2fr 1fr 1fr 1fr",
                    gap: "16px",
                    padding: "20px 16px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    marginBottom: "12px",
                    border: "1px solid #E8EAED",
                    alignItems: "center",
                  }}
                >
                  {/* Product */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          left: "-8px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#F44336",
                          border: "none",
                          cursor: "pointer",
                          color: "white",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        ✕
                      </motion.button>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "12px",
                          backgroundColor: getProductBg(product.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "32px",
                        }}
                      >
                        {getProductEmoji(product.name)}
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: "15px",
                          color: "#202124",
                        }}
                      >
                        {product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9AA0A6" }}>
                        {product.unit}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <p
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#5F6368",
                    }}
                  >
                    ₦{(product.price * 1500).toLocaleString()}
                  </p>

                  {/* Qty Controls */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "center",
                      backgroundColor: "#F8F9FA",
                      borderRadius: "10px",
                      padding: "6px 12px",
                      border: "1px solid #E8EAED",
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        border: "1px solid #E8EAED",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#5F6368",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </motion.button>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#F57C00",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </motion.button>
                  </div>

                  {/* Subtotal */}
                  <p
                    style={{
                      textAlign: "right",
                      fontWeight: 800,
                      fontSize: "16px",
                      color: "#2E7D32",
                    }}
                  >
                    ₦{(product.price * 1500 * quantity).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/products")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  border: "1px solid #E8EAED",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                ← Return to Shop
              </motion.button>
              {/* Replace the coupon input section with: */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponMsg("");
                      setCouponValid(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Coupon code (try BEMS10)"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: `1px solid ${couponValid === true ? "#2E7D32" : couponValid === false ? "#C62828" : "#E8EAED"}`,
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={applyCoupon}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      backgroundColor: "#F57C00",
                      border: "none",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 12px rgba(245,124,0,0.3)",
                    }}
                  >
                    Apply
                  </motion.button>
                </div>
                {couponMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontSize: "13px",
                      color: couponValid ? "#2E7D32" : "#C62828",
                      fontWeight: 500,
                    }}
                  >
                    {couponMsg}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #E8EAED",
              position: "sticky",
              top: "90px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              Cart Total
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #F1F3F4",
              }}
            >
              <span style={{ color: "#5F6368", fontSize: "15px" }}>
                Subtotal:
              </span>
              <span
                style={{ fontWeight: 800, fontSize: "20px", color: "#2E7D32" }}
              >
                ₦{(cartSubtotal + delivery - discount).toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid #F1F3F4",
              }}
            >
              <span style={{ color: "#5F6368", fontSize: "15px" }}>
                Shipping:
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: delivery === 0 ? "#2E7D32" : "#202124",
                }}
              >
                {delivery === 0 ? "Free 🎉" : `₦${delivery.toLocaleString()}`}
              </span>
            </div>
            {delivery === 0 && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#2E7D32",
                  backgroundColor: "#E8F5E9",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                🎉 You qualified for free shipping!
              </p>
            )}
            {delivery > 0 && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#9AA0A6",
                  marginBottom: "16px",
                }}
              >
                Add ₦{(15000 - cartSubtotal).toLocaleString()} more for free
                shipping
              </p>
            )}
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#2E7D32", fontSize: "14px" }}>
                  Discount
                </span>
                <span style={{ fontWeight: 600, color: "#2E7D32" }}>
                  -₦{discount.toLocaleString()}
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Total:</span>
              <span
                style={{ fontWeight: 800, fontSize: "20px", color: "#2E7D32" }}
              >
                ₦{total.toLocaleString()}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                backgroundColor: "#F57C00",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(245,124,0,0.35)",
              }}
            >
              Proceed to Checkout →
            </motion.button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
