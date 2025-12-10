// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Trash2, Users } from "lucide-react";
import {
  getReservations,
  cancelReservation,
} from "../utils/reservationStorage";

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border";

  let classes = "";
  let dot = "";

  switch (status) {
    case "Confirmado":
      classes = "border-green-500 text-green-600";
      dot = "bg-green-500";
      break;
    case "Cancelado":
      classes = "border-red-400 text-red-500";
      dot = "bg-red-500";
      break;
    default:
      classes = "border-slate-400 text-slate-600";
      dot = "bg-slate-400";
      break;
  }

  return (
    <span className={`${base} ${classes}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status.toUpperCase()}
    </span>
  );
}

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const handleCancel = (pnr, status) => {
    if (status !== "Confirmado") return;

    if (confirm("¿Seguro que deseas cancelar esta reserva?")) {
      cancelReservation(pnr);
      setReservations(getReservations());
    }
  };

  const handleView = (res) => {
    navigate(`/my-flight`, {
      state: { reservation: res },
    });
  };

  const formatDate = (d) =>
    d.toLocaleDateString("es-EC", { timeZone: "UTC" });

  const formatTime = (d) =>
    d.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Mis viajes</h1>

      {reservations.length === 0 && (
        <p className="text-slate-600">Aún no tienes viajes reservados.</p>
      )}

      <div className="space-y-4">
        {reservations.map((res) => {
          const dep = new Date(res.flight.departure);
          const isCancelable = res.status === "Confirmado";

          // ================================
          // ⭐ Calcular precio total (FALLBACK)
          // ================================
          const passengers = res.passengers || [];
          const seats = res.seats || [];

          const computedTotal =
            res.totalAmount ??
            (res.flight.price * passengers.length +
              (res.cabin === "Premium" ? 35 * passengers.length : 0));

          const cardBase =
            "bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center";
          const cardDim =
            res.status === "Cancelado" ? "opacity-60 bg-slate-50" : "";

          return (
            <div
              key={res.pnr}
              className={`${cardBase} ${cardDim}`}
            >
              {/* INFORMACIÓN PRINCIPAL */}
              <div>
                <p className="text-xs text-slate-500 mb-1">PNR</p>
                <p className="font-bold text-blue-600 text-lg">{res.pnr}</p>

                {/* Ruta */}
                <div className="flex items-center gap-2 mt-2">
                  <Plane size={18} className="text-slate-400" />
                  <p className="font-medium text-slate-800">
                    {res.flight.origin} → {res.flight.destination}
                  </p>
                </div>

                <p className="text-sm text-slate-600 mt-1">
                  {formatDate(dep)} — {formatTime(dep)}
                </p>

                {/* Estado */}
                <div className="mt-2">
                  <StatusBadge status={res.status} />
                </div>

                {/* Detalles grupo */}
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1">
                    <Users size={14} className="text-slate-500" />
                    Pasajeros:{" "}
                    <span className="font-semibold text-slate-800">
                      {passengers.length}
                    </span>
                  </p>

                  <p>
                    Asientos:{" "}
                    <span className="font-semibold text-slate-800">
                      {seats.join(", ")}
                    </span>
                  </p>

                  <p>
                    Cabina:{" "}
                    <span className="font-semibold text-slate-800">
                      {res.cabin}
                    </span>
                  </p>

                  <p>
                    Método de pago:{" "}
                    <span className="font-semibold text-slate-800">
                      {res.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="flex flex-col gap-2 items-end">
                <p className="text-sm text-slate-500">
                  Precio total:{" "}
                  <span className="font-semibold text-slate-800">
                    ${computedTotal}
                  </span>
                </p>

                <button
                  onClick={() => handleView(res)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Ver detalles
                </button>

                <button
                  onClick={() => handleCancel(res.pnr, res.status)}
                  disabled={!isCancelable}
                  className={`px-4 py-2 text-sm rounded-lg flex items-center gap-1
                    ${
                      isCancelable
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  <Trash2 size={16} />
                  Cancelar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
