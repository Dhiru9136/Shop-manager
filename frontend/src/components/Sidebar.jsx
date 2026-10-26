import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className="hamburger-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <h2 className="sidebar-title">Shop Manager</h2>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/customers"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            Customers
          </NavLink>

          {/* <NavLink
            to="/transactions"
            className="sidebar-link"
            onClick={closeSidebar}
            disable
          >
            Transactions
          </NavLink> */}

          <button
            type="button"
            className="sidebar-link sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;