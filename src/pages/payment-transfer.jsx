import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { executeCheckout } from "../services/checkoutService";
import { useAuth } from "../hooks/useAuth";

export default function PaymentTransfer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const flights = state?.flights;
  const passengers = state?.passengers;
  const seatHolds = state?.seatHolds;

  const cuentaDestino = 244;
  const [cuentaOrigen, setCuentaOrigen] = useState(243);

  if (!flights || !passengers || !seatHolds) {
    return <div className="p-10 text-red-600">❌ Faltan datos para el pago.</div>;
  }

  // Total del vuelo (ya funciona)
  const total = flights.reduce((sum, f) => sum + (f.Price || 0), 0);

  const handlePay = async () => {
    try {
      const req = {
        UserId: user.userId,

        FlightIds: flights.map(f => f.id),  // 🔥 tu backend usa "id"

        Pasajeros: passengers.map(p => ({
          FullName: p.fullName,
          DocumentNumber: p.document,
          BirthDate: p.birthDate || "2000-01-01",
          Nationality: p.nationality || "EC",
        })),

        SeatHolds: seatHolds.map(h => ({
          HoldId: h.holdId,
          SeatId: h.seatId,
          FlightId: h.flightId,
        })),

        Payment: {
          CuentaOrigen: parseInt(cuentaOrigen),
          CuentaDestino: cuentaDestino,
          Monto: total,
        }
      };

      console.log("🟦 Request Checkout corregida:", req);

      const resp = await executeCheckout(req);

      navigate("/confirmation", {
        state: {
          flights,
          passengers,
          seatHolds,
          total,
          confirmationData: resp
        }
      });

    } catch (err) {
      console.error("❌ Error en pago:", err);
      alert("Error en pago: " + err?.message);
    }
  };

  console.log("🚀 Vuelos recibidos en PaymentTransfer:", flights);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Pago por Transferencia</h1>

      <div className="bg-slate-100 p-5 rounded-xl shadow-md space-y-2">
        <p>Total a pagar: <b>${total.toFixed(2)}</b></p>

        <label>Cuenta bancaria del cliente</label>
        <input
          type="number"
          value={cuentaOrigen}
          onChange={e => setCuentaOrigen(e.target.value)}
          className="w-full p-3 rounded border"
        />

        <button
          onClick={handlePay}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Confirmar transferencia
        </button>
      </div>
    </div>
  );
}
