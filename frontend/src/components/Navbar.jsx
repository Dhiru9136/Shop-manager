
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function getTokenExpiry() {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(
      atob(
        base64.padEnd(
          base64.length + ((4 - (base64.length % 4)) % 4),
          "="
        )
      )
    );

    return typeof decoded.exp === "number"
      ? decoded.exp * 1000
      : null;
  } catch {
    return null;
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const hours = String(
    Math.floor(totalSeconds / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(
    totalSeconds % 60
  ).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function Navbar() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const updateTimer = () => {
      const expiryTime = getTokenExpiry();

      if (expiryTime === null) {
        setTimeLeft(null);
        return;
      }

      const remaining = expiryTime - Date.now();

      if (remaining <= 0) {
        setTimeLeft(0);
        handleLogout();
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [handleLogout]);

  return (
    <nav className="navbar">
      <h2 className="navbar-title">
        Customer Manager
      </h2>

      {timeLeft !== null && timeLeft > 0 && (
        <div
          className={`token-timer ${
            timeLeft <= 60000
              ? "token-timer-warning"
              : ""
          }`}
          title="Access token remaining time"
          role="timer"
          aria-label={`Session expires in ${formatTime(timeLeft)}`}
        >
          <span className="token-timer-label">
            Session expires in
          </span>

          <strong>{formatTime(timeLeft)}</strong>
        </div>
      )}

      <button
  className="navbar-profile"
  aria-label="Profile"
  title="Profile"
  type="button"
  onClick={() => navigate("/profile")}
>
  <span className="profile-icon" aria-hidden="true">
    👤
  </span>
</button>
    </nav>
  );
}

export default Navbar;
