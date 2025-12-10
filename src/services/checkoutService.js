// src/services/checkoutService.js
import { api } from "./api";

export async function executeCheckout(req) {
  try {
    console.log("📤 Enviando checkout al backend:", req);

    const resp = await api.post("checkout", req);

    console.log("📥 Respuesta del checkout:", resp);
    return resp;

  } catch (error) {
    console.error("❌ Error ejecutando checkout:", error);
    throw error;
  }
}
