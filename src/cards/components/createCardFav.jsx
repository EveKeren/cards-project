import { Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";
import { useCurrentUser } from "../../users/providers/UserProvider";
import ROUTES from "../../routes/routesDict";

export default function CreateCardFav() {
  const { user } = useCurrentUser();
  if (!user) return null;

  return (
    <Tooltip title="Create a new card">
      <Fab
        color="primary"
        component={RouterLink}
        to={ROUTES.createCard}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 88,
          zIndex: (t) => t.zIndex.tooltip + 1,
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
}
