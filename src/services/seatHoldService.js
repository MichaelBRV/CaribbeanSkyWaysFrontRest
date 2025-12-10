// src/services/seatHoldService.js
import { api } from "./api";
import { API_URL } from "./api";

// ============================================================
// 1️⃣ OBTENER ASIENTOS REALES POR VUELO
// GET /api/v1/seats/by-flight/{flightId}
// ============================================================
export async function getSeatsByFlight(flightId) {
  try {
    const endpoint = `seats/by-flight/${flightId}`;
    console.log("🔵 GET REAL SEATS →", `${API_URL}/${endpoint}`);

    const seats = await api.get(endpoint);

    console.log("✅ Asientos recibidos:", seats);
    return seats;
  } catch (err) {
    console.error("❌ Error obteniendo asientos reales:", err);
    throw err;
  }
}

// ============================================================
// 2️⃣ CREAR SEAT HOLD REAL
// POST /api/v1/seats/hold
// Body:
// {
//    "UserId": 40001,
//    "FlightId": 1595,
//    "SeatId": 7027
// }
// ============================================================
export async function createSeatHold({ userId, flightId, seatId }) {
  try {
    console.log(
      `🔥 Creando SeatHold → user=${userId}, flight=${flightId}, seat=${seatId}`
    );

    const body = {
      UserId: userId,
      FlightId: flightId,
      SeatId: seatId,
    };

    const response = await api.post("seats/hold", body);

    console.log("✅ SeatHold creado correctamente:", response);

    // Backend devuelve algo como:
    // { mensaje: "...", holdId: "HOLD-ABC123" }
    return response.holdId;
  } catch (error) {
    console.error("❌ Error creando SeatHold:", error);
    throw error;
  }
}

// ============================================================
// 3️⃣ CONFIRMAR HOLD → al pagar
// PUT /api/v1/seats/confirm/{holdId}
// ============================================================
export async function confirmSeatHold(holdId) {
  try {
    console.log(`🟢 Confirmando SeatHold → ${holdId}`);

    const resp = await api.put(`seats/confirm/${holdId}`);

    console.log("✅ Hold confirmado:", resp);
    return resp;
  } catch (err) {
    console.error("❌ Error confirmando hold:", err);
    throw err;
  }
}

// ============================================================
// 4️⃣ CANCELAR HOLD → si el usuario abandona
// DELETE /api/v1/seats/cancel/{holdId}
// ============================================================
export async function cancelSeatHold(holdId) {
  try {
    console.log(`🟠 Cancelando SeatHold → ${holdId}`);

    const resp = await api.delete(`seats/cancel/${holdId}`);

    console.log("🗑️ Hold cancelado:", resp);
    return resp;
  } catch (err) {
    console.error("❌ Error cancelando hold:", err);
    throw err;
  }
}

// ============================================================
// 5️⃣ LIMPIAR EXPIRADOS (opcional)
// DELETE /api/v1/seats/cleanup
// ============================================================
export async function cleanupExpiredHolds() {
  try {
    console.log("🧹 Limpiando holds expirados...");
    const resp = await api.delete("seats/cleanup");
    console.log("🧼 Limpiados:", resp);
    return resp;
  } catch (err) {
    console.error("❌ Error limpiando holds expirados:", err);
    throw err;
  }
}
