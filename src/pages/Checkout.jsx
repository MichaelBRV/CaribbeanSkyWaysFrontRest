import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useModalAuth } from "../hooks/useModalAuth";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { openAuthModal } = useModalAuth();

  const flightIda = state?.flightIda || state?.flight;
  const flightVuelta = state?.flightVuelta || null;

  const passengersCount = state?.passengers || 1;

  if (!flightIda) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">No se encontró información del vuelo</h1>
      </div>
    );
  }

  if (!user) {
    openAuthModal();
    return null;
  }

  const depIda = new Date(flightIda.departure);
  const depVuelta = flightVuelta ? new Date(flightVuelta.departure) : null;

  // PASAJEROS
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengersCount }).map(() => ({
      fullName: "",
      email: "",
      document: "",
    }))
  );

  const [cabin, setCabin] = useState("Economy");

  // 🔥 Pago fijo
  const [paymentMethod] = useState("transferencia");

  const [errors, setErrors] = useState({});

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // VALIDACIÓN
  const validate = () => {
    let newErrors = {};

    passengers.forEach((p, i) => {
      if (!p.fullName.trim()) newErrors[`fullName_${i}`] = "Nombre requerido";
      if (!p.email.includes("@")) newErrors[`email_${i}`] = "Correo inválido";
      if (!p.document.trim()) newErrors[`document_${i}`] = "Documento requerido";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    navigate("/select-seat", {
      state: {
        flights: [flightIda, ...(flightVuelta ? [flightVuelta] : [])],
        passengers,
        passengerCount: passengersCount,
        cabin,
        paymentMethod, // 🔥 Siempre "transferencia"
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-slate-900">Confirmar datos</h1>

      {/* VUELO IDA */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <p className="text-lg font-semibold text-blue-700">Caribbean Skyways</p>

        <div className="flex justify-between">
          <div>
            <p className="text-xl font-bold">
              {flightIda.origin} → {flightIda.destination}
            </p>
            <p className="text-sm text-slate-600">
              {depIda.toLocaleDateString()} —{" "}
              {depIda.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <p className="text-3xl font-bold text-blue-600">${flightIda.price}</p>
        </div>

        <p className="text-sm mt-2">Pasajeros: {passengersCount}</p>
      </div>

      {/* VUELO VUELTA */}
      {flightVuelta && (
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <p className="text-lg font-semibold text-blue-700">Vuelo de retorno</p>

          <div className="flex justify-between">
            <div>
              <p className="text-xl font-bold">
                {flightVuelta.origin} → {flightVuelta.destination}
              </p>
              <p className="text-sm text-slate-600">
                {depVuelta.toLocaleDateString()} —{" "}
                {depVuelta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <p className="text-3xl font-bold text-blue-600">${flightVuelta.price}</p>
          </div>
        </div>
      )}

      {/* FORMULARIOS DINÁMICOS DE PASAJEROS */}
      {passengers.map((p, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-md border space-y-3">
          <h2 className="text-lg font-semibold">Pasajero {index + 1}</h2>

          <input
            type="text"
            placeholder="Nombre completo"
            value={p.fullName}
            onChange={(e) => handlePassengerChange(index, "fullName", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          {errors[`fullName_${index}`] && (
            <p className="text-red-500 text-sm">{errors[`fullName_${index}`]}</p>
          )}

          <input
            type="email"
            placeholder="Correo"
            value={p.email}
            onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          {errors[`email_${index}`] && (
            <p className="text-red-500 text-sm">{errors[`email_${index}`]}</p>
          )}

          <input
            type="text"
            placeholder="Documento"
            value={p.document}
            onChange={(e) => handlePassengerChange(index, "document", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          {errors[`document_${index}`] && (
            <p className="text-red-500 text-sm">{errors[`document_${index}`]}</p>
          )}
        </div>
      ))}

      {/* CABINA */}
      <div className="bg-white p-6 rounded-xl shadow-md border space-y-3">
        <h2 className="text-lg font-semibold">Cabina</h2>

        <select
          value={cabin}
          onChange={(e) => setCabin(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="Economy">Economy</option>
          <option value="Premium">Premium (+ $35)</option>
        </select>
      </div>

      {/* 🔥 MÉTODO DE PAGO FIJO */}
      <div className="bg-white p-6 rounded-xl shadow-md border space-y-3">
        <h2 className="text-lg font-semibold">Método de pago</h2>

        <p className="text-slate-700">
          Este vuelo solo permite: <strong>Transferencia bancaria</strong>
        </p>

        <input type="hidden" value="transferencia" />
      </div>

      {/* BOTÓN */}
      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          className="px-14 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow-md"
        >
          Continuar → Selección de asiento
        </button>
      </div>
    </div>
  );
}
