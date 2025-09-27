import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircle, Error, Sync } from "@mui/icons-material";

export default function ApiDebugTool() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, details) => {
    setResults((prev) => [
      ...prev,
      { test, status, details, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testServerConnection = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Basic server connection
    try {
      addResult(
        "Basic Connection",
        "testing",
        "Testing server availability..."
      );

      const response = await fetch(
        "https://cards-server-oxw3.onrender.com/cards",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        addResult(
          "Basic Connection",
          "success",
          `Server responded: ${response.status}. Got ${data.length || 0} cards.`
        );
      } else {
        addResult(
          "Basic Connection",
          "error",
          `Server returned: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      addResult(
        "Basic Connection",
        "error",
        `Connection failed: ${error.message}`
      );
    }

    // Test 2: Check local storage token
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        addResult(
          "JWT Token",
          isExpired ? "error" : "success",
          isExpired
            ? "Token is expired"
            : `Token valid until ${new Date(
                payload.exp * 1000
              ).toLocaleString()}`
        );
      } catch (e) {
        addResult("JWT Token", "error", "Invalid token format");
      }
    } else {
      addResult("JWT Token", "error", "No token found in localStorage");
    }

    // Test 3: Test with authentication
    if (token) {
      try {
        addResult(
          "Authenticated Request",
          "testing",
          "Testing with auth token..."
        );

        const response = await fetch(
          "https://cards-server-oxw3.onrender.com/cards/my-cards",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          addResult(
            "Authenticated Request",
            "success",
            `Got ${data.length || 0} user cards`
          );
        } else {
          const errorText = await response.text();
          addResult(
            "Authenticated Request",
            "error",
            `${response.status}: ${errorText}`
          );
        }
      } catch (error) {
        addResult("Authenticated Request", "error", error.message);
      }
    }

    // Test 4: Test POST request with minimal data
    if (token) {
      try {
        addResult("POST Request Test", "testing", "Testing card creation...");

        const testPayload = {
          title: "Test Card",
          subtitle: "Test Subtitle",
          description: "Test Description",
          phone: "0501234567",
          email: "test@example.com",
          image: { url: "https://via.placeholder.com/150", alt: "test image" },
          address: {
            country: "Israel",
            city: "Test City",
            street: "Test Street",
            houseNumber: 1,
            zip: 12345,
          },
        };

        const response = await fetch(
          "https://cards-server-oxw3.onrender.com/cards",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify(testPayload),
          }
        );

        if (response.ok) {
          const data = await response.json();
          addResult(
            "POST Request Test",
            "success",
            `Card created successfully! ID: ${data._id || data.id}`
          );
        } else {
          const errorText = await response.text();
          addResult(
            "POST Request Test",
            "error",
            `${response.status}: ${errorText}`
          );
        }
      } catch (error) {
        addResult("POST Request Test", "error", error.message);
      }
    }

    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle sx={{ color: "green" }} />;
      case "error":
        return <Error sx={{ color: "red" }} />;
      case "testing":
        return <Sync sx={{ color: "blue" }} className="animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "testing":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 2 }}>
      <CardHeader>
        <Typography
          variant="h5"
          component="h2"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Sync />
          API Debug Tool
        </Typography>
      </CardHeader>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={testServerConnection}
            disabled={loading}
            variant="contained"
            fullWidth
            sx={{ mb: 2 }}
          >
            {loading ? "Running Tests..." : "Run API Tests"}
          </Button>
        </Box>

        {results.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Test Results:
            </Typography>
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {results.map((result, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>{getStatusIcon(result.status)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle2">
                          {result.test}
                        </Typography>
                        <Chip
                          label={result.status}
                          color={getStatusColor(result.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {result.details}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {result.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            This tool will test:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <Typography component="li" variant="caption">
              Server connectivity
            </Typography>
            <Typography component="li" variant="caption">
              JWT token validity
            </Typography>
            <Typography component="li" variant="caption">
              Authenticated requests
            </Typography>
            <Typography component="li" variant="caption">
              Card creation endpoint
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
