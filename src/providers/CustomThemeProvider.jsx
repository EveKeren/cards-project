import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
const ThemeContext = createContext({ isDark: false, toggleMode: () => {} });
export default function CustomThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);
  const toggleMode = () => setIsDark((prev) => !prev);
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
        primary: { main: "#9333ea" },
        secondary: { main: "#22d3ee" },
        background: {
          default: isDark ? "#0b0219" : "#faf5ff",
          paper: isDark ? "#130726" : "#ffffff",
        },
        text: {
          primary: isDark ? "#e9d5ff" : "#1e1b4b",
          secondary: isDark ? "#c7b7ff" : "#4c1d95",
        },
      },
      shape: { borderRadius: 14 },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage:
                "linear-gradient(90deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: { textTransform: "none", fontWeight: 600, borderRadius: 12 },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 18,
              border: "1px solid rgba(168, 85, 247, 0.18)",
              background:
                "linear-gradient(180deg, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0.6) 60%)",
              backdropFilter: "blur(6px)",
            },
          },
        },
      },
      typography: { h5: { fontWeight: 700 }, button: { fontWeight: 600 } },
    });
  }, [isDark]);
  // stable context value
  const value = useMemo(() => ({ isDark, toggleMode }), [isDark]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </ThemeProvider>
  );
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within CustomThemeProvider");
  return ctx;
}
