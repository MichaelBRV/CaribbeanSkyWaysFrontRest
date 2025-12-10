// src/utils/paymentStorage.js

const STORAGE_KEY = "payments";

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

// ===============================
//  GUARDAR PAGO
// ===============================
export function savePayment(payment) {
  const existing = loadRaw();

  const enriched = {
    ...payment,
    id: Date.now(),
    date: new Date().toISOString()
  };

  existing.push(enriched);
  saveRaw(existing);
}

// ===============================
//  OBTENER PAGOS (ORDENADOS)
// ===============================
export function getPayments() {
  const data = loadRaw();

  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}
