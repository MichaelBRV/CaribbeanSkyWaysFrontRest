import { useLocation, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

// Badge reutilizable
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
    case "Completado":
      classes = "border-blue-400 text-blue-500";
      dot = "bg-blue-500";
      break;
    default:
      classes = "border-slate-400 text-slate-600";
      dot = "bg-slate-400";
      break;
  }

  return (
    <span className={`${base} ${classes}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status?.toUpperCase()}
    </span>
  );
}

// Tipo de asiento
function getSeatType(s) {
  if (!s) return "N/A";
  const letter = s.slice(-1);
  if (letter === "A" || letter === "F") return "Ventana";
  if (letter === "C" || letter === "D") return "Pasillo";
  return "Medio";
}

export default function MyFlightDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const reservation = state?.reservation;

  if (!reservation) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">No hay datos</h1>
        <p className="text-slate-600 mt-2">
          Regresa al panel para elegir una reserva válida.
        </p>
      </div>
    );
  }

  const {
    pnr,
    status,
    flight,
    passengers = [],
    seats = [],
    cabin,
    paymentMethod,
    totalAmount
  } = reservation;

  const dep = new Date(flight.departure);
  const arr = new Date(flight.arrival);

  const formatDate = (d) => d.toLocaleDateString("es-EC", { timeZone: "UTC" });
  const formatTime = (d) =>
    d.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  // ====================================================================================
  // ⭐ CORRECCIÓN: calcular precio si no vino totalAmount
  // ====================================================================================
  const calculatedPrice =
    totalAmount ??
    (flight.price * passengers.length +
      (cabin === "Premium" ? 35 * passengers.length : 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Reserva <span className="text-blue-600">{pnr}</span>
        </h1>
        <StatusBadge status={status} />
      </div>

      {/* TARJETA PRINCIPAL */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">

        {/* Ruta */}
        <p className="text-lg font-semibold text-blue-700">
          {flight.origin} → {flight.destination}
        </p>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-slate-500 text-sm">Salida</p>
            <p className="font-medium">
              {formatDate(dep)} — {formatTime(dep)}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">Llegada</p>
            <p className="font-medium">
              {formatDate(arr)} — {formatTime(arr)}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Duración: <span className="font-semibold">{flight.duration}</span>
        </p>

        {/* Cabina + Pago */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Cabina</p>
            <p className="font-semibold">{cabin}</p>
          </div>

          <div>
            <p className="text-slate-500">Método de pago</p>
            <p className="font-semibold capitalize">{paymentMethod}</p>
          </div>
        </div>

        {/* ⭐ PRECIO TOTAL (CORREGIDO) */}
        <p className="text-2xl font-bold text-blue-600">
          ${calculatedPrice}
        </p>

        {/* PASAJEROS + ASIENTOS */}
        <div className="pt-6 border-t border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} /> Pasajeros
          </h2>

          <div className="mt-4 space-y-4">
            {passengers.map((p, idx) => {
              const s = seats[idx];
              return (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-lg border text-sm"
                >
                  <p className="font-semibold text-slate-800">{p.fullName}</p>
                  <p className="text-slate-600">{p.email}</p>
                  <p className="text-slate-600 mb-2">{p.document}</p>

                  <p className="text-slate-500">
                    Asiento:{" "}
                    <span className="font-semibold text-slate-800">
                      {s} ({getSeatType(s)})
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTÓN */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Volver al panel
        </button>
      </div>
    </div>
  );
}
