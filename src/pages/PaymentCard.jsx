import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { savePayment } from "../utils/paymentStorage";
import { saveReservedSeat } from "../utils/seatStorage";

export default function PaymentCard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ==============================
  // 🔥 DATOS DESDE SeatSelection
  // ==============================
  const flight = state?.flight;
  const passengers = state?.passengers;   // array
  const paymentMethod = state?.paymentMethod;
  const cabin = state?.cabin;
  const seats = state?.seats;             // array

  // PROTECCIÓN
  useEffect(() => {
    if (!flight || !passengers || !paymentMethod || !cabin || !seats) {
      navigate("/");
    }
  }, []);

  // ==========================
  // 🔥 Calcular precio total
  // ==========================
  const basePrice = flight.price;
  const extra = cabin === "Premium" ? 35 : 0;
  const totalAmount = passengers.length * (basePrice + extra);

  // ==========================
  // FORMULARIO TARJETA
  // ==========================
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) value = value.substring(0, 2) + "/" + value.substring(2);
    setExpiry(value);
  };

  // ==========================
  // 🔥 PROCESAR PAGO
  // ==========================
  const handlePayment = () => {
    if (!cardNumber || !name || !expiry || !cvv) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // 1️⃣ Guardar pago como pendiente
      savePayment({
        pnr: "PENDIENTE",
        amount: totalAmount,
        method: "Tarjeta",
        passengers: passengers.length,
        createdAt: new Date().toISOString(),
      });

      // 2️⃣ Guardar TODOS los asientos ocupados
      seats.forEach((seatId) => saveReservedSeat(flight.id, seatId));

      // 3️⃣ Enviar a Confirmation
      navigate("/confirmation", {
        state: {
          flight,
          passengers,
          paymentMethod,
          cabin,
          seats,
          totalAmount,
        },
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg bg-[#1A1A1A] p-8 rounded-2xl shadow-xl border border-gray-700">

        <h1 className="text-3xl font-bold text-white text-center">
          Pago con Tarjeta
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Tu conexión es segura <Lock size={18} className="inline-block ml-1" />
        </p>

        {/* PREVIEW DE TARJETA */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 shadow-lg border border-gray-700">
          <p className="text-gray-300 text-sm">Número de tarjeta</p>
          <p className="text-white text-xl font-mono tracking-wider mt-1">
            {cardNumber || "•••• •••• •••• ••••"}
          </p>

          <div className="flex justify-between mt-6">
            <div>
              <p className="text-gray-300 text-sm">Expira</p>
              <p className="text-white font-semibold">{expiry || "MM/YY"}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">CVV</p>
              <p className="text-white font-semibold">{cvv ? "•••" : "•••"}</p>
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={handleCardNumber}
            maxLength={19}
            className="w-full p-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />

          <input
            type="text"
            placeholder="Nombre en la tarjeta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiry}
              maxLength={5}
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />

            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))
              }
              maxLength={3}
              className="w-full p-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* BOTÓN */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full mt-8 p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-800 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Procesando...
            </>
          ) : (
            `Pagar $${totalAmount}`
          )}
        </button>
      </div>
    </div>
  );
}
