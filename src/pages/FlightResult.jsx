// src/pages/FlightResult.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFlights } from "../services/flightsService";

export default function FlightResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = location.state?.searchParams;

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchParams) return;

    const load = async () => {
      try {
        setError("");
        const result = await searchFlights(searchParams);
        setFlights(result);
      } catch (e) {
        console.error(e);
        setError("No pudimos cargar los vuelos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams]);

  if (!searchParams) return null;

  // ==============================
  // 1️⃣ FIX → fecha segura ISO
  // ==============================
  function formatSafeISO(dateStr) {
    if (!dateStr) return "";

    // Si viene "2025-12-11T00:00:00"
    const date = new Date(dateStr);

    return date.toLocaleDateString("es-EC", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  // ========================================
  // 2️⃣ FIX → Parse directo sin reconstruir
  // ========================================
  function safeParse(dateStr) {
    return new Date(dateStr);
  }

  function formatDate(date) {
    return date.toLocaleDateString("es-EC", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <p className="text-xs font-semibold text-blue-600 uppercase">
        Resultados de tu búsqueda
      </p>

      <h1 className="text-2xl font-bold mt-1">
        {searchParams.origin} → {searchParams.destination}
      </h1>

      <p className="text-slate-600 text-sm mb-6">
        Fecha: {formatSafeISO(searchParams.departureDate)}
      </p>

      {loading && (
        <div className="p-5 bg-white border rounded-xl text-center text-slate-500">
          Buscando vuelos...
        </div>
      )}

      {!loading && error && (
        <div className="p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && flights.length === 0 && (
        <div className="p-5 bg-white border rounded-xl text-center text-slate-500">
          No hay vuelos para esta ruta.
        </div>
      )}

      <div className="space-y-4">
        {flights.map((f) => {
          const dep = safeParse(f.departure);
          const arr = safeParse(f.arrival);

          return (
            <div
              key={f.id}
              className="bg-white border p-5 rounded-xl shadow-sm flex justify-between"
            >
              {/* INFO DEL VUELO */}
              <div>
                <p className="text-blue-600 text-xs font-semibold">
                  {f.airline}
                </p>

                <p className="text-lg font-semibold">
                  {f.origin} → {f.destination}
                </p>

                <div className="flex items-center gap-6 mt-2">
                  <div>
                    <p className="font-semibold">{formatTime(dep)}</p>
                    <p className="text-xs">{formatDate(dep)}</p>
                  </div>

                  <span className="text-xs">→</span>

                  <div>
                    <p className="font-semibold">{formatTime(arr)}</p>
                    <p className="text-xs">{formatDate(arr)}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Duración: {f.duration}
                </p>
              </div>

              {/* PRECIO + BOTÓN */}
              <div className="flex flex-col items-end">
                <p className="text-2xl font-bold text-blue-600">
                  ${f.price.toFixed(2)}
                </p>

                <button
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() =>
                    navigate(`/flight/${f.id}`, {
                      state: {
                        flight: f,
                        passengers: searchParams.passengers || 1,
                      },
                    })
                  }
                >
                  Seleccionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
