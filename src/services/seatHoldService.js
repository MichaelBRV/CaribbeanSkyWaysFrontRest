// src/services/seatHoldService.js
import { api } from "./api";

// =============================================
// 1️⃣ OBTENER ASIENTOS REALES POR VUELO
// GET /api/v1/seats/by-flight/{flightId}
// =============================================
export async function getSeatsByFlight(flightId) {
  try {
    const url = `seats/by-flight/${flightId}`;
    console.log("🔵 GET REAL SEATS →", url);

    const seats = await api.get(url);

    console.log("✅ Asientos recibidos desde el backend:", seats);
    return seats;
  } catch (err) {
    console.error("❌ Error obteniendo asientos reales:", err);
    throw err;
  }
}

// =====================================================
// 2️⃣ CREAR SEATHOLD REAL
// POST /api/v1/seats/hold
// Body:
// {
//    "UserId": 40001,
//    "FlightId": 1595,
//    "SeatId": 7027
// }
// =====================================================
export async function createSeatHold({ userId, flightId, seatId }) {
  try {
    console.log(
      `🔥 Creando SeatHold → userId=${userId}, flightId=${flightId}, seatId=${seatId}`
    );

    const response = await api.post("seats/hold", {
      UserId: userId,
      FlightId: flightId,
      SeatId: seatId,
    });

    console.log("✅ SeatHold creado:", response);
    return response.holdId; // tu backend devuelve { holdId: "HOLD-XYZ" }
  } catch (error) {
    console.error("❌ Error creando SeatHold:", error);
    throw error;
  }
}
