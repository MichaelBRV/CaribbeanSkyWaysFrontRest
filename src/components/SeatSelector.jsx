import { useEffect, useState } from "react";
import { generateSeatMap } from "../utils/seatMap";
import { getReservedSeats } from "../utils/seatStorage";

export default function SeatSelector({ flight, onSelect }) {
  const [seatMap, setSeatMap] = useState([]);
  const [occupied, setOccupied] = useState([]);
  const [selected, setSelected] = useState(null);

  // Cargar mapa + ocupados
  useEffect(() => {
    setSeatMap(generateSeatMap());
    setOccupied(getReservedSeats(flight.id));
  }, [flight.id]);

  const handleSelect = (seat) => {
    if (occupied.includes(seat.id)) return;
    setSelected(seat);
    onSelect(seat);
  };

  // Colores por cabina
  const getCabinColor = (cabin) =>
    cabin === "Premium" ? "bg-yellow-200 border-yellow-500" : "bg-blue-200 border-blue-500";

  // Colores de tipo asiento
  const getTypeColor = (type) => {
    switch (type) {
      case "ventana":
        return "text-blue-800";
      case "pasillo":
        return "text-green-800";
      case "medio":
        return "text-gray-800";
      default:
        return "text-slate-700";
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">

      <h2 className="text-lg font-semibold text-slate-900">Selecciona tu asiento</h2>

      {/* LEYENDA */}
      <div className="flex gap-6 items-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded" />
          <span>Economy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-300 border border-yellow-500 rounded" />
          <span>Premium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-slate-400 border border-slate-600 rounded" />
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-400 border border-green-700 rounded" />
          <span>Seleccionado</span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex flex-col gap-1">

          {/** Agrupamos por filas **/}
          {Array.from(new Set(seatMap.map((s) => s.row))).map((row) => {
            const seatsInRow = seatMap.filter((s) => s.row === row);

            const left = seatsInRow.filter((s) => ["A", "B", "C"].includes(s.column));
            const right = seatsInRow.filter((s) => ["D", "E", "F"].includes(s.column));

            const isPremium = seatsInRow[0].cabin === "Premium";

            return (
              <div key={row} className="flex items-center justify-center gap-8">
                
                {/* IZQUIERDA */}
                <div className="flex gap-1">
                  {left.map((seat) => {
                    const isOccupied = occupied.includes(seat.id);
                    const isSelected = selected?.id === seat.id;

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSelect(seat)}
                        disabled={isOccupied}
                        className={`
                          w-10 h-10 flex items-center justify-center rounded-md text-xs font-semibold border
                          ${isOccupied ? "bg-slate-400 border-slate-600 cursor-not-allowed" : ""}
                          ${isSelected ? "bg-green-400 border-green-700" : ""}
                          ${!isOccupied && !isSelected ? getCabinColor(seat.cabin) : ""}
                          ${getTypeColor(seat.type)}
                        `}
                      >
                        {seat.id}
                      </button>
                    );
                  })}
                </div>

                {/* PASILLO */}
                <div className="w-6" />

                {/* DERECHA */}
                <div className="flex gap-1">
                  {right.map((seat) => {
                    const isOccupied = occupied.includes(seat.id);
                    const isSelected = selected?.id === seat.id;

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSelect(seat)}
                        disabled={isOccupied}
                        className={`
                          w-10 h-10 flex items-center justify-center rounded-md text-xs font-semibold border
                          ${isOccupied ? "bg-slate-400 border-slate-600 cursor-not-allowed" : ""}
                          ${isSelected ? "bg-green-400 border-green-700" : ""}
                          ${!isOccupied && !isSelected ? getCabinColor(seat.cabin) : ""}
                          ${getTypeColor(seat.type)}
                        `}
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
      </div>

      <p className="text-center text-xs text-slate-500 mt-3">
        Pasillo representado por el espacio central
      </p>
    </div>
  );
}
