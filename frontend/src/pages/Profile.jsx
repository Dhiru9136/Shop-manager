
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { User_Data } from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await User_Data();

        // API response is an array, so get the first user.
        const user = Array.isArray(data) ? data[0] : data;

        if (!user) {
          throw new Error("Profile data not found.");
        }

        if (!cancelled) {
          setProfile(user);
        }
      } catch (err) {
        if (cancelled) return;

        const message = err.message || "Unable to load profile.";

        if (
          message.includes("401") ||
          message.toLowerCase().includes("unauthorized")
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");

          navigate("/login", { replace: true });
          return;
        }

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    navigate("/login", { replace: true });
  };

  const username =
    profile?.username ||
    localStorage.getItem("username") ||
    "User";

  const getInitial = (value) =>
    String(value || "U").charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <Navbar />
      <Sidebar />

      <main className="profile-container">
        <div className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>View your account information.</p>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {loading && (
          <div className="profile-message">
            Loading profile...
          </div>
        )}

        {error && !loading && (
          <div className="profile-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <section className="profile-card">
            <div className="profile-banner" />

            <div className="profile-user">
              <div className="profile-avatar">
                {getInitial(profile.username)}
              </div>

              <div className="profile-user-info">
                <h2>{username}</h2>
                <p>Customer Manager Account</p>
              </div>
            </div>

            <div className="profile-divider" />

            <h3>Personal Information</h3>

            <div className="profile-details-grid">
              <div className="profile-detail">
                <span>User ID</span>
                <strong>{profile.id ?? "-"}</strong>
              </div>

              <div className="profile-detail">
                <span>Username</span>
                <strong>{profile.username || "-"}</strong>
              </div>

              <div className="profile-detail">
                <span>First Name</span>
                <strong>{profile.first_name || "-"}</strong>
              </div>

              <div className="profile-detail">
                <span>Last Name</span>
                <strong>{profile.last_name || "-"}</strong>
              </div>

              <div className="profile-detail">
                <span>Email Address</span>
                <strong>{profile.email || "-"}</strong>
              </div>

              <div className="profile-detail">
                <span>Account Status</span>
                <strong
                  className={
                    profile.is_active
                      ? "profile-active"
                      : "profile-inactive"
                  }
                >
                  {profile.is_active ? "Active" : "Inactive"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Date Joined</span>
                <strong>
                  {profile.date_joined
                    ? new Date(profile.date_joined).toLocaleDateString()
                    : "-"}
                </strong>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Profile;
