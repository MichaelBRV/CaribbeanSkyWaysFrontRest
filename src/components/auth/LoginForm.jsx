import { useState } from "react";
import { login as loginRequest } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userDto = await loginRequest(email, password);

      login(userDto); // guarda sesión
      onSuccess();
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm font-semibold text-slate-700">Correo</label>
        <input
          type="email"
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          type="password"
          className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
        Iniciar sesión
      </button>
    </form>
  );
}
