import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const flights = state?.flights || [];
  const passengers = state?.passengers || [];
  const seatHolds = state?.seatHolds || [];
  const confirmationData = state?.confirmationData;

  // ============================================================
  // VALIDACIÓN
  // ============================================================
  if (!flights.length || !passengers.length || !seatHolds.length) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-2xl font-bold text-red-600">
          ❌ No hay información de la reserva.
        </h1>
      </div>
    );
  }

  // ============================================================
  // CÁLCULO TOTAL (Usamos fallbacks porque a veces viene price, Price, precio...)
  // ============================================================
  const total = flights.reduce(
    (sum, f) => sum + (f.Price ?? f.price ?? f.precio ?? 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <CheckCircle className="text-green-600" size={45} />
        <h1 className="text-4xl font-bold text-slate-800">
          Reserva Confirmada 🎉
        </h1>
      </div>

      <p className="text-slate-600 text-lg">
        Gracias por tu compra. Tu pago fue procesado correctamente.
      </p>

      {/* CONTENEDOR */}
      <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">

        {/* ======================================================== */}
        {/* DETALLES DE VUELO */}
        {/* ======================================================== */}
        <h2 className="text-xl font-bold text-slate-800">Detalles del Viaje</h2>

        {flights.map((f, idx) => (
          <div key={idx} className="border-b pb-4 mb-4">
            <p><b>Vuelo:</b> {f.id}</p>
            <p><b>Ruta:</b> {f.origin} → {f.destination}</p>
            <p>
              <b>Precio:</b> $
              {f.Price ?? f.price ?? f.precio ?? "0"}
            </p>
          </div>
        ))}

        {/* ======================================================== */}
        {/* PASAJEROS */}
        {/* ======================================================== */}
        <h2 className="text-xl font-bold text-slate-800">Pasajeros</h2>
        {passengers.map((p, idx) => (
          <p key={idx} className="flex items-center gap-2 text-slate-700">
            <span>👤</span>
            {p.fullName} — {p.document}
          </p>
        ))}

        {/* ======================================================== */}
        {/* ASIENTOS */}
        {/* ======================================================== */}
        <h2 className="text-xl font-bold text-slate-800 mt-5">Asientos</h2>

        {seatHolds.map((h, idx) => (
          <p key={idx} className="flex items-center gap-2 text-slate-700">
            ✈️ <b>Vuelo {h.flightId}</b> — Asiento {h.seat}
          </p>
        ))}

        {/* ======================================================== */}
        {/* TOTAL PAGADO */}
        {/* ======================================================== */}
        <h2 className="text-2xl font-bold text-slate-900 mt-6">
          Total Pagado: ${total.toFixed(2)}
        </h2>

        {/* BOTÓN */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
