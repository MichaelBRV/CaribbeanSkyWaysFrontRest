import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { checkout } from "../services/checkoutService";
import { useAuth } from "../hooks/useAuth";

export default function PaymentTransfer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const flights = state?.flights;
  const passengers = state?.passengers;
  const seatHolds = state?.seatHolds;

  // 🔥 Cuentas establecidas por la aerolínea
  const cuentaOrigenDefault = 243; 
  const cuentaDestino = 244;

  const [cuentaOrigen, setCuentaOrigen] = useState(cuentaOrigenDefault);

  if (!flights || !passengers || !seatHolds) {
    return (
      <div className="p-10 text-red-600 font-bold">
        ❌ Error: no hay datos suficientes para el pago.
      </div>
    );
  }

  const total = flights.reduce((sum, f) => sum + f.Price, 0);

  // ============================================================
  // 🔥 BOTÓN PAGAR
  // ============================================================
  const handlePay = async () => {
    if (!cuentaOrigen) {
      alert("Debes ingresar tu cuenta bancaria.");
      return;
    }

    try {
      const req = {
        UserId: user.userId,

        // Vuelos
        FlightIds: flights.map((f) => f.FlightId),

        // Pasajeros
        Pasajeros: passengers.map((p) => ({
          FullName: p.fullName,
          Document: p.document,
        })),

        // SeatHolds generados
        SeatHolds: seatHolds.map((h) => ({
          HoldId: h.holdId,
          SeatId: h.seatId,
          FlightId: h.flightId,
        })),

        // Pago por transferencia
        Payment: {
          CuentaOrigen: parseInt(cuentaOrigen), // 🔥 SIEMPRE SERÁ 243
          CuentaDestino: cuentaDestino,         // 🔥 SIEMPRE SERÁ 244
          Monto: total,
          Metodo: "transferencia",
        },
      };

      console.log("🟦 REQUEST CHECKOUT ENVIADO:", req);

      const resp = await checkout(req);

      navigate("/confirmation", {
        state: {
          flights,
          passengers,
          seatHolds,
          total,
          confirmationData: resp,
        },
      });
    } catch (err) {
      console.error("❌ Error en pago:", err);
      alert("No se pudo procesar el pago: " + err?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Pago por Transferencia</h1>

      <div className="bg-slate-100 p-5 rounded-xl shadow-md space-y-2">
        <p className="text-lg">
          Total a pagar:{" "}
          <span className="font-bold text-green-600">${total.toFixed(2)}</span>
        </p>

        <label className="block text-sm font-semibold">
          Cuenta desde la que transfieres (tu cuenta)
        </label>
        <input
          type="number"
          value={cuentaOrigen}
          onChange={(e) => setCuentaOrigen(e.target.value)}
          placeholder="243"
          className="w-full p-3 rounded-lg border"
        />

        <p className="text-sm text-slate-600">
          La aerolínea recibirá el pago en su cuenta <b>244</b>.
        </p>

        <button
          onClick={handlePay}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-lg"
        >
          Confirmar transferencia
        </button>
      </div>
    </div>
  );
}
