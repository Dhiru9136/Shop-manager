
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Login.css";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      setSuccess(true);
      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Shop Customer Manager</h1>
        <p>Create your account</p>

        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Enter first name"
          value={formData.first_name}
          onChange={handleChange}
          autoComplete="given-name"
          required
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Enter last name"
          value={formData.last_name}
          onChange={handleChange}
          autoComplete="family-name"
          required
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        //   minLength={8}
          required
        />

        <label htmlFor="password2">Confirm Password</label>
        <input
          id="password2"
          name="password2"
          type="password"
          placeholder="Confirm password"
          value={formData.password2}
          onChange={handleChange}
          autoComplete="new-password"
        //   minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
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
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
