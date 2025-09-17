import axios from "axios";
import { getToken } from "./localStorageService";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:3000";
export const api = axios.create({ baseURL });

// attach JWT automatically
api.interceptors.request.use((config) => {
  const t = getToken?.();
  if (t) config.headers["x-auth-token"] = t;
  return config;
});

const asMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data ||
  err?.message ||
  "Request failed";

// -------- Auth
export async function registerUser(payload) {
  try {
    const { data } = await api.post("/users", payload);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function login(payload) {
  try {
    const { data } = await api.post("/users/login", payload);
    return data; // JWT token
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

// -------- Cards
export async function getCards() {
  try {
    const { data } = await api.get("/cards");
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function getMyCards() {
  try {
    const { data } = await api.get("/cards/my-cards");
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function getCardById(id) {
  try {
    const { data } = await api.get(`/cards/${id}`);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function createCard(payload) {
  try {
    const { data } = await api.post("/cards", payload);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function updateCard(id, payload) {
  try {
    const { data } = await api.put(`/cards/${id}`, payload);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function deleteCard(id) {
  try {
    const { data } = await api.delete(`/cards/${id}`);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}

export async function toggleLike(id) {
  try {
    const { data } = await api.patch(`/cards/${id}`);
    return data;
  } catch (e) {
    throw new Error(asMessage(e));
  }
}
