// src/services/seatService.js
import { api } from "./api";

// Obtener asientos REALES desde API Gestión
export async function getSeatsByFlight(flightId) {
  return await api.get(`seats/by-flight/${flightId}`);
}
