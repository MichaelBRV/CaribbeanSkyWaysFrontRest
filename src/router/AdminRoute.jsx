import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useModalAuth } from "../hooks/useModalAuth";

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  const { openAuthModal } = useModalAuth();

  // 🔥 Si NO hay usuario → abrir modal en efecto
  useEffect(() => {
    if (!user) {
      openAuthModal();
    }
  }, [user]);

  // ❌ No hay usuario → redirigir al home
  // ❌ Hay usuario pero NO es admin → bloquear también
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
