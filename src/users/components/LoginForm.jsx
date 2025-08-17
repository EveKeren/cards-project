import { useState } from "react";
import { Alert, Stack, TextField } from "@mui/material";
import Form from "../../components/Form";
import useForm from "../../hooks/useForm";
import axios from "axios";
import loginSchema from "../models/loginSchema";
import initialLoginForm from "../helpers/initialForms/initialLoginForm";
import {
  getUser,
  setTokenInLocalStorage,
} from "../services/localStorageService";
import { useCurrentUser } from "../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { useSnack } from "../../providers/SnackbarProvider";
function LoginForm() {
  const { setToken, setUser } = useCurrentUser();
  const navigate = useNavigate();
  const snack = useSnack();
  const [loading, setLoading] = useState(false);
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        credentials
      );
      setTokenInLocalStorage(data);
      setToken(data);
      setUser(getUser());
      snack("Logged in successfully", "success");
      navigate("/", { replace: true });
    } catch {
      snack("The login failed", "error");
    } finally {
      setLoading(false);
    }
  };
  const {
    formDetails,
    errors,
    touched,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
    resetForm,
  } = useForm(initialLoginForm, loginSchema, handleLogin);
  const showEmailError = (touched.email || submitted) && !!errors.email;
  const showPasswordError =
    (touched.password || submitted) && !!errors.password;
  const emailHelp = showEmailError
    ? errors.email
    : "Enter a valid email (e.g., name@example.com).";
  const passwordHelp = showPasswordError
    ? errors.password
    : "At least 8 chars with uppercase, lowercase, number, and special (!@#$%^&*_).";
  const isFilled =
    (formDetails.email || "").trim() && (formDetails.password || "").trim();
  const submitDisabled = !isFilled || !!errors.email || !!errors.password;
  const hasAnyError = !!(showEmailError || showPasswordError);
  return (
    <Form
      title="Login"
      onSubmit={handleSubmit}
      onReset={() => {
        setErrors({});
        resetForm();
      }}
      styles={{ maxWidth: 520, mt: 2 }}
      loading={loading}
      submitDisabled={submitDisabled}
      submitLabel="SUBMIT"
      resetLabel="RESET"
      cancelLabel="CANCEL"
      to="/"
    >
      <Stack spacing={2}>
        {hasAnyError && (
          <Alert severity="error">Please fix the highlighted fields.</Alert>
        )}
        <TextField
          name="email"
          label="Email"
          type="email"
          value={formDetails.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showEmailError}
          helperText={emailHelp}
          fullWidth
          autoComplete="email"
          autoFocus
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={formDetails.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={showPasswordError}
          helperText={passwordHelp}
          fullWidth
          autoComplete="current-password"
          required
        />
      </Stack>
    </Form>
  );
}
export default LoginForm;
