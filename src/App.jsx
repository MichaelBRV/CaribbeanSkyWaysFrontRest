import './App.css'
import AppRouter from "./router/AppRouter";
import ModalAuth from "./components/auth/ModalAuth";
import { useModalAuth } from "./hooks/useModalAuth";

export default function App() {
  const { authOpen, closeAuthModal } = useModalAuth();

  return (
    <>
      <AppRouter />
      <ModalAuth isOpen={authOpen} onClose={closeAuthModal} />
    </>
  );
}






