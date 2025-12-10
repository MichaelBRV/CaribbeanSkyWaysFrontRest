// src/services/reservationsService.js
import { api } from "./api";

// GET /api/v1/reservations
export async function getReservations() {
  return await api.get("reservations");
}

// GET /api/v1/reservations/{id}
export async function getReservationById(id) {
  return await api.get(`reservations/${id}`);
}

// PUT /api/v1/reservations/{id}
export async function updateReservation(id, data) {
  // data: { Status, Notes }
  return await api.put(`reservations/${id}`, data);
}

// POST /api/v1/reservations/{id}/cancel
export async function cancelReservation(id) {
  return await api.post(`reservations/${id}/cancel`);
}

// DELETE /api/v1/reservations/{id}
export async function deleteReservation(id) {
  return await api.delete(`reservations/${id}`);
}
