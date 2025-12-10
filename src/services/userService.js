import { api } from "./api";

export function getUsers() {
  return api.get("users/listar");
}

export function getUser(id) {
  return api.get(`users/${id}`);
}

export function createUser(data) {
  return api.post("users/agregar", {
    FullName: data.fullName,
    Email: data.email,
    PasswordHash: data.password,
    Role: data.role,
    Status: "Active",
  });
}

export function updateUser(data) {
  return api.post("users/actualizar", {
    UserId: data.userId,
    FullName: data.fullName,
    Email: data.email,
    Role: data.role,
    Status: "Active",
  });
}

export function deleteUser(id) {
  return api.post(`users/eliminar/${id}`);
}
