import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import BCards from "../cards/components/BCards";
import { useCurrentUser } from "../users/providers/UserProvider";
import { getToken } from "../users/services/localStorageService";
import { useSnack } from "../providers/SnackbarProvider";
import { useNavigate } from "react-router-dom";
const BASE = "https://cards-server-oxw3.onrender.com";
export default function MyCardsPage() {
  const { token } = useCurrentUser();
  const snack = useSnack();
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const fetchMine = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${BASE}/cards/my-cards?_=${Date.now()}`,
        {
          headers: { "x-auth-token": token || getToken() },
        }
      );
      setCards(data);
    } catch {
      snack("Failed to load your cards", "error");
    }
  }, [token, snack]);
  useEffect(() => {
    fetchMine();
  }, [fetchMine]);
  const onEdit = useCallback(
    (card) => navigate(`/cards/edit/${card._id}`),
    [navigate]
  );
  const onDelete = useCallback(
    async (card) => {
      if (!window.confirm(`Delete "${card.title}"?`)) return;
      try {
        await axios.delete(`${BASE}/cards/${card._id}`, {
          headers: { "x-auth-token": token || getToken() },
        });
        snack("Card deleted", "success");
        fetchMine();
      } catch {
        snack("Delete failed", "error");
      }
    },
    [token, fetchMine, snack]
  );
  const hasCards = useMemo(() => cards && cards.length > 0, [cards]);
  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Cards
      </Typography>
      {hasCards ? (
        <BCards
          cards={cards}
          toggleLike={() => {}}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <Typography color="text.secondary">
          You haven’t created any cards yet.
        </Typography>
      )}
    </Box>
  );
}
