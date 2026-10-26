
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { createCustomer } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    account_number: "",
    bank_name: "",
    amount: "",
    payment_method: "",
    transaction: "Pending",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleTransaction = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const customerData = {
        ...formData,
        amount: Number(formData.amount),
        payment_date: new Date().toISOString().split("T")[0],
      };

      const response = await createCustomer(customerData);

      console.log("Customer created successfully:", response);

      setSuccess("Customer saved successfully!");

      setFormData({
        customer_name: "",
        phone_number: "",
        account_number: "",
        bank_name: "",
        amount: "",
        payment_method: "",
        transaction: "Pending",
      });
    } catch (err) {
      console.error("Customer creation failed:", err);

      if (err.message?.includes("401") || err.message?.includes("403")) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.message || "Failed to save customer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-container">
        <div className="dashboard-heading">
          <div>
            <h1>Customer Management</h1>
            <p>Welcome, {username}!</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <section className="customer-card">
          <h2>Customer Details</h2>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="form-success">
              {success}
            </p>
          )}

          <form onSubmit={handleTransaction}>
            <div className="customer-form-grid">
              <div className="form-group">
                <label htmlFor="customer_name">Customer Name</label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="account_number">Account Number</label>
                <input
                  id="account_number"
                  name="account_number"
                  type="text"
                  placeholder="Enter account number"
                  value={formData.account_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bank_name">Bank Name</label>
                <input
                  id="bank_name"
                  name="bank_name"
                  type="text"
                  placeholder="Enter bank name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="payment_method">Payment Method</label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transaction">Transaction Type</label>
                <input
                  id="transaction"
                  name="transaction"
                  type="text"
                  placeholder="Transaction Type"
                  value={formData.transaction}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="transaction-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit Transaction"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
