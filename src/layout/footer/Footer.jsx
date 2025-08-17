import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ROUTES from "../../routes/routesDict";
import { useCurrentUser } from "../../users/providers/UserProvider";

export default function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, userFullDetails } = useCurrentUser();

  const isLoggedIn = !!user;
  const isBusiness = !!(user?.isBusiness || userFullDetails?.isBusiness);
  const isAdmin = !!(user?.isAdmin || userFullDetails?.isAdmin);

  const tabs = useMemo(
    () => [
      {
        key: "about",
        label: "About",
        to: ROUTES.about,
        icon: <InfoOutlinedIcon />,
        disabled: false,
        tip: "",
      },
      {
        key: "fav",
        label: "Fav cards",
        to: ROUTES.favorite,
        icon: <FavoriteBorderIcon />,
        disabled: !isLoggedIn,
        tip: isLoggedIn ? "" : "Login required",
      },
      {
        key: "my",
        label: "My cards",
        to: ROUTES.myCards,
        icon: <CreditCardIcon />,
        disabled: !(isBusiness || isAdmin),
        tip: isBusiness || isAdmin ? "" : "Business/Admin only",
      },
    ],
    [isLoggedIn, isBusiness, isAdmin]
  );

  const currentIndex = tabs.findIndex((t) => pathname.startsWith(t.to));
  const [value, setValue] = useState(currentIndex === -1 ? 0 : currentIndex);

  const handleChange = (_e, newValue) => {
    setValue(newValue);
    const t = tabs[newValue];
    if (!t.disabled) navigate(t.to);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (t) => t.zIndex.appBar - 1,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{ px: 1 }}
      >
        {tabs.map((t) => {
          const action = (
            <BottomNavigationAction
              key={t.key}
              label={t.label}
              icon={t.icon}
              disabled={t.disabled}
              sx={{ minWidth: 80 }}
            />
          );
          return t.tip ? (
            <Tooltip key={t.key} title={t.tip} arrow>
              <span>{action}</span>
            </Tooltip>
          ) : (
            action
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
