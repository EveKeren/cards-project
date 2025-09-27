import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "testing":
        return <Send className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          API Debug Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={testServerConnection}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running Tests..." : "Run API Tests"}
        </button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <h3 className="font-semibold">Test Results:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 border rounded text-sm"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium">{result.test}</div>
                  <div className="text-gray-600">{result.details}</div>
                  <div className="text-xs text-gray-400">
                    {result.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>This tool will test:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Server connectivity</li>
            <li>JWT token validity</li>
            <li>Authenticated requests</li>
            <li>Card creation endpoint</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
