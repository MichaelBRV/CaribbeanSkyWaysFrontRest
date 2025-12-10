// src/services/api.js

export const API_URL = "https://skywayscaribbeanrest.runasp.net/api/v1";

export const api = {
  async get(endpoint, params = {}) {
    let url = new URL(`${API_URL}/${endpoint}`);

    Object.keys(params).forEach((k) => {
      if (params[k] !== null && params[k] !== undefined && params[k] !== "")
        url.searchParams.append(k, params[k]);
    });

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status}`);

    return res.json();
  },

  async post(endpoint, body = {}) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status}`);

    return res.json();
  },

  async put(endpoint, body = {}) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`PUT ${endpoint} → ${res.status}`);

    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`DELETE ${endpoint} → ${res.status}`);

    return res.json();
  },
};
