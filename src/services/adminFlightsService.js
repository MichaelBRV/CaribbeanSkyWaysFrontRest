// src/services/adminFlightsService.js
import { api } from "./api";

// 🔹 Listar vuelos para administrador
export function getAllFlights() {
  return api.get("admin/flights");
}

// 🔹 Crear vuelo
export function createFlight(data) {
  return api.post("admin/flights", data);
}

// 🔹 Actualizar vuelo
export function updateFlight(flightId, data) {
  return api.put(`admin/flights/${flightId}`, data);
}

// 🔹 Finalizar vuelo (en lugar de borrar duro)
export function finalizeFlight(flightId) {
  return api.put(`admin/flights/${flightId}/finalizar`);
}
