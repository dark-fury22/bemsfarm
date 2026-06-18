import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

// Product image map
const PRODUCT_IMAGES = {
  "Ofada Rice":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141430/ofada_rice_mhhzt2.jpg",
  "Long Grain Rice":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141706/long_grain_rice_yn01lt.jpg",
  "Palm Oil":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141485/palm_oil_ufbfu6.jpg",
  "Groundnut Oil":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141769/Groundnut-oil_mgv43t.jpg",
  "Black-eyed Beans":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780142333/black-eyed-beans_i2n8fi.jpg",
  "Brown Beans":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141864/brown_beans_zxbjos.jpg",
  "Garri (White)":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780142399/white_garri_zaq8i4.png",
  "Garri (Yellow)":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780142425/yellow_garri_kxiyxr.png",
  "Fresh Tomatoes":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141584/tomatoes_omiotj.jpg",
  "Dried Crayfish":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141631/crayfish_bslwl4.jpg",
  Cocoyam:
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780141939/cocoyam_wvtyqz.png",
  "Ugu Leaves":
    "https://res.cloudinary.com/dyzkjerez/image/upload/v1780142531/ugu_zva1av.png",
};

function getProductImage(product) {
  if (
    product.image_url?.startsWith("data:") ||
    product.image_url?.startsWith("http")
  )
    return product.image_url;
  return (
    PRODUCT_IMAGES[product.name] ||
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80"
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { addToCart } = useCart();
  const { isMobile, width } = useResponsive();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("search") || "");
  const [activeCat, setActiveCat] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [addedIds, setAddedIds] = useState({});

  const showSidebar = width >= 900;

  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data.products);
        setCategories(c.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter((p) => {
      const matchCat = activeCat === "All" || p.category_name === activeCat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  const cols = width < 500 ? 2 : width < 900 ? 3 : width < 1200 ? 3 : 4;

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () =>
        setAddedIds((prev) => {
          const n = { ...prev };
          delete n[product.id];
          return n;
        }),
      1500,
    );
  };

  const cats = ["All", ...categories.map((c) => c.name)];

  return (
    <PageWrapper>
      {/* ── Page Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
          padding: isMobile ? "32px 20px 28px" : "48px 40px 36px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              fontSize: "13px",
            }}
          >
            <button
              onClick={() => navigate("/home")}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
              }}
            >
              Home
            </button>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
            <span style={{ color: "white", fontWeight: 600 }}>Products</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "6px",
                  lineHeight: 1.1,
                }}
              >
                Fresh Farm Products
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                {loading ? "..." : `${filtered.length} products available`}
                {activeCat !== "All" && (
                  <span>
                    {" "}
                    in <strong style={{ color: "#86EFAC" }}>{activeCat}</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Search bar in header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: "14px",
                padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                minWidth: isMobile ? "100%" : "300px",
              }}
            >
              <span style={{ opacity: 0.6, fontSize: "16px" }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rice, tomatoes, palm oil..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "Nunito, sans-serif",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "28px 40px",
        }}
      >
        {/* Mobile category pills */}
        {!showSidebar && (
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
              className="no-scroll"
            >
              {cats.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    flexShrink: 0,
                    padding: "7px 16px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: activeCat === cat ? "#1B4332" : "white",
                    color: activeCat === cat ? "white" : "#4B5563",
                    boxShadow:
                      activeCat === cat
                        ? "0 4px 12px rgba(27,67,50,0.3)"
                        : "0 1px 4px rgba(0,0,0,0.1)",
                    transition: "all 0.2s",
                  }}
                >
                  {cat === "All" ? "🌿 All Products" : cat}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
          {/* ── Sidebar ── */}
          {showSidebar && (
            <div
              style={{
                width: "240px",
                flexShrink: 0,
                position: "sticky",
                top: "84px",
              }}
            >
              {/* Categories */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  marginBottom: "16px",
                  border: "1px solid #F3F4F6",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Categories
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {cats.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "14px",
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: activeCat === cat ? 700 : 500,
                        backgroundColor:
                          activeCat === cat ? "#D8F3DC" : "transparent",
                        color: activeCat === cat ? "#1B4332" : "#4B5563",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (activeCat !== cat)
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }}
                      onMouseLeave={(e) => {
                        if (activeCat !== cat)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span>{cat === "All" ? "🌿 All Products" : cat}</span>
                      {activeCat === cat && (
                        <span style={{ fontSize: "12px", color: "#40916C" }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  border: "1px solid #F3F4F6",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Sort By
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {[
                    { value: "featured", label: "⭐ Featured" },
                    { value: "price-asc", label: "↑ Price: Low to High" },
                    { value: "price-desc", label: "↓ Price: High to Low" },
                    { value: "name", label: "🔤 Name A → Z" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "14px",
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: sort === opt.value ? 700 : 500,
                        backgroundColor:
                          sort === opt.value ? "#D8F3DC" : "transparent",
                        color: sort === opt.value ? "#1B4332" : "#4B5563",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Products Grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {/* Active filter tag */}
                {activeCat !== "All" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#D8F3DC",
                      color: "#1B4332",
                      borderRadius: "50px",
                      padding: "4px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {activeCat}
                    <button
                      onClick={() => setActiveCat("All")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#2D6A4F",
                        fontSize: "14px",
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                {search && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#FEF3C7",
                      color: "#92400E",
                      borderRadius: "50px",
                      padding: "4px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    "{search}"
                    <button
                      onClick={() => setSearch("")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#92400E",
                        fontSize: "14px",
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile sort + view toggle */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                {!showSidebar && (
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#4B5563",
                      outline: "none",
                      backgroundColor: "white",
                      fontFamily: "Nunito, sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                    <option value="name">A → Z</option>
                  </select>
                )}
                {["grid", "list"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      cursor: "pointer",
                      backgroundColor: viewMode === mode ? "#1B4332" : "white",
                      color: viewMode === mode ? "white" : "#9CA3AF",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {mode === "grid" ? "⊞" : "≡"}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: "16px",
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      backgroundColor: "white",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="skeleton" style={{ height: "200px" }} />
                    <div style={{ padding: "16px" }}>
                      <div
                        className="skeleton"
                        style={{
                          height: "12px",
                          marginBottom: "8px",
                          width: "60%",
                        }}
                      />
                      <div
                        className="skeleton"
                        style={{ height: "16px", marginBottom: "8px" }}
                      />
                      <div
                        className="skeleton"
                        style={{ height: "20px", width: "40%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  backgroundColor: "white",
                  borderRadius: "24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🌾</div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  No products found
                </h3>
                <p style={{ color: "#9CA3AF", marginBottom: "20px" }}>
                  Try a different search or category
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCat("All");
                  }}
                  style={{
                    backgroundColor: "#1B4332",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 28px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Show All Products
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: "16px",
                }}
              >
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    added={!!addedIds[product.id]}
                    onAdd={handleAdd}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      cursor: "pointer",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      border: "1px solid #F3F4F6",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 6px 24px rgba(0,0,0,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 2px 12px rgba(0,0,0,0.06)")
                    }
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "14px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#9CA3AF",
                          marginBottom: "2px",
                        }}
                      >
                        {product.category_name}
                      </p>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#111827",
                          marginBottom: "2px",
                        }}
                      >
                        {product.name}
                      </p>
                      <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
                        {product.unit}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontWeight: 800,
                          fontSize: "17px",
                          color: "#1B4332",
                          marginBottom: "8px",
                        }}
                      >
                        ₦{(product.price * 1500).toLocaleString()}
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAdd(e, product)}
                        style={{
                          backgroundColor: addedIds[product.id]
                            ? "#40916C"
                            : "#F59E0B",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px 16px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontFamily: "Nunito, sans-serif",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {addedIds[product.id] ? "✓ Added" : "+ Add"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function ProductCard({ product, index, added, onAdd, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.14)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #F3F4F6",
        transition: "all 0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: "180px",
          overflow: "hidden",
          backgroundColor: "#F9FAFB",
        }}
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              backgroundColor: "rgba(0,0,0,0.4)",
              padding: "6px 14px",
              borderRadius: "50px",
            }}
          >
            View Details
          </span>
        </div>

        {/* TOP badge */}
        {product.is_featured && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#F59E0B",
              color: "white",
              fontSize: "11px",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "50px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ⭐ TOP
          </div>
        )}

        {/* Category pill */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "50px",
          }}
        >
          {product.category_name}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#111827",
            marginBottom: "2px",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "12px" }}>
          {product.unit}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              color: "#1B4332",
            }}
          >
            ₦{(product.price * 1500).toLocaleString()}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => onAdd(e, product)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              backgroundColor: added ? "#40916C" : "#F59E0B",
              color: "white",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              boxShadow: `0 4px 12px ${added ? "rgba(64,145,108,0.4)" : "rgba(245,158,11,0.4)"}`,
              transition: "all 0.3s",
            }}
          >
            {added ? "✓" : "+"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
