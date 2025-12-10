// src/services/checkoutService.js
import { api } from "./api";

// ===========================================================
// 🔥 Ejecutar el checkout completo contra tu API REST
// POST /api/v1/checkout
// ===========================================================
export async function executeCheckout({
  pasajeros,
  flights,
  payment,
  seatHolds
}) {
  try {
    // Tu API espera FlightIds → una lista de enteros
    const flightIds = flights.map(f => f.FlightId);

    // Construir request EXACTA para tu CheckoutController
    const body = {
      Pasajeros: pasajeros.map(p => ({
        Nombre: p.fullName,
        Documento: p.documentId,
        Email: p.email
      })),
      FlightIds: flightIds,
      Payment: {
        CuentaOrigen: payment.cuentaOrigen,
        CuentaDestino: payment.cuentaDestino,
        Monto: payment.monto
      },
      SeatHolds: seatHolds?.map(h => ({
        HoldId: h.holdId,
        FlightId: h.flightId,
        SeatId: h.seatId
      })) || []
    };

    console.log("📤 Enviando checkout al backend:", body);

    const resp = await api.post("checkout", body);

    console.log("📥 Respuesta del checkout:", resp);

    return resp;
  } catch (error) {
    console.error("❌ Error ejecutando checkout:", error);
    throw error;
  }
}
