import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useModalAuth } from "../../hooks/useModalAuth";
import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo/CaribbeanSkywaysLogo.png";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  // proteger modal si está undefined
  const modal = useModalAuth();
  const openAuthModal = modal?.openAuthModal || (() => {});

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* 🔵 NAVBAR FIJO */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-md z-[9999]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} className="h-16" />
            <span className="text-xl font-bold text-blue-700">
              Caribbean Skyways
            </span>
          </Link>

          <div className="flex items-center gap-6">

            <Link to="/" className="hover:text-blue-600">Inicio</Link>

            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-600">
                Panel Admin
              </Link>
            )}

            {/* LOGIN — si no está logueado */}
            {!user && (
              <button
                onClick={openAuthModal}
                className="text-blue-600 font-semibold"
              >
                Iniciar sesión
              </button>
            )}

            {/* LOGUEADO */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600"
                >
                  Hola, {user.fullName.split(" ")[0]}
                  <span className="text-sm">{menuOpen ? "▲" : "▼"}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg py-2 z-[99999]">

                    <button
                      onClick={() => {
                        navigate("/dashboard/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      Mi perfil
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      Mis viajes
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard/payments");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      Pagos
                    </button>

                    <hr className="my-1" />

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔵 ESPACIADOR AUTOMÁTICO PARA QUE EL CONTENIDO NO SUBA */}
      <div className="h-24"></div>
    </>
  );
}
