import { useState } from "react";
import { Alert, Box, Stack, TextField } from "@mui/material";
import Form from "../../components/Form";
import useForm from "../../hooks/useForm";
import { useSnack } from "../../providers/SnackbarProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { useCurrentUser } from "../../users/providers/UserProvider";
import ROUTES from "../../routes/routesDict";
import cardSchema from "../models/cardSchema";
import { createCard } from "../../users/services/apiClient";

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
  const { user } = useCurrentUser();
  const snack = useSnack();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Call hooks unconditionally
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
  } = useForm(initialCardForm, cardSchema, async (v) => {
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
      await createCard(payload);
      snack("A new business card has been created", "success");
      navigate(ROUTES.myCards, { replace: true });
    } catch (e) {
      console.error('Card creation failed:', e);
      console.error('Response status:', e.response?.status);
      console.error('Response data:', e.response?.data);
      const errorMessage = e.response?.data?.message || e.message || "Failed to create card";
      snack(errorMessage, "error");
    }
  });

  // ✅ Redirect AFTER hooks are called
  if (!user) return <Navigate to={ROUTES.login} replace />;

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

  const field = (name, label, tip, required = false, extra = {}) => (
    <TextField
      name={name}
      label={label}
      value={f[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      error={show(name)}
      helperText={help(name, tip)}
      fullWidth
      required={required}
      {...extra}
    />
  );

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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {field("title", "Title", "2–256 characters", true)}
          {field("subtitle", "Subtitle", "2–256 characters", true)}
          {field("phone", "Phone", "Israeli: 0 + 8–10 digits", true)}

          {field("email", "Email", "name@example.com", true, { type: "email" })}
          {field("web", "Website", "https://example.com (optional)")}
          {field("imageUrl", "Image URL", "https://…", true)}

          {field("imageAlt", "Image alt", "Short description", true)}
          {field("country", "Country", "Required", true)}
          {field("city", "City", "Required", true)}

          {field("street", "Street", "Required", true)}
          {field("houseNumber", "House number", "Number or text")}
          {field("zip", "Zip", "Number or text")}

          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            {field("description", "Description", "2–1024 characters", true, {
              multiline: true,
              minRows: 3,
            })}
          </Box>
        </Box>
      </Stack>
    </Form>
  );
}
