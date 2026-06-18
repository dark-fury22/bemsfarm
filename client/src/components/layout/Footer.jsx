import { Link } from "react-router-dom";
import logo from "../../assets/bemsfarms_logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      heading: "Shop",
      links: [
        { label: "All Products", path: "/products" },
        { label: "Deals & Offers", path: "/deals" },
        { label: "Smart Search", path: "/semantic-search" },
        { label: "Recommendations", path: "/recommendations" },
      ],
    },
    {
      heading: "Account",
      links: [
        { label: "My Profile", path: "/profile" },
        { label: "My Orders", path: "/orders" },
        { label: "Returns", path: "/returns" },
        { label: "Cart", path: "/cart" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact", path: "/contact" },
        { label: "Pricing Guide", path: "/dynamic-pricing" },
        { label: "Recipe Helper", path: "/recipe-helper" },
      ],
    },
  ];

  return (
    <footer style={{ backgroundColor: "#111827", color: "white" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "56px 24px 36px",
        }}
      >
        {/* ── TOP GRID ───────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand col */}
          <div style={{ gridColumn: "span 1" }}>
            {/*
              KEY FIX: the logo has a cream/beige background baked in.
              We wrap it in a white rounded box so it sits correctly
              on the dark footer — NOT a filter, which makes it look ghostly.
            */}
            <div
              style={{
                display: "inline-block",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "6px 12px",
                marginBottom: "16px",
              }}
            >
              <img
                src={logo}
                alt="BemsFarms"
                style={{ height: "34px", width: "auto", display: "block" }}
              />
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: "20px",
                maxWidth: "240px",
              }}
            >
              Nigeria's smartest farm-fresh marketplace. From seed to table,
              powered by AI.
            </p>

            {/* Tech badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["🤖 AI Search", "💰 Smart Pricing", "🛡️ Secure"].map((b, i) => (
                <span
                  key={i}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "50px",
                    border: "1px solid rgba(64,145,108,0.4)",
                    color: "#6EE7B7",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: "14px",
                }}
              >
                {heading}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        textDecoration: "none",
                        fontSize: "14px",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "white")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BOTTOM ROW ─────────────────────────────────── */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.07)",
            marginBottom: "24px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "13px",
              margin: 0,
            }}
          >
            © {year} BemsFarms · Premium Farm Produce 🇳🇬
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Support"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "13px",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
