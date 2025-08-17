import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Alert, Stack, TextField } from "@mui/material";
import axios from "axios";
import Form from "../../components/Form";
import useForm from "../../hooks/useForm";
import { useSnack } from "../../providers/SnackbarProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { getToken } from "../../users/services/localStorageService";
import ROUTES from "../../routes/routesDict";
import cardSchema from "./../models/cardSchema";

const BASE = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

const initialCardForm = {
  title: "",
  subtitle: "",
  description: "",
  phone: "",
  email: "",
  web: "",
  imageUrl: "",
  imageAlt: "",
  state: "",
  country: "",
  city: "",
  street: "",
  houseNumber: "",
  zip: "",
};

export default function CreateCardForm() {
  const { user, token } = useCurrentUser();
  const snack = useSnack();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  if (!user) return <Navigate to={ROUTES.login} replace />;

  const handleCreate = async (v) => {
    const payload = {
      title: v.title,
      subtitle: v.subtitle,
      description: v.description,
      phone: v.phone,
      email: v.email,
      web: v.web || undefined,
      image: { url: v.imageUrl, alt: v.imageAlt },
      address: {
        state: v.state || undefined,
        country: v.country,
        city: v.city,
        street: v.street,
        houseNumber:
          v.houseNumber === "" ? 0 : Number(v.houseNumber) || v.houseNumber,
        zip: v.zip === "" ? 0 : Number(v.zip) || v.zip,
      },
    };
    try {
      setLoading(true);
      await axios.post(`${BASE}/cards`, payload, {
        headers: { "x-auth-token": token || getToken() },
      });
      snack("A new business card has been created", "success");
      navigate(ROUTES.myCards, { replace: true });
    } catch {
      snack("Failed to create card", "error");
    } finally {
      setLoading(false);
    }
  };

  const {
    formDetails: f,
    errors,
    touched,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
    resetForm,
  } = useForm(initialCardForm, cardSchema, handleCreate);

  const show = (k) => (touched[k] || submitted) && !!errors[k];
  const help = (k, d) => (show(k) ? errors[k] : d);

  const requiredFilled =
    f.title &&
    f.subtitle &&
    f.description &&
    f.phone &&
    f.email &&
    f.imageUrl &&
    f.imageAlt &&
    f.country &&
    f.city &&
    f.street;

  const submitDisabled = !requiredFilled || Object.values(errors).some(Boolean);

  return (
    <Form
      title="Create Card"
      onSubmit={handleSubmit}
      onReset={() => {
        setErrors({});
        resetForm();
      }}
      styles={{ maxWidth: 900, mt: 2 }}
      loading={loading}
      submitDisabled={submitDisabled}
      submitLabel="SUBMIT"
      resetLabel="RESET"
      cancelLabel="CANCEL"
      to={ROUTES.root}
    >
      <Stack spacing={2}>
        {(submitted || Object.values(errors).some(Boolean)) && (
          <Alert severity="error">Please fix the highlighted fields.</Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="title"
              label="Title"
              value={f.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("title")}
              helperText={help("title", "2–256 characters")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="subtitle"
              label="Subtitle"
              value={f.subtitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("subtitle")}
              helperText={help("subtitle", "2–256 characters")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="phone"
              label="Phone"
              value={f.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("phone")}
              helperText={help("phone", "Israeli: 0 + 8–10 digits")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={f.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("email")}
              helperText={help("email", "name@example.com")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="web"
              label="Website"
              value={f.web}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("web")}
              helperText={help("web", "https://example.com (optional)")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="imageUrl"
              label="Image URL"
              value={f.imageUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("imageUrl")}
              helperText={help("imageUrl", "https://…")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="imageAlt"
              label="Image alt"
              value={f.imageAlt}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("imageAlt")}
              helperText={help("imageAlt", "Short description")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="country"
              label="Country"
              value={f.country}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("country")}
              helperText={help("country", "Required")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="city"
              label="City"
              value={f.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("city")}
              helperText={help("city", "Required")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="street"
              label="Street"
              value={f.street}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("street")}
              helperText={help("street", "Required")}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="houseNumber"
              label="House number"
              value={f.houseNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("houseNumber")}
              helperText={help("houseNumber", "Number or text")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="zip"
              label="Zip"
              value={f.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("zip")}
              helperText={help("zip", "Number or text")}
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <TextField
              name="description"
              label="Description"
              value={f.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={show("description")}
              helperText={help("description", "2–1024 characters")}
              fullWidth
              multiline
              minRows={3}
              required
            />
          </Grid>
        </Grid>
      </Stack>
    </Form>
  );
}
