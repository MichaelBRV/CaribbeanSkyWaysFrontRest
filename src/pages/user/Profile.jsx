import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    document: user.document || "",
    phone: user.phone || "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updates = {
      fullName: form.fullName,
      email: form.email,
      document: form.document,
      phone: form.phone,
    };

    if (form.password.trim() !== "") {
      updates.password = form.password;
    }

    updateProfile(updates);
    setMsg("Perfil actualizado correctamente ✔");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
      <p className="text-slate-600 mb-6">Edita tu información personal.</p>

      {msg && <p className="text-green-600 mb-4">{msg}</p>}

      <form
        onSubmit={handleSave}
        className="bg-white border rounded-xl shadow-md p-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Nombre completo</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Correo</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Documento</label>
          <input
            name="document"
            value={form.document}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Teléfono</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Nueva contraseña (opcional)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
