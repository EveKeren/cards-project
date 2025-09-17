import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../services/localStorageService";
import { useSnack } from "../../providers/SnackbarProvider";
const BASE = "https://cards-server-oxw3.onrender.com";
const UserContext = createContext();
export default function UserProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [userFullDetails, setUserFullDetails] = useState(null);
  const snack = useSnack();
  useEffect(() => {
    if (!user || !token) {
      setUserFullDetails(null);
      return;
    }
    let on = true;
    axios
      .get(`${BASE}/users/${user._id}`, {
        headers: { "x-auth-token": token },
      })
      .then(({ data }) => {
        if (on) setUserFullDetails(data);
      })
      .catch((err) => {
        if (!on) return;
        const status = err?.response?.status;
        const msg =
          status === 401
            ? "Session expired. Please sign in again."
            : "Couldn’t load user details.";
        snack(msg, status === 401 ? "error" : "warning");
        setUserFullDetails(null);
      });
    return () => {
      on = false;
    };
  }, [user, token, snack]);
  const value = useMemo(
    () => ({ user, setUser, token, setToken, userFullDetails }),
    [user, token, userFullDetails]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useCurrentUser must be used within provider");
  return context;
};
