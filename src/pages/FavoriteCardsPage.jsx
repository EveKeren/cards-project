import { Alert, Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import BCards from "../cards/components/BCards";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import ROUTES from "../routes/routesDict";
const BASE = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";
export default function FavoriteCardsPage() {
  const [cards, setCards] = useState([]);
  const snack = useSnack();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { token, userFullDetails, user } = useCurrentUser();
  const currentUserId = userFullDetails?._id || user?._id;

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE}/cards`);
      setCards(data);
    } catch {
      snack("Failed to load cards", "error");
    }
  }, [snack]);
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);
  const favorites = useMemo(() => {
    if (!currentUserId) return [];
    return cards.filter(
      (c) => Array.isArray(c.likes) && c.likes.includes(currentUserId)
    );
  }, [cards, currentUserId]);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!q) return favorites;
    return favorites.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.subtitle || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [favorites, q]);
  const toggleLike = useCallback(
    async (cardId) => {
      try {
        await axios.patch(
          `${BASE}/cards/${cardId}`,
          {},
          {
            headers: { "x-auth-token": token },
          }
        );
        await fetchCards();
      } catch {
        snack("Could not update favorite", "warning");
      }
    },
    [token, fetchCards, snack]
  );
  if (!currentUserId) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate(ROUTES.login)}
            >
              Login
            </Button>
          }
        >
          Login to view your favorite cards.
        </Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Favorite Cards
      </Typography>
      {filtered.length === 0 ? (
        <Alert severity="info">
          No favorites yet. Click the heart on any card to add it here.
        </Alert>
      ) : (
        <BCards cards={filtered} toggleLike={toggleLike} />
      )}
    </Box>
  );
}
