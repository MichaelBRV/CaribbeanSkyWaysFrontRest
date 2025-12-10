import { createContext, useContext, useState } from "react";

const ModalAuthContext = createContext();

export function ModalAuthProvider({ children }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <ModalAuthContext.Provider
      value={{
        authOpen,
        openAuthModal: () => setAuthOpen(true),
        closeAuthModal: () => setAuthOpen(false),
      }}
    >
      {children}
    </ModalAuthContext.Provider>
  );
}

export function useModalAuth() {
  return useContext(ModalAuthContext);
}
