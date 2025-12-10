import { ArrowRight } from "lucide-react";

export default function FlightCard({ flight, onSelect }) {
  const dep = new Date(flight.departure);
  const arr = new Date(flight.arrival);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      {/* INFO PRINCIPAL */}
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-600 mb-1">
          {flight.airline}
        </p>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {dep.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xs text-slate-500">
              {flight.origin}
            </p>
          </div>

          <ArrowRight className="text-slate-400" size={22} />

          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {arr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xs text-slate-500">
              {flight.destination}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-1">
          Duración: {flight.duration}
        </p>

        <p className="text-xs text-slate-500">
          Asientos disponibles: {flight.seatsAvailable}
        </p>
      </div>

      {/* PRECIO + BOTÓN */}
      <div className="text-right w-full sm:w-40">
        <p className="text-2xl font-bold text-blue-600">${flight.price}</p>

        <button
          onClick={() => onSelect(flight)}
          className="mt-2 w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
}
