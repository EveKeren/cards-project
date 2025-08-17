import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import { useCurrentUser } from "../../users/providers/UserProvider";

function BCard({ card, toggleLike, onEdit, onDelete }) {
  const { user } = useCurrentUser();
  const myId = user?._id || user?.id;
  const liked =
    !!myId && Array.isArray(card?.likes) && card.likes.includes(myId);
  const isOwner = !!myId && card?.user_id === myId;

  const img =
    card?.image?.url || "https://via.placeholder.com/640x360?text=No+Image";
  const alt = card?.image?.alt || card?.title || "business image";

  return (
    <Card
      elevation={3}
      sx={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={img}
          alt={alt}
          sx={{ height: 160, objectFit: "cover" }}
        />
        <CardContent sx={{ minHeight: 128 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {card?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {card?.subtitle}
          </Typography>
          <Stack spacing={0.5} sx={{ color: "text.secondary" }}>
            <Typography variant="caption">
              <b>Phone:</b> {card?.phone || "-"}
            </Typography>
            <Typography variant="caption">
              <b>Address:</b>{" "}
              {[
                card?.address?.city,
                card?.address?.street,
                card?.address?.houseNumber,
              ]
                .filter(Boolean)
                .join(" ")}
            </Typography>
            <Typography variant="caption">
              <b>Card number:</b> {card?.bizNumber ?? "-"}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 1, py: 0.5, justifyContent: "space-between" }}>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit">
            <span>
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() => onEdit?.(card)}
                disabled={!isOwner || !onEdit}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton
                size="small"
                aria-label="delete"
                onClick={() => onDelete?.(card)}
                disabled={!isOwner || !onDelete}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Tooltip title={`Call ${card?.phone || ""}`}>
          <span>
            <IconButton
              size="small"
              aria-label="call"
              component={Link}
              href={card?.phone ? `tel:${card.phone}` : undefined}
              disabled={!card?.phone}
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={liked ? "Unlike" : "Like"}>
          <IconButton
            size="small"
            aria-label="like"
            onClick={() => toggleLike?.(card._id)}
          >
            {liked ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
export default BCard;
