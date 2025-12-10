import { api } from "./api";

// LISTAR
export function getAllFlights() {
  return api.get("flights");
}

// CREAR
export function createFlight(data) {
  return api.post("flights", data);
}

// EDITAR
export function updateFlight(id, data) {
  return api.put(`flights/${id}`, data);
}

// ELIMINAR
export function deleteFlight(id) {
  return api.delete(`flights/${id}`);
}
