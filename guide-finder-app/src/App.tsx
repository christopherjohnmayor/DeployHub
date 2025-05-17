import React from "react";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import GuideDetails from "./components/GuideDetails";
import AdminPanel from "./pages/AdminPanel";
import { Guide } from "./types/guide";
import { Toaster, toast } from "sonner";

// Helper to decode JWT payload and check expiration
function isValidJwt(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return false;
    // Base64url decode
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // exp is in seconds since epoch
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const App: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [page, setPage] = useState<"home" | "details" | "notfound" | "admin">(
    "home"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [jwt, setJwt] = useState<string | null>(() =>
    localStorage.getItem("jwt")
  );

  const handleSelectGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setPage("details");
  };

  const handleBack = () => {
    setPage("home");
    setSelectedGuide(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    setLoginError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setJwt(data.token);
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginError("");
        setPage("admin");
        toast.success("Logged in successfully.");
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      setLoginError("Incorrect password or server error");
      toast.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    // On mount, check for JWT validity
    const token = localStorage.getItem("jwt");
    if (token && isValidJwt(token)) {
      setIsAuthenticated(true);
      setJwt(token);
    } else {
      localStorage.removeItem("jwt");
      setIsAuthenticated(false);
      setJwt(null);
    }
  }, []);

  if (page === "notfound") return <NotFound />;

  return (
    <div>
      <nav className="mb-4 flex gap-2">
        <button type="button" onClick={() => setPage("home")}>
          Home
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              setShowLogin(true);
            } else {
              setPage("admin");
            }
          }}
        >
          Admin Panel
        </button>
        {isAuthenticated && (
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded ml-2"
            onClick={() => {
              localStorage.removeItem("jwt");
              setIsAuthenticated(false);
              setJwt(null);
              setPage("home");
              toast.success("Logged out successfully.");
            }}
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </nav>
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg max-w-xs w-full"
            onSubmit={handleLogin}
          >
            <h2 className="text-xl font-bold mb-2">Admin Login</h2>
            <input
              className="border p-2 mb-2 w-full"
              type="password"
              name="password"
              placeholder="Enter admin password"
            />
            {loginError && (
              <div className="text-red-600 mb-2">{loginError}</div>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
            >
              Login
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded"
              onClick={() => {
                setShowLogin(false);
                setLoginError("");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {page === "home" && <Home onSelectGuide={handleSelectGuide} />}
      {page === "details" && selectedGuide && (
        <div>
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <GuideDetails guide={selectedGuide} />
        </div>
      )}
      {page === "admin" && isAuthenticated && <AdminPanel jwt={jwt} />}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default App;
