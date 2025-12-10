import { useState } from "react";
import { register as registerRequest } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm({ onSuccess }) {
  const { login } = useAuth();  // usar login() para guardar la sesión
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newUser = await registerRequest(fullName, email, password);

      login(newUser); // inicia sesión automáticamente
      onSuccess();
    } catch (err) {
      setError("No se pudo crear la cuenta: el correo ya existe.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
        <input
          className="w-full mt-1 p-3 border rounded-lg"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Correo</label>
        <input
          type="email"
          className="w-full mt-1 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          type="password"
          className="w-full mt-1 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold">
        Crear cuenta
      </button>
    </form>
  );
}
