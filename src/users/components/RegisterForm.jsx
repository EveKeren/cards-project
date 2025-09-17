import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import Form from "../../components/Form";
import signupSchema from "../models/signupSchema";
import initialSignupForm from "../helpers/initialForms/initialSignupForm";
import normalizeUser from "../helpers/normalization/normalizeUser";
import { useSnack } from "../../providers/SnackbarProvider";
import ROUTES from "../../routes/routesDict";
import { registerUser } from "./../services/usersApiService";

export default function RegisterForm() {
  const snack = useSnack();
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    try {
      await registerUser(normalizeUser(values));
      snack("Account created! Please sign in.", "success");
      navigate(ROUTES.login, { replace: true });
    } catch (e) {
      snack(e.message || "Registration failed", "error");
    }
  };

  const {
    formDetails: f,
    errors,
    handleChange,
    handleSubmit,
  } = useForm(initialSignupForm, signupSchema, handleSignup);

  const err = (k) => Boolean(errors[k]);
  const help = (k) => errors[k] || "";

  return (
    <Form
      onSubmit={handleSubmit}
      onReset={() => {}}
      title="sign up form"
      styles={{ maxWidth: 800 }}
    >
      <TextField
        name="first"
        label="first name"
        value={f.first}
        onChange={handleChange}
        error={err("first")}
        helperText={help("first")}
        fullWidth
      />
      <TextField
        name="middle"
        label="middle name"
        value={f.middle}
        onChange={handleChange}
        error={err("middle")}
        helperText={help("middle")}
        fullWidth
      />
      <TextField
        name="last"
        label="last name"
        value={f.last}
        onChange={handleChange}
        error={err("last")}
        helperText={help("last")}
        fullWidth
      />
      <TextField
        name="phone"
        label="phone"
        type="tel"
        value={f.phone}
        onChange={handleChange}
        error={err("phone")}
        helperText={help("phone")}
        fullWidth
      />
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
      <TextField
        name="url"
        label="image url"
        value={f.url}
        onChange={handleChange}
        error={err("url")}
        helperText={help("url")}
        fullWidth
      />
      <TextField
        name="alt"
        label="image alt"
        value={f.alt}
        onChange={handleChange}
        error={err("alt")}
        helperText={help("alt")}
        fullWidth
      />
      <TextField
        name="state"
        label="state"
        value={f.state}
        onChange={handleChange}
        error={err("state")}
        helperText={help("state")}
        fullWidth
      />
      <TextField
        name="country"
        label="country"
        value={f.country}
        onChange={handleChange}
        error={err("country")}
        helperText={help("country")}
        fullWidth
      />
      <TextField
        name="city"
        label="city"
        value={f.city}
        onChange={handleChange}
        error={err("city")}
        helperText={help("city")}
        fullWidth
      />
      <TextField
        name="street"
        label="street"
        value={f.street}
        onChange={handleChange}
        error={err("street")}
        helperText={help("street")}
        fullWidth
      />
      <TextField
        name="houseNumber"
        label="house number"
        type="number"
        value={f.houseNumber}
        onChange={handleChange}
        error={err("houseNumber")}
        helperText={help("houseNumber")}
        fullWidth
      />
      <TextField
        name="zip"
        label="zip"
        value={f.zip}
        onChange={handleChange}
        error={err("zip")}
        helperText={help("zip")}
        fullWidth
      />
    </Form>
  );
}
