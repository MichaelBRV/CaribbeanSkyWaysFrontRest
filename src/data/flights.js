import { ROUTES } from "./routes";

// ===============================
//  GENERAR FECHAS PRÓXIMOS 10 DÍAS
// ===============================
function generateNext10Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    // Guardamos solo yyyy-mm-dd
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
}

const DAYS = generateNext10Days();

// ===============================
//  HORARIOS FIJOS
// ===============================
const FIXED_DEPARTURE_TIMES = [
  "06:30",
  "09:45",
  "13:20",
  "17:10",
  "21:00",
];

// Multiplicador del precio
const PRICE_PER_MINUTE = 0.85;

// ===============================
//  SUMAR MINUTOS (UTC REAL)
// ===============================
function addMinutesUTC(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

// ===============================
//  GENERAR VUELOS
// ===============================
let flights = [];
let idCounter = 1;

for (const route of ROUTES) {
  for (const day of DAYS) {
    // Elegir horario aleatorio
    const time =
      FIXED_DEPARTURE_TIMES[
        Math.floor(Math.random() * FIXED_DEPARTURE_TIMES.length)
      ];

    const [hour, minute] = time.split(":").map(Number);

    // ===============================
    // CREAR FECHA DE SALIDA EN UTC
    // ===============================
    const departure = new Date(`${day}T${time}:00Z`);

    // ===============================
    // CALCULAR LLEGADA EXACTA UTC
    // ===============================
    const arrival = addMinutesUTC(departure, route.minutes);

    // ===============================
    // PRECIO DINÁMICO
    // ===============================
    const price = Math.round(
      route.minutes * PRICE_PER_MINUTE + Math.random() * 50
    );

    // ===============================
    // PUSH DEL VUELO FINAL
    // ===============================
    flights.push({
      id: idCounter++,
      origin: route.from,
      originCode: route.originCode,
      destination: route.to,
      destinationCode: route.destinationCode,
      departure: departure.toISOString(), // CON Z
      arrival: arrival.toISOString(),     // CON Z
      duration: route.duration,           // "2h 30m"
      minutes: route.minutes,
      price: price,
      seats: Math.floor(Math.random() * 50) + 10, // AHORA SI seats
      airline: "Caribbean Skyways",
    });
  }
}

export { flights };
