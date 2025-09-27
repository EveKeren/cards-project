import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function TwoColumnRegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    email: "",
    password: "",
    imageUrl: "",
    imageAlt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    isBusiness: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add your registration logic here
    console.log("Registration data:", formData);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Registration successful!");
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 800 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              REGISTER
            </Typography>
            <Typography color="text.secondary">
              Create your business card account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    name="firstName"
                    label="First name *"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />

                  <TextField
                    name="middleName"
                    label="Middle name"
                    value={formData.middleName}
                    onChange={handleChange}
                    fullWidth
                  />

                  <TextField
                    name="email"
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email || "Valid email required"}
                  />

                  <TextField
                    name="imageUrl"
                    label="Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    fullWidth
                    helperText="Optional profile image URL"
                  />

                  <TextField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={handleChange}
                    fullWidth
                  />

                  <TextField
                    name="city"
                    label="City *"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    name="zip"
                    label="Zip"
                    value={formData.zip}
                    onChange={handleChange}
                    fullWidth
                  />
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    name="lastName"
                    label="Last name *"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />

                  <TextField
                    name="phone"
                    label="Phone *"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Israeli format: 0 + 8-10 digits"
                  />

                  <TextField
                    name="password"
                    label="Password *"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Minimum 8 characters, include letters, numbers & symbols"
                  />

                  <TextField
                    name="imageAlt"
                    label="Image alt"
                    value={formData.imageAlt}
                    onChange={handleChange}
                    fullWidth
                    helperText="Description of the image"
                  />

                  <TextField
                    name="country"
                    label="Country *"
                    value={formData.country}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    name="street"
                    label="Street *"
                    value={formData.street}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    name="houseNumber"
                    label="House number"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    fullWidth
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Business Checkbox */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isBusiness"
                    checked={formData.isBusiness}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Sign up as business"
              />
            </Box>

            {/* Submit Button */}
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() =>
                  setFormData({
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    phone: "",
                    email: "",
                    password: "",
                    imageUrl: "",
                    imageAlt: "",
                    state: "",
                    country: "",
                    city: "",
                    street: "",
                    houseNumber: "",
                    zip: "",
                    isBusiness: false,
                  })
                }
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
