import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const data = await loginUser(username, password);

if (!data?.access) {
  throw new Error("Login response mein access token nahi mila.");
}

localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);
localStorage.setItem("username", data.username || username);

      // Step 4: Username save karo
      localStorage.setItem("username", data.username || username);

      // Step 5: Success message dikhao
      setSuccess(true);
      setMessage("Login successful! Welcome to Shop Customer Manager.");

      // Step 6: Dashboard par navigate karo
      navigate("/dashboard");
    } catch (error) {
      // Failed login par purane tokens clear karo
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Shop Customer Manager</h1>
        <p>Login to your account</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p
            className={success ? "login-success" : "login-error"}
            role="status"
          >
            {message}
          </p>
        )}

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
