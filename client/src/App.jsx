import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import ReturnsPage from "./pages/ReturnsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import RecipeHelperPage from "./pages/RecipeHelperPage";
import SemanticSearchPage from "./pages/SemanticSearchPage";
import DynamicPricingPage from "./pages/DynamicPricingPage";
import FraudDetectionPage from "./pages/FraudDetectionPage";
import DemandForecastingPage from "./pages/DemandForecastingPage";
import OnboardingPage from "./pages/OnboardingPage";
import { useAuth } from "./context/AuthContext";

// NOTE: DealsPage import removed — the Deals page has been retired
// in favor of AI Recommendations. The route below 301-style redirects
// anyone hitting the old /deals URL (bookmarks, old links, etc.)
// straight to /recommendations so nothing breaks.

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/semantic-search" element={<SemanticSearchPage />} />
        <Route path="/dynamic-pricing" element={<DynamicPricingPage />} />
        <Route
          path="/returns"
          element={
            <P>
              <ReturnsPage />
            </P>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <P>
              <HomePage />
            </P>
          }
        />
        <Route
          path="/products"
          element={
            <P>
              <ProductsPage />
            </P>
          }
        />
        <Route
          path="/product/:id"
          element={
            <P>
              <ProductDetail />
            </P>
          }
        />
        <Route
          path="/cart"
          element={
            <P>
              <CartPage />
            </P>
          }
        />
        <Route
          path="/checkout"
          element={
            <P>
              <CheckoutPage />
            </P>
          }
        />
        <Route
          path="/order-confirmed"
          element={
            <P>
              <OrderConfirmation />
            </P>
          }
        />
        <Route
          path="/orders"
          element={
            <P>
              <OrdersPage />
            </P>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <P>
              <OrderDetailPage />
            </P>
          }
        />
        <Route
          path="/profile"
          element={
            <P>
              <ProfilePage />
            </P>
          }
        />
        <Route
          path="/about"
          element={
            <P>
              <AboutPage />
            </P>
          }
        />
        <Route
          path="/contact"
          element={
            <P>
              <ContactPage />
            </P>
          }
        />

        {/* Deals page retired — redirect old links to Recommendations */}
        <Route
          path="/deals"
          element={<Navigate to="/recommendations" replace />}
        />

        <Route
          path="/admin"
          element={
            <P>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </P>
          }
        />

        <Route
          path="/recommendations"
          element={
            <P>
              <RecommendationsPage />
            </P>
          }
        />

        <Route
          path="/recipe-helper"
          element={
            <P>
              <RecipeHelperPage />
            </P>
          }
        />

        <Route
          path="/fraud-detection"
          element={
            <ProtectedRoute>
              <FraudDetectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demand-forecasting"
          element={
            <ProtectedRoute>
              <DemandForecastingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
