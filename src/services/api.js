// src/services/api.js

export const API_URL = "https://skywayscaribbeanrest.runasp.net/api/v1";

// Helper para manejar JSON o XML
async function parseResponse(res) {
  const text = await res.text();

  try {
    return JSON.parse(text); // ✔️ si es JSON
  } catch {
    return text; // ✔️ si es XML (evita romper fetch)
  }
}

export const api = {
  async get(endpoint, params = {}) {
    let url = new URL(`${API_URL}/${endpoint}`);

    Object.keys(params).forEach((k) => {
      if (params[k] !== null && params[k] !== undefined && params[k] !== "")
        url.searchParams.append(k, params[k]);
    });

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }, // 👈 Cambiado
    });

    if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`);

    return await parseResponse(res);
  },

  async post(endpoint, body = {}) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status}`);

    return await parseResponse(res);
  },

  async put(endpoint, body = {}) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`PUT ${endpoint} → ${res.status}`);

    return await parseResponse(res);
  },

  async delete(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`DELETE ${endpoint} → ${res.status}`);

    return await parseResponse(res);
  },
};
