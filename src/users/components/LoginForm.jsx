import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import Form from "../../components/Form";
import loginSchema from "../models/loginSchema";
import initialLoginForm from "../helpers/initialForms/initialLoginForm";
import { login as apiLogin } from "../services/apiClient.js"; // ← fixed path (+ .js ok)
import {
  setTokenInLocalStorage,
  getUser,
} from "../services/localStorageService";
import { useCurrentUser } from "../providers/UserProvider";
import { useSnack } from "../../providers/SnackbarProvider";
import ROUTES from "../../routes/routesDict";

export default function LoginForm() {
  const { setToken, setUser } = useCurrentUser();
  const snack = useSnack();
  const navigate = useNavigate();

  const handleLogin = async (creds) => {
    try {
      const token = await apiLogin(creds);
      setTokenInLocalStorage(token);
      setToken(token);
      setUser(getUser());
      snack("Signed in successfully", "success");
      navigate(ROUTES.root, { replace: true });
    } catch (e) {
      snack(e.message || "Login failed", "error");
    }
  };

  const {
    formDetails: f,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(initialLoginForm, loginSchema, handleLogin);

  const err = (k) => Boolean(errors[k]);
  const help = (k) => errors[k] || "";

  return (
    <Form
      onSubmit={handleSubmit}
      onReset={() => {}}
      title="sign in form"
      styles={{ maxWidth: 480 }}
    >
      <TextField
        name="email"
        label="email"
        type="email"
        value={f.email}
        onChange={handleChange}
        error={err("email")}
        helperText={help("email")}
        fullWidth
      />
      <TextField
        name="password"
        label="password"
        type="password"
        value={f.password}
        onChange={handleChange}
        error={err("password")}
        helperText={help("password")}
        fullWidth
      />
    </Form>
  );
}
