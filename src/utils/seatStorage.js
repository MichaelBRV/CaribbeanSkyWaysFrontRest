// Guarda asiento ocupado por vuelo
export function saveReservedSeat(flightId, seatId) {
  const data = JSON.parse(localStorage.getItem("flightSeatsMap") || "{}");

  if (!data[flightId]) data[flightId] = [];
  if (!data[flightId].includes(seatId)) data[flightId].push(seatId);

  localStorage.setItem("flightSeatsMap", JSON.stringify(data));
}

// Obtiene lista de ocupados
export function getReservedSeats(flightId) {
  const data = JSON.parse(localStorage.getItem("flightSeatsMap") || "{}");
  return data[flightId] ?? [];
}
