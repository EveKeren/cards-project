import { Box, Typography, Alert, Button } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import BCards from "../cards/components/BCards";
import { useSnack } from "../providers/SnackbarProvider";
import { useCurrentUser } from "../users/providers/UserProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getToken } from "../users/services/localStorageService";
import CreateCardFav from "../cards/components/createCardFav.jsx";

const BASE = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";
const qNorm = (v) => {
  const s = (v || "").trim().toLowerCase();
  return s === "undefined" || s === "null" ? "" : s;
};

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const snack = useSnack();
  const { token } = useCurrentUser();
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const fetchCards = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE}/cards?_=${Date.now()}`);
      setCards(data);
    } catch {
      snack("Failed to load cards", "error");
    }
  }, [snack]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const toggleLike = useCallback(
    async (cardId) => {
      try {
        await axios.patch(
          `${BASE}/cards/${cardId}`,
          {},
          {
            headers: { "x-auth-token": token || getToken() },
          }
        );
        fetchCards();
      } catch {
        snack("Could not update like", "warning");
      }
    },
    [token, fetchCards, snack]
  );

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
        fetchCards();
      } catch {
        snack("Delete failed (not your card?)", "error");
      }
    },
    [token, fetchCards, snack]
  );

  const q = qNorm(sp.get("q"));
  const filtered = useMemo(() => {
    if (!q) return cards;
    return cards.filter((c) => {
      const t = (c.title || "").toLowerCase();
      const s = (c.subtitle || "").toLowerCase();
      const d = (c.description || "").toLowerCase();
      return t.includes(q) || s.includes(q) || d.includes(q);
    });
  }, [cards, q]);

  return (
    <Box sx={{ pb: 8 }}>
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          BCard • Business Cards Hub
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Browse all business cards.
        </Typography>
      </Box>

      {q && filtered.length === 0 && (
        <Alert
          severity="info"
          action={<Button onClick={() => setSp({})}>Clear</Button>}
          sx={{ mb: 2 }}
        >
          No cards match your search.
        </Alert>
      )}

      <BCards
        cards={filtered}
        toggleLike={toggleLike}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <CreateCardFav />
    </Box>
  );
}
