import { useState } from "react";
import BCard from "./BCard";
import { Box, Typography, Pagination } from "@mui/material";

const CARDS_PER_PAGE = 8;

function BCards({ cards, toggleLike, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const handleChange = (_, value) => setPage(value);

  const pageCount = Math.ceil(cards.length / CARDS_PER_PAGE);
  const paginatedCards = cards.slice(
    (page - 1) * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE
  );

  if (cards.length === 0) {
    return (
      <Box>
        <Typography>אין כרטיסים להציג</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {paginatedCards.map((card) => (
          <BCard
            key={card._id}
            card={card}
            toggleLike={toggleLike}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={pageCount} page={page} onChange={handleChange} />
      </Box>
    </Box>
  );
}

export default BCards;
