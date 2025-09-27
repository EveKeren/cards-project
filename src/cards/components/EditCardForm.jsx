import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnack } from "../../providers/SnackbarProvider";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { getToken } from "../../users/services/localStorageService";

const BASE = "https://cards-server-oxw3.onrender.com";

export default function EditCardForm() {
  const { id } = useParams();
  const { token } = useCurrentUser();
  const snack = useSnack();
  const navigate = useNavigate();
  const [f, setF] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${BASE}/cards/${id}`, {
        headers: { "x-auth-token": token || getToken() },
      })
      .then(({ data }) => {
        if (!mounted) return;
        setF({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          web: data.web || "",
          imageUrl: data.image?.url || "",
          imageAlt: data.image?.alt || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          city: data.address?.city || "",
          street: data.address?.street || "",
          houseNumber: data.address?.houseNumber ?? "",
          zip: data.address?.zip ?? "",
        });
      })
      .catch(() => snack("Failed to load card", "error"));
    return () => {
      mounted = false;
    };
  }, [id, token, snack]);

  const onChange = (e) =>
    setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: f.title,
      subtitle: f.subtitle,
      description: f.description,
      phone: f.phone,
      email: f.email,
      web: f.web || undefined,
      image: { url: f.imageUrl, alt: f.imageAlt },
      address: {
        state: f.state || undefined,
        country: f.country,
        city: f.city,
        street: f.street,
        houseNumber:
          f.houseNumber === "" ? 0 : Number(f.houseNumber) || f.houseNumber,
        zip: f.zip === "" ? 0 : Number(f.zip) || f.zip,
      },
    };
    try {
      setSaving(true);
      await axios.put(`${BASE}/cards/${id}`, payload, {
        headers: { "x-auth-token": token || getToken() },
      });
      snack("Card updated", "success");
      navigate("/my-cards", { replace: true });
    } catch {
      snack("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!f) return <Typography sx={{ mt: 2 }}>Loading…</Typography>;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ maxWidth: 900, mx: "auto", mt: 2 }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Card
      </Typography>
      <Stack spacing={2}>
        <Alert severity="info">Edit your card details, then save.</Alert>

        <Grid container spacing={2}>
          {[
            ["title", "Title", true],
            ["subtitle", "Subtitle", true],
            ["phone", "Phone", true],
            ["email", "Email", true],
            ["web", "Website", false],
            ["imageUrl", "Image URL", true],
            ["imageAlt", "Image alt", true],
            ["country", "Country", true],
            ["city", "City", true],
            ["street", "Street", true],
            ["houseNumber", "House number", false],
            ["zip", "Zip", false],
          ].map(([name, label, req]) => (
            <Grid key={name} item xs={12} md={4}>
              <TextField
                name={name}
                label={label}
                value={f[name]}
                onChange={onChange}
                fullWidth
                required={req}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={f.description}
              onChange={onChange}
              fullWidth
              multiline
              minRows={3}
              required
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={saving}>
            Save
          </Button>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
