// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AUTH_USER_KEY = "cs_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión almacenada
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ================================================================
  // 🔥 LOGIN DESDE EL BACKEND
  // ================================================================
  const login = (backendUser) => {
    const mappedUser = {
      userId: backendUser.UserId,
      fullName: backendUser.FullName,
      email: backendUser.Email,
      role: backendUser.Role,
      status: backendUser.Status,
      createdAt: backendUser.CreatedAt,
    };

    setUser(mappedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
  };

  // ================================================================
  // 🔥 LOGOUT
  // ================================================================
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  // ================================================================
  // 🔥 REGISTER DESDE BACKEND (sin local)
  // ================================================================
  const register = (backendUser) => {
    const mappedUser = {
      userId: backendUser.UserId,
      fullName: backendUser.FullName,
      email: backendUser.Email,
      role: backendUser.Role,
      status: backendUser.Status,
      createdAt: backendUser.CreatedAt,
    };

    setUser(mappedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mappedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
