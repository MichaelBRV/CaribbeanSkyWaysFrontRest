// src/services/userService.js
import { api } from "./api";

export function getUsers() {
  return api.get("users/listar");
}

export function getUser(id) {
  return api.get(`users/${id}`);
}

export function createUser(data) {
  console.log("▶ createUser payload FRONT:", data);

  // 🔥 Mapeo de rol para la BD: 'user' -> 'Customer', 'admin' -> 'Admin'
  const roleMapped =
    data.role === "admin"
      ? "Admin"
      : "Customer"; // todo lo demás lo tratamos como Customer

  return api.post("users/agregar", {
    FullName: data.fullName,
    Email: data.email,
    PasswordHash: data.password, // el backend hace el hash
    Role: roleMapped,
    Status: "Active",
  });
}

export function updateUser(data) {
  const roleMapped =
    data.role === "admin"
      ? "Admin"
      : "Customer";

  return api.put("users/actualizar", {
    UserId: data.userId,
    FullName: data.fullName,
    Email: data.email,
    Role: roleMapped,
    Status: "Active",
  });
}

export function deleteUser(id) {
  return api.delete(`users/eliminar/${id}`);
}
