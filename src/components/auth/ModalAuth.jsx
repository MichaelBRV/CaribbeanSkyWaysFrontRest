// src/components/auth/ModalAuth.jsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function ModalAuth({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
         onClick={onClose}>
      
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 pb-2 font-semibold ${
              mode === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </button>

          <button
            className={`flex-1 pb-2 font-semibold ${
              mode === "register" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setMode("register")}
          >
            Crear cuenta
          </button>
        </div>

        {mode === "login" ? <LoginForm onSuccess={onClose} /> : <RegisterForm onSuccess={onClose} />}
      </div>
    </div>
  );
}
