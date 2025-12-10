// src/services/authService.js
import { api } from "./api";

// LOGIN
export async function login(email, password) {
  const res = await api.post("users/login", {
    Email: email,
    PasswordHash: password
  });

  return res; // devuelve DTOUser directo
}

// REGISTER
export async function register(fullName, email, password) {
  const res = await api.post("users/agregar", {
    FullName: fullName,
    Email: email,
    PasswordHash: password,
    Role: "customer",
    Status: "Active"
  });

  return res; // también devuelve el dto como respuesta
}
