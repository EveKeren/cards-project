import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoopIcon from "@mui/icons-material/Loop";
import { useNavigate } from "react-router-dom";
import FormButton from "./FormButton";

const Form = ({
  title = "",
  onSubmit,
  onReset,
  to = "/",
  color = "primary",
  spacing = 2,
  styles = {},
  children,
  submitLabel = "SUBMIT",
  resetLabel = "RESET",
  cancelLabel = "CANCEL",
  loading = false,
  submitDisabled = false,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      onReset={onReset}
      sx={{
        maxWidth: 720,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 3,
        "& .MuiFormControl-root": { mb: 2 },
        ...styles,
      }}
    >
      {title && (
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 700, textAlign: "center" }}
        >
          {title.toUpperCase()}
        </Typography>
      )}

      <Grid container spacing={spacing}>
        <Grid size={12}>{children}</Grid>

        <Grid size={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormButton
                type="button"
                variant="text"
                onClick={() => navigate(to)}
                sx={{ textTransform: "uppercase" }}
              >
                {cancelLabel}
              </FormButton>
              <FormButton
                type="reset"
                variant="outlined"
                color={color}
                sx={{ textTransform: "uppercase" }}
              >
                {resetLabel}
              </FormButton>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <FormButton
                type="submit"
                color={color}
                disabled={loading || submitDisabled}
                startIcon={loading ? <LoopIcon /> : null}
                sx={{ textTransform: "uppercase" }}
              >
                {submitLabel}
              </FormButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form;
