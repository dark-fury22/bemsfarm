import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { useCart } from "../context/CartContext";
import { useResponsive } from "../hooks/useResponsive";
import api from "../services/api";

const RECIPES = [
  {
    name: "Jollof Rice",
    emoji: "🍚",
    description: "Classic Nigerian jollof with rice, tomatoes, and spices",
  },
  {
    name: "Beans and Rice",
    emoji: "🫘",
    description: "Protein-rich meal with beans and rice combined",
  },
  {
    name: "Pepper Soup",
    emoji: "🌶️",
    description: "Spicy, aromatic soup with fresh pepper",
  },
  {
    name: "Ugu Soup",
    emoji: "🌿",
    description: "Nutritious soup with ugu leaves and crayfish",
  },
  {
    name: "Garri and Soup",
    emoji: "🍲",
    description: "Traditional garri served with vegetable soup",
  },
];

export default function RecipeHelperPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isMobile } = useResponsive();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addedIngredients, setAddedIngredients] = useState({});

  const fetchRecipe = async (recipeName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/ai/recipe-helper", {
        recipe_name: recipeName,
      });
      setRecipe(res.data);
      setSelectedRecipe(recipeName);
    } catch (err) {
      setError("Failed to fetch recipe: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = (ingredient) => {
    if (!ingredient.product_id) {
      alert(`${ingredient.ingredient_name} not found in store`);
      return;
    }
    addToCart({
      id: ingredient.product_id,
      name: ingredient.product_name,
      price: ingredient.price / 1500,
      unit: ingredient.unit,
    });
    setAddedIngredients((prev) => ({ ...prev, [ingredient.product_id]: true }));
    setTimeout(() => {
      setAddedIngredients((prev) => {
        const n = { ...prev };
        delete n[ingredient.product_id];
        return n;
      });
    }, 2000);
  };

  const handleAddAll = () => {
    if (!recipe?.ingredients) return;
    recipe.ingredients.forEach((ing) => {
      if (ing.product_id) {
        addToCart({
          id: ing.product_id,
          name: ing.product_name,
          price: ing.price ? ing.price / 1500 : 0,
          unit: ing.unit,
        });
      }
    });
    alert("All ingredients added to cart! 🛒");
    navigate("/cart");
  };

  return (
    <PageWrapper>
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "20px 16px" : "40px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
              padding: isMobile ? "32px 16px 28px" : "48px 40px 36px",
              marginBottom: "32px",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontSize: "48px" }}>👨‍🍳</div>
              <div>
                <h1
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: isMobile ? "24px" : "32px",
                    fontWeight: 800,
                    color: "white",
                    marginBottom: "4px",
                  }}
                >
                  Recipe Helper
                </h1>
                <p
                  style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}
                >
                  Choose a recipe, we'll find all the ingredients you need
                </p>
              </div>
            </div>
          </div>

          {!recipe ? (
            <>
              {/* Recipe Selection Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "16px",
                }}
              >
                {RECIPES.map((r) => (
                  <motion.button
                    key={r.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchRecipe(r.name)}
                    disabled={loading}
                    style={{
                      padding: "24px",
                      border: "none",
                      borderRadius: "16px",
                      backgroundColor: "white",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      textAlign: "center",
                      fontFamily: "Nunito, sans-serif",
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                      {r.emoji}
                    </div>
                    <h3
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1B4332",
                        marginBottom: "8px",
                      }}
                    >
                      {r.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#9CA3AF",
                        lineHeight: 1.4,
                      }}
                    >
                      {r.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Recipe Detail */}
              <button
                onClick={() => setRecipe(null)}
                style={{
                  marginBottom: "20px",
                  padding: "10px 20px",
                  border: "1px solid #E5E7EB",
                  background: "white",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1B4332",
                }}
              >
                ← Choose Different Recipe
              </button>

              <div
                style={{
                  backgroundColor: "#F8FAFB",
                  borderRadius: "20px",
                  padding: isMobile ? "20px" : "30px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#1B4332",
                    marginBottom: "12px",
                  }}
                >
                  {recipe.recipe_name}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9CA3AF",
                    marginBottom: "20px",
                  }}
                >
                  Serves {recipe.servings} people
                </p>

                {/* Instructions */}
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    borderLeft: "4px solid #F59E0B",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#4B5563",
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    📝 {recipe.instructions}
                  </p>
                </div>

                {/* Ingredients */}
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1B4332",
                    marginBottom: "16px",
                  }}
                >
                  Ingredients Needed
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {recipe.ingredients?.map((ing, i) => (
                    <motion.div
                      key={`${ing.ingredient_name}-${i}`}
                      whileHover={{ y: -2 }}
                      style={{
                        backgroundColor: "white",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1B4332",
                          }}
                        >
                          {ing.product_name || ing.ingredient_name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
                          {ing.unit}
                        </p>
                      </div>
                      {ing.price && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddIngredient(ing)}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            borderRadius: "8px",
                            backgroundColor: addedIngredients[ing.product_id]
                              ? "#40916C"
                              : "#F59E0B",
                            color: "white",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "12px",
                            fontFamily: "Nunito, sans-serif",
                          }}
                        >
                          {addedIngredients[ing.product_id] ? "✓" : "+"}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddAll}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #1B4332, #40916C)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "16px",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  🛒 Add All Ingredients to Cart
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
