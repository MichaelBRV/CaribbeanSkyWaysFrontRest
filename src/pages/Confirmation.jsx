import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { saveReservation } from "../utils/reservationStorage";
import { saveReservedSeat } from "../utils/seatStorage";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const flights = state?.flights;
  const passengers = state?.passengers;
  const seatHolds = state?.seatHolds;
  const cabin = state?.cabin;
  const total = state?.total;

  const confirmation = state?.confirmationData; // 🔥 Respuesta real del backend
  const pnr = confirmation?.PNR;
  const reservas = confirmation?.Reservas;

  if (!confirmation || !pnr || !flights || !reservas) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ No hay datos suficientes</h1>
      </div>
    );
  }

  // 🔥 Guardar asientos como ocupados en localStorage
  useEffect(() => {
    reservas.forEach((r) => {
      saveReservedSeat(r.FlightId, r.SeatNumber);
    });
  }, []);

  // 🔥 Guardar reserva completa
  const handleFinish = () => {
    saveReservation({
      pnr,
      flights,
      passengers,
      seatHolds,
      cabin,
      status: "CONFIRMADO",
      totalPaid: total,
      reservas,
      createdAt: new Date().toISOString(),
      paymentMethod: "transferencia",
    });

    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 space-y-8">
      {/* ICONO */}
      <div className="flex justify-center">
        <CheckCircle size={90} className="text-green-500" />
      </div>

      {/* TITULO */}
      <h1 className="text-3xl font-bold text-center text-slate-900">
        ¡Reserva completada con éxito!
      </h1>

      {/* PNR */}
      <div className="bg-white p-6 rounded-xl border shadow text-center">
        <p className="text-sm text-slate-500">Código PNR</p>
        <p className="text-3xl font-bold text-blue-600 tracking-widest">
          {pnr}
        </p>
      </div>

      {/* DETALLES DE PAGO */}
      <div className="bg-white p-6 rounded-xl border shadow space-y-2">
        <p className="text-slate-600 text-sm">
          Cabina: <span className="font-semibold">{cabin}</span>
        </p>
        <p className="text-slate-600 text-sm">
          Método de pago: <span className="font-semibold">Transferencia</span>
        </p>

        <p className="text-xl font-bold text-slate-900">
          Total pagado: ${total}
        </p>
      </div>

      {/* DETALLES DE RESERVA */}
      <div className="bg-white p-6 rounded-xl border shadow space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Detalle de asientos</h2>

        {reservas.map((r, idx) => (
          <div
            key={idx}
            className="p-3 border rounded-lg bg-slate-50 shadow-sm flex justify-between"
          >
            <div>
              <p className="text-slate-700 font-semibold">
                Vuelo: {r.FlightId}
              </p>
              <p className="text-slate-600 text-sm">
                Pasajero: {r.PassengerName}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-600 text-sm">Asiento:</p>
              <p className="text-lg font-bold text-blue-600">{r.SeatNumber}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOTÓN */}
      <div className="flex justify-center">
        <button
          onClick={handleFinish}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          Ver mis viajes
        </button>
      </div>
    </div>
  );
}
