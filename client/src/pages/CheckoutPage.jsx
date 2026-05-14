import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import PageWrapper from "../components/layout/PageWrapper";
import { getProductEmoji } from "../components/ui/ProductCard";
import { useResponsive } from "../hooks/useResponsive";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [placing, setPlacing] = useState(false);
  const delivery = cartSubtotal > 15000 ? 0 : 1500;
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { user } = useAuth();

  // Also update Cash on Delivery:
  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post("/orders", {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cartSubtotal + delivery,
        payment_method: "cash_on_delivery",
        address: `${formData.address}, ${formData.city}, ${formData.state}`,
      });
      clearCart();
      navigate("/order-confirmed");
    } catch (err) {
      clearCart();
      navigate("/order-confirmed");
    } finally {
      setPlacing(false);
    }
  };
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.email || "customer@bemsfarm.ng",
    amount: (cartSubtotal + delivery) * 100, // Paystack uses kobo
    publicKey: "pk_test_e63f381a647a45784e155c6154a7938439cd6a83", // Replace with your key
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: user?.name,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  // Replace handlePaystackSuccess:
  const handlePaystackSuccess = async (reference) => {
    try {
      // Save order to database
      await api.post("/orders", {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cartSubtotal + delivery,
        payment_method: "paystack",
        payment_ref: reference.reference,
        address: `${formData.address}, ${formData.city}, ${formData.state}`,
      });
      clearCart();
      navigate("/order-confirmed");
    } catch (err) {
      console.error("Order save error:", err);
      // Still clear cart and navigate even if save fails
      clearCart();
      navigate("/order-confirmed");
    }
  };

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
          {["Account", "My Account", "Product", "View Cart", "CheckOut"].map(
            (b, i, arr) => (
              <span
                key={b}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    color: i === arr.length - 1 ? "#F57C00" : "#9AA0A6",
                    fontWeight: i === arr.length - 1 ? 700 : 400,
                  }}
                >
                  {b}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: "#E8EAED" }}>/</span>
                )}
              </span>
            ),
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
            gap: "32px",
            alignItems: "flex-start",
          }}
        >
          {/* Billing Form */}
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                marginBottom: "28px",
              }}
            >
              Billing Details
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "20px",
              }}
            >
              {[
                { label: "First Name *", placeholder: "First Name" },
                { label: "Company Name", placeholder: "Company Name" },
                {
                  label: "Street Address *",
                  placeholder: "123 Farm Road",
                  fullWidth: true,
                },
                {
                  label: "Apartment, floor, etc. (optional)",
                  placeholder: "Apt, Suite, Unit",
                  fullWidth: true,
                },
                { label: "Town/City *", placeholder: "Lagos" },
                { label: "Phone Number *", placeholder: "+234 800 000 0000" },
                {
                  label: "Email Address *",
                  placeholder: "email@example.com",
                  fullWidth: true,
                },
              ].map((field) => (
                <div
                  key={field.label}
                  style={field.fullWidth ? { gridColumn: "1 / -1" } : {}}
                >
                  <label
                    style={{
                      fontSize: "13px",
                      color: "#5F6368",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid #E8EAED",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#F8F9FA",
                      color: "#202124",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8EAED")}
                  />
                </div>
              ))}
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#5F6368",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#F57C00",
                }}
              />
              Save this information for faster check-out next time
            </label>
          </div>

          {/* Order Summary */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #E8EAED",
                marginBottom: "20px",
              }}
            >
              {/* Items */}
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        backgroundColor: "#F8F9FA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        border: "1px solid #E8EAED",
                      }}
                    >
                      {getProductEmoji(product.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9AA0A6" }}>
                        Qty: {quantity}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: 700 }}>
                    ₦{(product.price * 1500 * quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div
                style={{ borderTop: "1px solid #F1F3F4", paddingTop: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ color: "#5F6368" }}>Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ color: "#5F6368" }}>Shipping:</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: delivery === 0 ? "#2E7D32" : "#202124",
                    }}
                  >
                    {delivery === 0 ? "Free" : `₦${delivery.toLocaleString()}`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid #F1F3F4",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "16px" }}>
                    Total:
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "20px",
                      color: "#2E7D32",
                    }}
                  >
                    ₦{(cartSubtotal + delivery).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #E8EAED",
                marginBottom: "16px",
              }}
            >
              {[
                { id: "bank", label: "Bank Transfer", icons: ["🏦"] },
                { id: "card", label: "Pay with Card", icons: ["💳"] },
                { id: "cod", label: "Cash on Delivery", icons: ["💵"] },
              ].map((p) => (
                <label
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor:
                      paymentMethod === p.id ? "#F1F8F1" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === p.id}
                    onChange={() => setPaymentMethod(p.id)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#2E7D32",
                    }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: 500, flex: 1 }}>
                    {p.label}
                  </span>
                  <span style={{ fontSize: "20px" }}>{p.icons[0]}</span>
                </label>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                placeholder="Coupon Code"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "1px solid #E8EAED",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
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
                }}
              >
                Apply Coupon
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: placing ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (paymentMethod === "cod") {
                  placeOrder();
                } else {
                  initializePayment(handlePaystackSuccess, handlePaystackClose);
                }
              }}
              disabled={placing}
              style={{
                width: "100%",
                backgroundColor: "#F57C00",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "18px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: placing ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(245,124,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {placing ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⏳
                  </motion.span>{" "}
                  Processing...
                </>
              ) : paymentMethod === "cod" ? (
                "Place Order (Pay on Delivery)"
              ) : (
                "💳 Pay with Paystack"
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
