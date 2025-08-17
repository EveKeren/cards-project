import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../routes/routesDict";

export default function AboutPage() {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 2 }}
        className="gradient-text"
      >
        About This Project
      </Typography>

      <Typography sx={{ mb: 3 }}>
        A React + MUI business-cards app with role-based UI and a REST API.
        Users can browse, search, favorite, and (for business users)
        create/edit/delete cards. Auth uses a JWT stored in
        <code> localStorage</code> and sent on protected requests.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip label="React 19" />
        <Chip label="Router 7" />
        <Chip label="MUI 7" />
        <Chip label="Axios" />
        <Chip label="JWT" />
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Register" />
        <CardContent>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Create your account"
                secondary="Go to Register. Use a strong password (8+ chars, upper/lowercase, number, special char)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Business option"
                secondary="Choose Business to create/manage cards. You can upgrade later if supported."
              />
            </ListItem>
          </List>
          <Button
            component={RouterLink}
            to={ROUTES.register}
            variant="contained"
            sx={{ mt: 1 }}
          >
            Go to Register
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Sign In" />
        <CardContent>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Login with email & password"
                secondary="On success, the server returns a JWT. The app stores it and attaches it to protected requests."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="After login"
                secondary="You’ll see a success message, your name in the header, and access to favorites and (if business) card management."
              />
            </ListItem>
          </List>
          <Button
            component={RouterLink}
            to={ROUTES.login}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Favorites (♥)" />
        <CardContent>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Add / remove favorites"
                secondary="Click the heart on any card. Your user ID is toggled in the card’s likes array on the server."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="View only liked cards"
                secondary="Open the Favorites page to see just your hearted cards. Unheart to remove."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Search within favorites"
                secondary="Header search filters only your liked cards when you’re on the Favorites page."
              />
            </ListItem>
          </List>
          <Button
            component={RouterLink}
            to={ROUTES.favorite}
            variant="contained"
            sx={{ mt: 1 }}
          >
            Open Favorites
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Create & Edit Cards (Business)" />
        <CardContent>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Create"
                secondary="Use the Create Card page: title, subtitle, description, contact, image, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Edit / Delete"
                secondary="On your own cards, use the Edit (✎) and Delete (🗑) actions."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="My Cards"
                secondary="A quick view listing only the cards you created."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Permissions"
                secondary="Business users manage their cards; admins may manage all (depending on server rules)."
              />
            </ListItem>
          </List>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              component={RouterLink}
              to={ROUTES.createCard}
              variant="contained"
            >
              Create Card
            </Button>
            <Button
              component={RouterLink}
              to={ROUTES.myCards}
              variant="outlined"
            >
              My Cards
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
