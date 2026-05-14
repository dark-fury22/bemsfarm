import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;
  return children;
}
