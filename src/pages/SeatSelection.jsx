// src/pages/SeatSelection.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { generateSeatMap } from "../data/seatMap";
import { createSeatHold } from "../services/seatHoldService";
import { useAuth } from "../hooks/useAuth";
import { api, API_URL } from "../services/api";

export default function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const flights = state?.flights;
  const passengers = state?.passengers;
  const selectedCabin = state?.cabin;
  const passengerCount = state?.passengerCount;

  if (!flights || flights.length === 0 || !passengers) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold">No hay datos suficientes</h1>
      </div>
    );
  }

  // ============================================================
  // CONTROL PRINCIPAL
  // ============================================================
  const [flightIndex, setFlightIndex] = useState(0);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);

  const currentFlight = flights[flightIndex];

  // MAPA VISUAL — labels (ej: "12E")
  const allSeats = useMemo(() => generateSeatMap(), []);

  const seatsToShow =
    selectedCabin === "Premium"
      ? allSeats.filter((s) => s.row <= 5)
      : allSeats.filter((s) => s.row > 5);

  const minRow = Math.min(...seatsToShow.map((s) => s.row));
  const maxRow = Math.max(...seatsToShow.map((s) => s.row));

  // selectedSeats[v][p] = label ("21E")
  const [selectedSeats, setSelectedSeats] = useState(
    flights.map(() => Array(passengerCount).fill(""))
  );

  // ============================================================
  // MAPA DB seatNumber → { seatId, available }
  // ============================================================
  const [seatDbMap, setSeatDbMap] = useState({});

  useEffect(() => {
    async function loadSeats() {
      try {
        const url = `seats/by-flight/${currentFlight.id}`;

        console.log("🌐 URL FINAL →", `${API_URL}/${url}`);

        const data = await api.get(url); // <-- CORRECTO (NO duplicamos /api/v1)

        console.log("🎉 Asientos desde API:", data);

        const map = {};
        data.forEach((s) => {
          map[s.seatNumber] = {
            seatId: s.seatId,
            available: s.available,
          };
        });

        console.log("🗺️ seatDbMap construido:", map);
        setSeatDbMap(map);
      } catch (err) {
        console.error("❌ Error cargando asientos:", err);
      }
    }

    loadSeats();
  }, [flightIndex, currentFlight.id]);

  // ============================================================
  // SELECCIONAR ASIENTO
  // ============================================================
  const handleSelectSeat = (seatLabel) => {
    const updated = [...selectedSeats];
    updated[flightIndex][currentPassengerIndex] = seatLabel;
    setSelectedSeats(updated);
  };

  const currentPassenger = passengers[currentPassengerIndex];

  // ============================================================
  // SIGUIENTE / FINALIZAR
  // ============================================================
  const handleNext = async () => {
    const seatLabel = selectedSeats[flightIndex][currentPassengerIndex];

    if (!seatLabel) {
      alert("Debes seleccionar un asiento.");
      return;
    }

    const seatInfo = seatDbMap[seatLabel];
    if (!seatInfo) {
      alert(`El asiento ${seatLabel} no existe en la BD.`);
      return;
    }

    if (seatInfo.available === false) {
      alert("Ese asiento está ocupado. Elige otro.");
      return;
    }

    // Siguiente pasajero
    if (currentPassengerIndex < passengerCount - 1) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
      return;
    }

    // Siguiente vuelo
    if (flightIndex < flights.length - 1) {
      setFlightIndex(flightIndex + 1);
      setCurrentPassengerIndex(0);
      return;
    }

    // ============================================================
    // FINAL → CREAR SEAT HOLDS
    // ============================================================
    try {
      const createdHolds = [];

      for (let v = 0; v < flights.length; v++) {
        for (let p = 0; p < passengers.length; p++) {
          const label = selectedSeats[v][p];
          const info = seatDbMap[label];

          if (!info) continue;

          const seatId = info.seatId;

          const holdId = await createSeatHold({
            userId: user.userId,
            flightId: flights[v].id,
            seatId: seatId,
          });

          createdHolds.push({
            flightId: flights[v].id,
            seat: label,
            seatId,
            holdId,
            passenger: passengers[p].fullName,
          });
        }
      }

      navigate("/payment-transfer", {
        state: {
          flights,
          passengers,
          selectedSeats,
          cabin: selectedCabin,
          paymentMethod: "transferencia",
          seatHolds: createdHolds,
        },
      });
    } catch (err) {
      console.error("❌ Error creando SeatHold:", err);
      alert("Error creando bloqueo temporal del asiento.");
    }
  };

  // ============================================================
  // ESTILOS DE ASIENTOS
  // ============================================================
  const getSeatClasses = (seat, isTaken, isSelected, usedByOther) => {
    let base =
      "w-11 h-11 flex items-center justify-center font-semibold rounded-lg border transition";

    if (isTaken || usedByOther)
      return base + " bg-red-500 text-white opacity-60 cursor-not-allowed";

    if (isSelected)
      return base + " bg-blue-600 text-white scale-105 shadow-md";

    return base + " bg-slate-100 hover:bg-blue-100 cursor-pointer";
  };

  const lettersLeft = ["A", "B", "C"];
  const lettersRight = ["D", "E", "F"];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold">
        Seleccionar asiento para:{" "}
        <span className="text-blue-600">{currentPassenger.fullName}</span>
      </h1>

      <p className="text-slate-600 text-sm">
        Vuelo {flightIndex + 1} de {flights.length} — Pasajero{" "}
        {currentPassengerIndex + 1} de {passengerCount}
      </p>

      <div className="bg-slate-100 rounded-[999px] p-4 shadow-inner mt-4">
        {Array.from({ length: maxRow - minRow + 1 }).map((_, idx) => {
          const row = minRow + idx;
          const rowSeats = seatsToShow.filter((s) => s.row === row);

          const left = rowSeats.filter((s) => lettersLeft.includes(s.column));
          const right = rowSeats.filter((s) => lettersRight.includes(s.column));

          return (
            <div key={row} className="flex justify-center gap-3 mb-1">
              <div className="w-6 text-xs text-slate-600">{row}</div>

              {/* IZQUIERDA */}
              <div className="flex gap-2">
                {left.map((seat) => {
                  const seatInfo = seatDbMap[seat.id];
                  const isTaken = seatInfo && seatInfo.available === false;

                  const isSelected =
                    selectedSeats[flightIndex][currentPassengerIndex] === seat.id;

                  const usedByOther =
                    selectedSeats[flightIndex].includes(seat.id) && !isSelected;

                  return (
                    <button
                      key={seat.id}
                      disabled={isTaken || usedByOther}
                      onClick={() =>
                        !isTaken && !usedByOther && handleSelectSeat(seat.id)
                      }
                      className={getSeatClasses(
                        seat,
                        isTaken,
                        isSelected,
                        usedByOther
                      )}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>

              <div className="w-6" />

              {/* DERECHA */}
              <div className="flex gap-2">
                {right.map((seat) => {
                  const seatInfo = seatDbMap[seat.id];
                  const isTaken = seatInfo && seatInfo.available === false;

                  const isSelected =
                    selectedSeats[flightIndex][currentPassengerIndex] === seat.id;

                  const usedByOther =
                    selectedSeats[flightIndex].includes(seat.id) && !isSelected;

                  return (
                    <button
                      key={seat.id}
                      disabled={isTaken || usedByOther}
                      onClick={() =>
                        !isTaken && !usedByOther && handleSelectSeat(seat.id)
                      }
                      className={getSeatClasses(
                        seat,
                        isTaken,
                        isSelected,
                        usedByOther
                      )}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-md"
        >
          {flightIndex < flights.length - 1
            ? "Siguiente vuelo"
            : currentPassengerIndex < passengerCount - 1
            ? "Siguiente pasajero"
            : "Finalizar selección"}
        </button>
      </div>
    </div>
  );
}
