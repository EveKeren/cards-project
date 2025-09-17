import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import HeaderLink from "./HeaderLink";
import Logo from "./logo.jsx";
import ROUTES from "../../routes/routesDict";
import { useTheme } from "../../providers/CustomThemeProvider";
import { useCurrentUser } from "../../users/providers/UserProvider";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSnack } from "../../providers/SnackbarProvider";
import { removeToken } from "../../users/services/localStorageService";
import { js } from "@eslint/js";

function Header() {
  const { toggleMode, isDark } = useTheme();
  const { user, userFullDetails, setToken, setUser } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const snack = useSnack();

  const { isLoggedIn, isBusiness, isAdmin, firstName } = useMemo(() => {
    const logged = !!user;
    const biz = !!(user?.isBusiness || userFullDetails?.isBusiness);
    const admin = !!(user?.isAdmin || userFullDetails?.isAdmin);
    const name = userFullDetails?.name?.first || "";
    return {
      isLoggedIn: logged,
      isBusiness: biz,
      isAdmin: admin,
      firstName: name,
    };
  }, [user, userFullDetails]);

  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  const handleSignout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    snack("Signed out", "success");
    navigate("/", { replace: true });
  };

  const renderLeftLinks = () => {
    const links = [<HeaderLink key="about" to={ROUTES.about} label="About" />];
    if (!isLoggedIn) return links;

    if (isAdmin) {
      links.push(
        <HeaderLink key="fav" to={ROUTES.favorite} label="Favorite cards" />,
        <HeaderLink key="my" to={ROUTES.myCards} label="My cards" />,
        <HeaderLink key="sandbox" to={ROUTES.sandbox} label="Sand box" />
      );
      return links;
    }

    if (isBusiness) {
      links.push(
        <HeaderLink key="fav" to={ROUTES.favorite} label="Favorite cards" />,
        <HeaderLink key="my" to={ROUTES.myCards} label="My cards" />
      );
      return links;
    }

    links.push(
      <HeaderLink key="fav" to={ROUTES.favorite} label="Favorite cards" />
    );
    return links;
  };

  return (
    <AppBar position="sticky" color="primary" elevation={10}>
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Logo />
          {renderLeftLinks()}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
          />

          {!isLoggedIn ? (
            <>
              <HeaderLink to={ROUTES.register} label="Register" />
              <HeaderLink to={ROUTES.login} label="Login" />
            </>
          ) : (
            <>
              <Typography sx={{ mx: 1 }}>
                Hello{firstName ? ` ${firstName}` : ""}
              </Typography>
              <Button onClick={handleSignout} sx={{ color: "white" }}>
                Sign out
              </Button>
            </>
          )}

          <Button onClick={toggleMode} sx={{ color: "white" }}>
            {isDark ? "Light" : "Dark"} Mode
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
