import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-brand-mark">G</span>
          Gatherly
        </NavLink>

        <button
          className={`navbar-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-menu ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/" className="navbar-link" onClick={closeMenu} end>
            Events
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-registrations" className="navbar-link" onClick={closeMenu}>
              My Registrations
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/events/create" className="navbar-link" onClick={closeMenu}>
              Create Event
            </NavLink>
          )}

          <div className="navbar-divider" />

          {isAuthenticated ? (
            <div className="navbar-user">
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.name}</span>
                <span className={`badge ${isAdmin ? "badge-accent" : ""}`}>
                  {user.role}
                </span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth-actions">
              <NavLink to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;