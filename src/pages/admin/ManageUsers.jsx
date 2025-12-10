// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService.js";

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  // ======================================
  // 🔄 Cargar usuarios
  // ======================================
  const load = async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ======================================
  // ➕ Crear usuario
  // ======================================
  const openCreate = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "user",
    });
    setEditMode(false);
    setModalOpen(true);
  };

  // ======================================
  // ✏️ Editar usuario
  // ======================================
  const openEdit = (u) => {
    setForm({
      fullName: u.FullName,
      email: u.Email,
      password: "",
      role: u.Role.toLowerCase(), // "User" → "user"
    });
    setEditingUser(u);
    setEditMode(true);
    setModalOpen(true);
  };

  // ======================================
  // 📌 Manejo de inputs
  // ======================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // 💾 Guardar (crear / editar)
  // ======================================
  const handleSave = async () => {
    try {
      if (!form.fullName || !form.email) {
        alert("Nombre y correo son obligatorios");
        return;
      }

      if (editMode) {
        await updateUser({
          userId: editingUser.UserId,
          fullName: form.fullName,
          email: form.email,
          role: form.role,
        });
      } else {
        if (!form.password) {
          alert("Debe ingresar una contraseña");
          return;
        }
        await createUser(form);
      }

      await load();
      setModalOpen(false);
    } catch (err) {
      alert("Error guardando usuario: " + err.message);
    }
  };

  // ======================================
  // 🗑 Eliminar usuario
  // ======================================
  const handleDelete = async (u) => {
    if (!confirm(`¿Eliminar usuario ${u.FullName}?`)) return;

    try {
      await deleteUser(u.UserId);
      await load();
    } catch (err) {
      alert("Error eliminando usuario");
    }
  };

  // ======================================
  // 🖥 Render
  // ======================================
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  No hay usuarios registrados
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.UserId} className="border-t">
                <td className="p-3 font-semibold">{u.FullName}</td>
                <td className="p-3">{u.Email}</td>
                <td className="p-3 capitalize">{u.Role}</td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => openEdit(u)}
                    className="p-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(u)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">
          {editMode ? "Editar usuario" : "Nuevo usuario"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Nombre completo"
            value={form.fullName}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            disabled={editMode}
            className="border p-2 rounded col-span-2"
          />

          {!editMode && (
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}
