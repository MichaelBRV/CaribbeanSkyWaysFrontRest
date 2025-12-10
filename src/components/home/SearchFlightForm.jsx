// src/components/home/SearchFlightForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITIES = [
  "San Juan (SJU)",
  "Miami (MIA)",
  "Quito (UIO)",
  "Guayaquil (GYE)",
  "Cuenca (CUE)",
  "New York (JFK)",
];

// Convierte "Quito (UIO)" → "Quito"
function extractCity(value) {
  if (!value) return "";
  return value.split(" (")[0];
}

export default function SearchFlightForm() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    origin: CITIES[0],
    destination: CITIES[1],
    departureDate: today,
    returnDate: "",
    roundTrip: false,
    passengers: 1,
    cabin: "Economy",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.origin) newErrors.origin = "El origen es obligatorio.";
    if (!form.destination) newErrors.destination = "El destino es obligatorio.";

    if (form.origin === form.destination)
      newErrors.destination = "El origen y destino no pueden ser iguales.";

    if (!form.departureDate)
      newErrors.departureDate = "La fecha de salida es obligatoria.";

    if (form.roundTrip) {
      if (!form.returnDate) {
        newErrors.returnDate = "La fecha de regreso es obligatoria.";
      } else if (form.returnDate < form.departureDate) {
        newErrors.returnDate = "La fecha de regreso no puede ser antes de la salida.";
      }
    }

    if (!form.passengers || form.passengers < 1) {
      newErrors.passengers = "Debe haber al menos 1 pasajero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 🔥 Convertir fecha a formato ISO requerido por backend
    const isoDeparture = form.departureDate + "T00:00:00";

    // Lo que enviamos al backend
    const searchParams = {
      origin: extractCity(form.origin),        // "Quito"
      destination: extractCity(form.destination), // "Miami"
      departureDate: isoDeparture,             // "2025-12-11T00:00:00"

      // Extras
      returnDate: form.returnDate,
      roundTrip: form.roundTrip,
      passengers: form.passengers,
      cabin: form.cabin,
    };

    console.log("🔵 searchParams enviados:", searchParams);

    navigate("/results", { state: { searchParams } });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto -mt-12 relative z-10">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
        Encuentra tu próximo vuelo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        
        {/* ORIGEN / DESTINO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Origen
            </label>
            <select
              name="origin"
              value={form.origin}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destino
            </label>
            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
          </div>
        </div>

        {/* FECHAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de ida
            </label>
            <input
              type="date"
              name="departureDate"
              value={form.departureDate}
              min={today}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            {errors.departureDate && <p className="text-xs text-red-500 mt-1">{errors.departureDate}</p>}
          </div>

          {form.roundTrip && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fecha de regreso
              </label>
              <input
                type="date"
                name="returnDate"
                value={form.returnDate}
                min={form.departureDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {errors.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate}</p>}
            </div>
          )}
        </div>

        {/* PASAJEROS / CABINA / ROUNDTRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pasajeros
            </label>
            <input
              type="number"
              name="passengers"
              min={1}
              value={form.passengers}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            {errors.passengers && <p className="text-xs text-red-500 mt-1">{errors.passengers}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cabina
            </label>
            <select
              name="cabin"
              value={form.cabin}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="Economy">Económica</option>
              <option value="Business">Business</option>
              <option value="First">Primera</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="roundTrip"
              type="checkbox"
              name="roundTrip"
              checked={form.roundTrip}
              onChange={handleChange}
              className="rounded border-slate-300 text-blue-600"
            />
            <label htmlFor="roundTrip" className="text-xs font-semibold text-slate-700">
              Ida y vuelta
            </label>
          </div>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full mt-2 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Buscar vuelos
        </button>
      </form>
    </div>
  );
}
