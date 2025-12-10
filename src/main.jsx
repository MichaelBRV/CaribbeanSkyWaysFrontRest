import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ModalAuthProvider } from "./hooks/useModalAuth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ModalAuthProvider>
        <App />
      </ModalAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
