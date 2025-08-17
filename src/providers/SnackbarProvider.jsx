import { createContext, useCallback, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
const SnackContext = createContext(() => {});
export default function SnackbarProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "info",
    duration: 3000,
  });
  const snack = useCallback((message, severity = "info", duration = 3000) => {
    setState({ open: true, message, severity, duration });
  }, []);
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setState((s) => ({ ...s, open: false }));
  };
  return (
    <SnackContext.Provider value={snack}>
      {children}
      <Snackbar
        open={state.open}
        onClose={handleClose}
        autoHideDuration={state.duration}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          elevation={6}
          onClose={handleClose}
          severity={state.severity}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackContext.Provider>
  );
}
export const useSnack = () => useContext(SnackContext);
