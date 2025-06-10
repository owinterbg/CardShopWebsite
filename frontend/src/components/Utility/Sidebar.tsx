import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "relative",
        width: collapsed ? "60px" : "200px",
        background: "#f1f3f4",
        transition: "width 0.3s",
        height: "100vh",
        padding: "10px",
      }}
    >
      <button
        style={{
          background: "#ccc",
          border: "none",
          padding: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      {!collapsed && (
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/register">Register</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/compare">Compare Images</Link>
                </li>
                <li>
                  <Link to="/saved">Saved Centerings</Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <li>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
