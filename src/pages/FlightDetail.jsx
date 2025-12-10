import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useModalAuth } from "../hooks/useModalAuth";
import { ArrowRight } from "lucide-react";

export default function FlightDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const flight = state?.flight;
  const passengers = state?.passengers || 1;

  const { user } = useAuth();
  const { openAuthModal } = useModalAuth();

  if (!flight) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-slate-900">No se encontró el vuelo</h1>
        <p className="text-slate-600 mt-2">Busca un vuelo antes de continuar.</p>
      </div>
    );
  }

  // ================================
  // 🔥 Parse seguro sin UTC
  // ================================
  function safeParse(dateStr) {
    const d = new Date(dateStr);
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    );
  }

  const dep = safeParse(flight.departure);
  const arr = safeParse(flight.arrival);

  const formatDate = (d) =>
    d.toLocaleDateString("es-EC", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const formatTime = (d) =>
    d.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const seatsAvailable = flight.seats;
  const insufficientSeats = passengers > seatsAvailable;

  const handleContinue = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (insufficientSeats) return;

    navigate("/checkout", {
      state: {
        flight,
        passengers,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Título */}
      <h1 className="text-4xl font-bold text-slate-900">Detalles del vuelo</h1>

      <p className="text-slate-600">
        Revisa la información antes de continuar con tu compra.
      </p>

      {/* Tarjeta */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 space-y-6">
        <p className="text-lg font-semibold text-blue-700">Caribbean Skyways</p>

        <div className="flex items-center gap-6">
          {/* Salida */}
          <div>
            <p className="text-4xl font-bold">{formatTime(dep)}</p>
            <p className="text-slate-600 text-sm">{flight.origin}</p>
          </div>

          <ArrowRight size={40} className="text-blue-600" />

          {/* Llegada */}
          <div>
            <p className="text-4xl font-bold">{formatTime(arr)}</p>
            <p className="text-slate-600 text-sm">{flight.destination}</p>
          </div>

          {/* Precio */}
          <div className="ml-auto text-right">
            <p className="text-slate-500 text-sm font-medium">Precio</p>
            <p className="text-3xl font-bold text-blue-600">
              ${flight.price.toFixed(2)}
            </p>
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Extra info */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-slate-500">Duración</p>
            <p className="font-semibold">{flight.duration}</p>
          </div>

          <div>
            <p className="text-slate-500">Asientos disponibles</p>
            <p className="font-semibold">{seatsAvailable} asientos</p>

            {seatsAvailable <= 5 && seatsAvailable > 0 && (
              <p className="text-xs text-orange-500 font-semibold mt-1">
                ¡Quedan pocos asientos!
              </p>
            )}

            {insufficientSeats && (
              <p className="text-xs text-red-500 font-semibold mt-1">
                Solo quedan {seatsAvailable} asientos disponibles.
              </p>
            )}
          </div>

          <div>
            <p className="text-slate-500">Fecha de salida</p>
            <p className="font-semibold">{formatDate(dep)}</p>
          </div>

          <div>
            <p className="text-slate-500">Fecha de llegada</p>
            <p className="font-semibold">{formatDate(arr)}</p>
          </div>

          <div>
            <p className="text-slate-500">Pasajeros</p>
            <p className="font-semibold">{passengers}</p>
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={insufficientSeats}
          className={`px-14 py-4 text-white font-semibold rounded-xl text-lg shadow-md transition
            ${
              insufficientSeats
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Continuar a los datos del pasajero
        </button>
      </div>
    </div>
  );
}
