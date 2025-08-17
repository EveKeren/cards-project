import { Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../../routes/routesDict";

export default function Logo() {
  return (
    <Typography
      component={RouterLink}
      to={ROUTES.root}
      variant="h6"
      noWrap
      sx={{
        textDecoration: "none",
        color: "white",
        fontWeight: 900,
        letterSpacing: 0.5,
        lineHeight: 1,
        display: "inline-block",
        "&:hover": { textDecoration: "none", color: "white" },
      }}
    >
      BCard
    </Typography>
  );
}
