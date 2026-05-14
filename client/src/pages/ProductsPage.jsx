import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import ProductCard from "../components/ui/ProductCard";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isMobile, isTablet } = useResponsive();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

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
      const matchCat =
        activeCategory === "All" || p.category_name === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.is_featured - a.is_featured;
    });

  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  const FilterContent = () => (
    <>
      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#F1F3F4",
            borderRadius: "12px",
            padding: "10px 14px",
          }}
        >
          <span style={{ opacity: 0.5 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#9AA0A6",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "18px",
          border: "1px solid #E8EAED",
          marginBottom: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#202124",
            marginBottom: "12px",
          }}
        >
          Categories
        </h3>
        {["All", ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              if (isMobile) setShowFilters(false);
            }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: activeCategory === cat ? 700 : 400,
              backgroundColor:
                activeCategory === cat ? "#F1F8F1" : "transparent",
              color: activeCategory === cat ? "#2E7D32" : "#5F6368",
              transition: "all 0.15s",
              marginBottom: "2px",
            }}
          >
            <span>{cat === "All" ? "🌿 All Products" : cat}</span>
            {activeCategory === cat && (
              <span style={{ fontSize: "12px" }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "18px",
          border: "1px solid #E8EAED",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#202124",
            marginBottom: "12px",
          }}
        >
          Sort By
        </h3>
        {[
          { value: "default", label: "Featured" },
          { value: "price-asc", label: "Price: Low → High" },
          { value: "price-desc", label: "Price: High → Low" },
          { value: "name", label: "Name A → Z" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: sort === opt.value ? 700 : 400,
              backgroundColor: sort === opt.value ? "#F1F8F1" : "transparent",
              color: sort === opt.value ? "#2E7D32" : "#5F6368",
              transition: "all 0.15s",
              marginBottom: "2px",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "16px" : "32px 24px",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
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
          <span style={{ color: "#202124", fontWeight: 600 }}>Products</span>
        </div>

        {/* Mobile Top Bar */}
        {isMobile && (
          <div style={{ marginBottom: "16px" }}>
            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#F1F3F4",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "10px",
              }}
            >
              <span style={{ opacity: 0.5 }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rice, palm oil, garri..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#9AA0A6",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Category Pills */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
              className="hide-scrollbar"
            >
              {["All", ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    whiteSpace: "nowrap",
                    padding: "7px 14px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor:
                      activeCategory === cat ? "#2E7D32" : "white",
                    color: activeCategory === cat ? "white" : "#5F6368",
                    flexShrink: 0,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    transition: "all 0.2s",
                  }}
                >
                  {cat === "All" ? "🌿 All" : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div style={{ width: isTablet ? "200px" : "230px", flexShrink: 0 }}>
              <FilterContent />
            </div>
          )}

          {/* Products Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <p style={{ color: "#5F6368", fontSize: "14px" }}>
                Showing{" "}
                <strong style={{ color: "#2E7D32" }}>{filtered.length}</strong>{" "}
                products
                {activeCategory !== "All" && (
                  <span>
                    {" "}
                    in <strong>{activeCategory}</strong>
                  </span>
                )}
                {search && (
                  <span>
                    {" "}
                    for "<strong>{search}</strong>"
                  </span>
                )}
              </p>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {/* Mobile Sort */}
                {isMobile && (
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    style={{
                      padding: "7px 12px",
                      border: "1px solid #E8EAED",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#202124",
                      cursor: "pointer",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="default">Sort: Featured</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                    <option value="name">Name A-Z</option>
                  </select>
                )}
                {["grid", "list"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1px solid #E8EAED",
                      backgroundColor: viewMode === mode ? "#2E7D32" : "white",
                      color: viewMode === mode ? "white" : "#5F6368",
                      cursor: "pointer",
                      fontSize: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {mode === "grid" ? "⊞" : "≡"}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: "14px",
                }}
              >
                {[...Array(cols * 2)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                    style={{
                      height: "260px",
                      backgroundColor: "white",
                      borderRadius: "20px",
                      border: "1px solid #E8EAED",
                    }}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  border: "1px solid #E8EAED",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#202124",
                    marginBottom: "8px",
                  }}
                >
                  No products found
                </h3>
                <p style={{ color: "#9AA0A6", marginBottom: "16px" }}>
                  Try a different search or category
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  style={{
                    backgroundColor: "#2E7D32",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: "14px",
                }}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
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
                      borderRadius: "14px",
                      padding: "14px 16px",
                      border: "1px solid #E8EAED",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 60 : 72,
                        height: isMobile ? 60 : 72,
                        borderRadius: "12px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={getImg(product.name)}
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
                          fontWeight: 700,
                          fontSize: isMobile ? "14px" : "15px",
                          color: "#202124",
                          marginBottom: "2px",
                        }}
                      >
                        {product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9AA0A6" }}>
                        {product.unit} • {product.category_name}
                      </p>
                    </div>
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: isMobile ? "14px" : "16px",
                        color: "#2E7D32",
                        flexShrink: 0,
                      }}
                    >
                      ₦{(product.price * 1500).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "280px",
                backgroundColor: "#F8F9FA",
                zIndex: 300,
                padding: "20px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#9AA0A6",
                  }}
                >
                  ✕
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

function getImg(name) {
  const map = {
    "Ofada Rice":
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=70",
    "Long Grain Rice":
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=200&q=70",
    "Palm Oil":
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=70",
    "Groundnut Oil":
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=70",
    "Black-eyed Beans":
      "https://images.unsplash.com/photo-1515543904379-3d757efe72e4?w=200&q=70",
    "Brown Beans":
      "https://images.unsplash.com/photo-1515543904379-3d757efe72e4?w=200&q=70",
    "Fresh Tomatoes":
      "https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=200&q=70",
    "Dried Crayfish":
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=70",
    "Ugu Leaves":
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=70",
    Cocoyam:
      "https://images.unsplash.com/photo-1617957743089-c3902b2e89cb?w=200&q=70",
  };
  return (
    map[name] ||
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=70"
  );
}
