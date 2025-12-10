// src/pages/admin/components/AdminReservationDetailModal.jsx
import { X, Plane, Users } from "lucide-react";

export default function AdminReservationDetailModal({ reservation, onClose }) {
  if (!reservation) return null;

  const {
    pnr,
    status,
    flight,
    passengers,
    seats,
    totalAmount,
    paymentMethod,
    cabin,
  } = reservation;

  const dep = new Date(flight.departure);
  const arr = new Date(flight.arrival);

  const formatDate = (d) =>
    d.toLocaleDateString("es-EC", { timeZone: "UTC" });

  const formatTime = (d) =>
    d.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          <X size={22} />
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Reserva <span className="text-blue-600">{pnr}</span>
        </h2>

        <p className="text-sm text-slate-600 mb-4">
          Estado: <span className="font-semibold">{status}</span>
        </p>

        {/* DETALLES DEL VUELO */}
        <div className="bg-slate-50 p-4 rounded-lg border mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Plane size={18} className="text-blue-600" />
            <p className="font-semibold text-blue-700 text-lg">
              {flight.origin} → {flight.destination}
            </p>
          </div>

          <p className="text-sm">
            Salida:{" "}
            <span className="font-semibold">
              {formatDate(dep)} — {formatTime(dep)}
            </span>
          </p>

          <p className="text-sm mt-1">
            Llegada:{" "}
            <span className="font-semibold">
              {formatDate(arr)} — {formatTime(arr)}
            </span>
          </p>

          <p className="text-sm mt-1">
            Cabina: <span className="font-semibold">{cabin}</span>
          </p>

          <p className="text-sm">
            Método de pago: <span className="font-semibold">{paymentMethod}</span>
          </p>

          {/* ⭐ Precio total con fallback */}
          <p className="font-bold text-blue-600 text-xl mt-2">
            ${totalAmount ?? 0}
          </p>
        </div>

        {/* PASAJEROS */}
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Users size={18} /> Pasajeros
          </h3>

          <div className="mt-3 space-y-3">
            {passengers.map((p, i) => (
              <div
                key={i}
                className="border p-3 rounded-lg bg-white"
              >
                <p className="font-medium">{p.fullName}</p>
                <p className="text-sm text-slate-600">{p.email}</p>
                <p className="text-sm text-slate-600">{p.document}</p>

                <p className="mt-2 text-sm text-slate-700">
                  Asiento:{" "}
                  <span className="font-semibold">{seats[i]}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
