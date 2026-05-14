import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import DealsPage from "./pages/DealsPage";
import AdminPage from "./pages/AdminPage";

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
        <Route
          path="/deals"
          element={
            <P>
              <DealsPage />
            </P>
          }
        />
        <Route
          path="/admin"
          element={
            <P>
              <AdminPage />
            </P>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
