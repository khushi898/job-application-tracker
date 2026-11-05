import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import ThemeToggle from "./ThemeToggle.jsx";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/applications/new", label: "Add Application" },
  { to: "/explore-jobs", label: "Explore Jobs" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <BriefcaseBusiness size={20} aria-hidden="true" />
          </span>
          <span>
            Job<span className="brand-accent">Tracker</span>
          </span>
        </NavLink>

        <button
          type="button"
          className="navbar-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div
          id="navbar-menu"
          className={`navbar-menu ${menuOpen ? "is-open" : ""}`.trim()}
        >
          <nav className="navbar-links" aria-label="Main">
            {NAV_LINKS.map((link) => (
              // `end` stops /applications staying active on /applications/new.
              <NavLink key={link.to} to={link.to} end onClick={closeMenu}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-user">
            <span className="navbar-name">Hi, {user.name}</span>
            <ThemeToggle />
            <button type="button" className="navbar-logout" onClick={logout}>
              <LogOut size={16} aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
