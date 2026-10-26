
import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getCustomers,
  updateCustomers,
  deleteCustomer,
} from "../services/api";
import "../styles/Customer.css";

const TRANSACTION_STATUSES = [
  "Pending",
  "Reverse",
  "Send",
  "Refund",
];

const PAYMENT_METHODS = [
  "UPI",
  "Cash",
  "Bank Transfer",
];

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
const [filters, setFilters] = useState({
  id: "",
  customer_name: "",
  phone_number: "",
  account_number: "",
  bank_name: "",
  amount: "",
  payment_method: "",
  transaction: "",
  payment_date: "",
});


  // Fetch customers from backend
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];

      setCustomers(rows);
    } catch (err) {
      setError(err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Search customers across all requested fields
  
const filteredCustomers = useMemo(() => {
  return customers.filter((customer) => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value.trim()) return true;

      const customerValue = String(customer[field] ?? "")
        .toLowerCase();

      return customerValue.includes(value.trim().toLowerCase());
    });
  });
}, [customers, filters]);


  // Start editing a customer
  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({ ...customer });
    setError("");
  };

  // Update edit form
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited customer
  const handleSave = async () => {
    if (editingId === null || saving) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        customer_name: editForm.customer_name,
        phone_number: editForm.phone_number,
        account_number: editForm.account_number,
        bank_name: editForm.bank_name,
        amount: editForm.amount,
        payment_method: editForm.payment_method,
        payment_date: editForm.payment_date,
      };

      const response = await updateCustomers(editingId, payload);
      const updatedCustomer = response?.data || response;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...payload, ...updatedCustomer }
            : customer
        )
      );

      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err.message || "Unable to update customer.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (saving) return;

    setEditingId(null);
    setEditForm({});
    setError("");
  };

  // Update transaction status immediately
  const handleStatusChange = async (customer, newStatus) => {
    if (statusUpdatingId === customer.id) return;

    const oldStatus = customer.transaction || "Pending";

    if (oldStatus === newStatus) return;

    setStatusUpdatingId(customer.id);
    setError("");

    // Optimistic UI update
    setCustomers((prev) =>
      prev.map((item) =>
        item.id === customer.id
          ? { ...item, transaction: newStatus }
          : item
      )
    );

    try {
      const response = await updateCustomers(customer.id, {
        transaction: newStatus,
      });

      const updatedCustomer = response?.data || response;

      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customer.id
            ? {
                ...item,
                ...updatedCustomer,
                transaction: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      // Restore previous value if API fails
      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customer.id
            ? { ...item, transaction: oldStatus }
            : item
        )
      );

      setError(err.message || "Unable to update transaction.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Soft-delete customer
  const handleDelete = async (id) => {
    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this customer?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter((customer) => customer.id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setEditForm({});
      }
    } catch (err) {
      setError(err.message || "Unable to delete customer.");
    } finally {
      setDeletingId(null);
    }
  };

  // Render normal value or edit input
  const renderInput = (customer, field, type = "text") => {
    const isEditing = editingId === customer.id;

    if (!isEditing) {
      if (field === "amount") {
        const amount = Number(customer.amount);

        return Number.isFinite(amount)
          ? `₹${amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "-";
      }

      return customer[field] ?? "-";
    }

    return (
      <input
        className="customer-edit-input"
        type={type}
        name={field}
        value={editForm[field] ?? ""}
        onChange={handleChange}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        required
      />
    );
  };

  return (
    <div className="customer-page">
      <Navbar />
      <Sidebar />

      <main className="customer-container">
        {/* Page heading */}
        <div className="customer-page-heading">
          <div>
            <h1>Customers</h1>
            <p>View your registered customer records.</p>
          </div>

          <span className="customer-count">
            Total: {customers.length}
          </span>
        </div>

        {/* Search */}
      
{/* Search Filters */}
<div className="customer-search-container">
  <div className="customer-search-grid">
    <div className="customer-search-field">
      <label htmlFor="search-id">ID</label>
      <input
        id="search-id"
        type="search"
        placeholder="Search ID"
        value={filters.id}
        onChange={(e) =>
          setFilters({ ...filters, id: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-name">Customer Name</label>
      <input
        id="search-name"
        type="search"
        placeholder="Search name"
        value={filters.customer_name}
        onChange={(e) =>
          setFilters({ ...filters, customer_name: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-phone">Phone Number</label>
      <input
        id="search-phone"
        type="search"
        placeholder="Search phone"
        value={filters.phone_number}
        onChange={(e) =>
          setFilters({ ...filters, phone_number: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-account">Account Number</label>
      <input
        id="search-account"
        type="search"
        placeholder="Search account"
        value={filters.account_number}
        onChange={(e) =>
          setFilters({ ...filters, account_number: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-bank">Bank Name</label>
      <input
        id="search-bank"
        type="search"
        placeholder="Search bank"
        value={filters.bank_name}
        onChange={(e) =>
          setFilters({ ...filters, bank_name: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-amount">Amount</label>
      <input
        id="search-amount"
        type="search"
        placeholder="Search amount"
        value={filters.amount}
        onChange={(e) =>
          setFilters({ ...filters, amount: e.target.value })
        }
      />
    </div>

    <div className="customer-search-field">
      <label htmlFor="search-payment">Payment Method</label>
      <input
        id="search-payment"
        type="search"
        placeholder="Search payment"
        value={filters.payment_method}
        onChange={(e) =>
          setFilters({ ...filters, payment_method: e.target.value })
        }
      />
    </div>


<div className="customer-search-field">
  <label htmlFor="search-transaction">Transaction Status</label>

  <select
    id="search-transaction"
    className="customer-filter-select"
    value={filters.transaction}
    onChange={(e) =>
      setFilters({
        ...filters,
        transaction: e.target.value,
      })
    }
  >
    <option value="">All Transactions</option>
    <option value="Send">Send</option>
    <option value="Pending">Pending</option>
    <option value="Refund">Refund</option>
    <option value="Reverse">Reverse</option>
  </select>
</div>


    <div className="customer-search-field">
      <label htmlFor="search-date">Payment Date</label>
      <input
        id="search-date"
        type="date"
        value={filters.payment_date}
        onChange={(e) =>
          setFilters({ ...filters, payment_date: e.target.value })
        }
      />
    </div>
  </div>

  <button
    type="button"
    className="customer-search-clear"
    onClick={() =>
      setFilters({
        id: "",
        customer_name: "",
        phone_number: "",
        account_number: "",
        bank_name: "",
        amount: "",
        payment_method: "",
        transaction: "",
        payment_date: "",
      })
    }
  >
    Clear Filters
  </button>
</div>


        {/* Error message */}
        {error && (
          <p className="customer-error" role="alert">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <p className="customer-message">
            Loading customers...
          </p>
        )}

        {/* No customers */}
        {!loading && customers.length === 0 && (
          <p className="customer-message">
            No customers found.
          </p>
        )}

        {/* No search matches */}
        {!loading &&
          customers.length > 0 &&
          filteredCustomers.length === 0 && (
            <p className="customer-message">
              No matching customers found for "{searchTerm}".
            </p>
          )}

        {/* Customer table */}
        {!loading && filteredCustomers.length > 0 && (
          <>
            <p className="customer-search-results">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>

            <div className="customer-table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Account Number</th>
                    <th>Bank Name</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Transaction</th>
                    <th>Payment Date</th>
                    <th>Action</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const isEditing = editingId === customer.id;
                    const isStatusUpdating =
                      statusUpdatingId === customer.id;
                    const isDeleting = deletingId === customer.id;

                    return (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>

                        <td>
                          {renderInput(customer, "customer_name")}
                        </td>

                        <td>
                          {renderInput(customer, "phone_number", "tel")}
                        </td>

                        <td>
                          {renderInput(customer, "account_number")}
                        </td>

                        <td>
                          {renderInput(customer, "bank_name")}
                        </td>

                        <td>
                          {renderInput(customer, "amount", "number")}
                        </td>

                        <td>
                          {isEditing ? (
                            <select
                              className="customer-edit-input"
                              name="payment_method"
                              value={editForm.payment_method ?? ""}
                              onChange={handleChange}
                              required
                            >
                              {!PAYMENT_METHODS.includes(
                                editForm.payment_method
                              ) && editForm.payment_method && (
                                <option value={editForm.payment_method}>
                                  {editForm.payment_method}
                                </option>
                              )}

                              {PAYMENT_METHODS.map((method) => (
                                <option key={method} value={method}>
                                  {method}
                                </option>
                              ))}
                            </select>
                          ) : (
                            customer.payment_method || "-"
                          )}
                        </td>

                        <td>
                          <select
                            className="customer-status-select"
                            value={customer.transaction || "Pending"}
                            disabled={isStatusUpdating || isDeleting}
                            onChange={(e) =>
                              handleStatusChange(
                                customer,
                                e.target.value
                              )
                            }
                            aria-label={`Transaction status for ${customer.customer_name}`}
                          >
                            {!TRANSACTION_STATUSES.includes(
                              customer.transaction
                            ) && customer.transaction && (
                              <option value={customer.transaction}>
                                {customer.transaction}
                              </option>
                            )}

                            {TRANSACTION_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {isStatusUpdating && (
                            <small> Saving...</small>
                          )}
                        </td>

                        <td>
                          {renderInput(customer, "payment_date", "date")}
                        </td>

                        <td>
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="edit-btn"
                                onClick={handleSave}
                                disabled={saving}
                                title="Save changes"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>

                              <button
                                type="button"
                                className="delete-btn"
                                onClick={handleCancel}
                                disabled={saving}
                                title="Cancel editing"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => handleEdit(customer)}
                              disabled={
                                editingId !== null ||
                                isStatusUpdating ||
                                isDeleting
                              }
                              title="Edit customer"
                            >
                              Edit
                            </button>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(customer.id)}
                            disabled={
                              isEditing ||
                              saving ||
                              isDeleting ||
                              isStatusUpdating
                            }
                            title="Deactivate customer"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Customers;
