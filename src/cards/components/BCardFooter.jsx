import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CallIcon from "@mui/icons-material/Call";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, CardActions, IconButton } from "@mui/material";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { useState } from "react";
function BCardFooter({ toggleLike, cardId, likes }) {
  const { user } = useCurrentUser();

  const [isLike, setIsLike] = useState(likes.includes(user?._id));

  return (
    <CardActions
      sx={{ display: "flex", justifyContent: "space-between" }}
      disableSpacing
    >
      <Box>
        <IconButton>
          <DeleteIcon />
        </IconButton>

        <IconButton>
          <EditIcon />
        </IconButton>
      </Box>

      <Box>
        <IconButton>
          <CallIcon />
        </IconButton>

        <IconButton
          onClick={() => {
            setIsLike((prev) => !prev);
            toggleLike(cardId);
          }}
        >
          <FavoriteIcon color={isLike ? "error" : ""} />
        </IconButton>
      </Box>
    </CardActions>
  );
}

export default BCardFooter;
