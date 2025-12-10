// src/utils/reservationStorage.js

const STORAGE_KEY = "reservations";

function loadRaw() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRaw(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ============================================================
   NORMALIZAR RESERVA (compatibilidad + autoreparación)
   ============================================================ */
function normalizeReservation(r) {
  const copy = { ...r };

  // -----------------------------
  // Pasajeros (formato nuevo)
  // -----------------------------
  if (!copy.passengers) {
    if (copy.passenger) {
      copy.passengers = [copy.passenger];
      delete copy.passenger;
    } else {
      copy.passengers = [];
    }
  }

  // -----------------------------
  // Asientos (formato nuevo)
  // -----------------------------
  if (!copy.seats) {
    if (copy.seat) {
      copy.seats = [copy.seat];
      delete copy.seat;
    } else {
      copy.seats = [];
    }
  }

  // Cabina
  if (!copy.cabin) {
    copy.cabin = "Economy";
  }

  // Método de pago
  if (!copy.paymentMethod) {
    copy.paymentMethod = "No registrado";
  }

  // Fechas
  const now = new Date();
  if (!copy.createdAt) copy.createdAt = now.toISOString();
  if (!Object.prototype.hasOwnProperty.call(copy, "canceledAt")) {
    copy.canceledAt = null;
  }
  if (!copy.status) copy.status = "Confirmado";

  // ============================================================
  // 🔥 REPARAR PRECIOS ANTIGUOS (donde totalAmount = 0)
  // ============================================================
  const base = copy.flight?.price || 0;
  const cabinExtra = copy.cabin === "Premium" ? 35 : 0;
  const paxCount = copy.passengers?.length || 1;

  const calculated = (base + cabinExtra) * paxCount;

  if (!copy.totalAmount || copy.totalAmount <= 0) {
    copy.totalAmount = calculated;
  }

  if (!copy.pricePaid || copy.pricePaid <= 0) {
    copy.pricePaid = calculated;
  }

  return copy;
}

/* ============================================================
   GUARDAR RESERVA
   ============================================================ */
export function saveReservation(reservation) {
  const existing = loadRaw();

  const normalized = normalizeReservation(reservation);
  existing.push(normalized);

  saveRaw(existing);
}

/* ============================================================
   OBTENER RESERVAS + AUTOCOMPLETADO
   ============================================================ */
export function getReservations() {
  const raw = loadRaw();
  const now = new Date();
  let changed = false;

  const normalized = raw.map((r) => {
    const copy = normalizeReservation(r);

    // marcar como completado si ya salió
    if (copy.status === "Confirmado" && copy.flight?.departure) {
      if (new Date(copy.flight.departure) < now) {
        copy.status = "Completado";
        changed = true;
      }
    }

    return copy;
  });

  if (changed) saveRaw(normalized);

  return normalized;
}

/* ============================================================
   ACTUALIZAR ESTADO
   ============================================================ */
export function updateReservationStatus(pnr, newStatus) {
  const raw = getReservations();
  const nowIso = new Date().toISOString();

  const updated = raw.map((r) => {
    if (r.pnr !== pnr) return r;

    return {
      ...r,
      status: newStatus,
      canceledAt: newStatus === "Cancelado" ? nowIso : r.canceledAt,
    };
  });

  saveRaw(updated);
}

/* ============================================================
   CANCELAR RESERVA
   ============================================================ */
export function cancelReservation(pnr) {
  updateReservationStatus(pnr, "Cancelado");
}
