import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useModalAuth } from "../hooks/useModalAuth";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const { openAuthModal } = useModalAuth();

  // 🚨 No hacer setState durante render
  useEffect(() => {
    if (!user) {
      openAuthModal();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
