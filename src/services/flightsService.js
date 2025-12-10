// src/services/flightsService.js
import { api } from "./api";

/**
 * Busca vuelos en el backend.
 *
 * Endpoint:
 *   GET /api/v1/flights/search
 *
 * Parámetros que espera el backend:
 *   - origen  : nombre de la ciudad (string)   → "Quito"
 *   - destino : nombre de la ciudad (string)   → "Miami"
 *   - fecha   : string ISO "YYYY-MM-DDTHH:mm:ss"
 */
export async function searchFlights({ origin, destination, departureDate }) {
  // 🕒 Normalizar la fecha:
  // si viene como "2025-12-11" le agregamos "T00:00:00"
  let fecha = departureDate;
  if (fecha && fecha.length === 10) {
    fecha = `${fecha}T00:00:00`;
  }

  const params = {
    origen: origin,        // ej. "Quito"
    destino: destination,  // ej. "Miami"
    fecha,                 // ej. "2025-12-11T00:00:00"
  };

  console.log("🔍 searchFlights → params enviados al backend:", params);

  // El backend devuelve una lista de DTOFlight
  const flights = await api.get("flights/search", params);

  // Mapeamos al formato que usa el frontend
  return flights.map((f) => ({
    id: f.FlightId,
    originId: f.OriginId,
    destinationId: f.DestinationId,
    origin: f.OriginName,
    destination: f.DestinationName,
    departure: f.DepartureTime,
    arrival: f.ArrivalTime,
    duration: f.Duration,
    airline: f.Airline,
    price: Number(f.Price ?? 0),
    seats: f.SeatsAvailable,
    aircraftId: f.AircraftId,
    aircraft: f.AircraftModel,
    cabinClass: f.CabinClass,
    cancellationPolicy: f.CancellationPolicy,
  }));
}
