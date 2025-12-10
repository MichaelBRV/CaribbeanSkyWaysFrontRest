// src/data/seatMap.js

// Genera un mapa de asientos tipo avión:
// - 24 filas
// - 6 asientos por fila (A-F)  → 3 | pasillo | 3
// - Filas 1–5 = Premium
// - Ventana = A / F
// - Pasillo = C / D
// - Medio   = B / E

export function generateSeatMap(totalRows = 24, premiumRows = 5) {
  const seats = [];
  const letters = ["A", "B", "C", "D", "E", "F"];

  for (let row = 1; row <= totalRows; row++) {
    for (const col of letters) {
      const type =
        col === "A" || col === "F"
          ? "ventana"
          : col === "C" || col === "D"
          ? "pasillo"
          : "medio";

      const isPremium = row <= premiumRows;

      seats.push({
        id: `${row}${col}`,
        row,
        column: col,
        type,                        // ventana | pasillo | medio
        cabin: isPremium ? "Premium" : "Economy",
        extraCost: isPremium ? 35 : 0,
      });
    }
  }

  return seats;
}
