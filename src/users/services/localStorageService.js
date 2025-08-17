import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

const storage = (() => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const testKey = "__ls_check__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
})();

export const setTokenInLocalStorage = (token) => {
  if (!storage) return;
  if (typeof token !== "string" || !token.trim()) return;
  storage.setItem(TOKEN_KEY, token);
};

export const getToken = () => storage?.getItem(TOKEN_KEY) ?? null;

export const removeToken = () => {
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
