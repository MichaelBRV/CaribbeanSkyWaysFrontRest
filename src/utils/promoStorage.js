// src/utils/promoStorage.js

const STORAGE_KEY = "cs_promotions";

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

// 🔥 Crear promoción
export function addPromotion(promo) {
  const existing = loadRaw();

  // generar ID
  const id = Date.now();
  const fullPromo = { id, ...promo };

  existing.push(fullPromo);
  saveRaw(existing);
  return fullPromo;
}

// 🔥 Obtener promociones
export function getPromotions() {
  return loadRaw();
}

// 🔥 Actualizar promoción
export function updatePromotion(id, updatedFields) {
  const existing = loadRaw();

  const updated = existing.map((p) =>
    p.id === id ? { ...p, ...updatedFields } : p
  );

  saveRaw(updated);
}

// 🔥 Eliminar promoción
export function deletePromotion(id) {
  const existing = loadRaw();
  const filtered = existing.filter((p) => p.id !== id);
  saveRaw(filtered);
}
