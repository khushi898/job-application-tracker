import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChartNoAxesCombined, LogOut, LogIn, UserPlus } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn =
    sessionStorage.getItem("jobTrackerLoggedIn") === "true";

  const handleLogout = () => {
    sessionStorage.removeItem("jobTrackerLoggedIn");
    sessionStorage.removeItem("jobTrackerUserEmail");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <NavLink
        to={isLoggedIn ? "/dashboard" : "/login"}
        className="navbar-brand"
      >
        <span className="brand-icon">
          <ChartNoAxesCombined size={25} strokeWidth={2.3} />
        </span>

        <span className="brand-name">
          Job<span className="brand-accent">Tracker</span>
        </span>
      </NavLink>

      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/applications">Applications</NavLink>
            <NavLink to="/applications/new">Add Application</NavLink>
            <NavLink to="/explore-jobs">Explore Jobs</NavLink>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="navbar-signin"
            >
              <LogIn size={17} />
              Sign In
            </NavLink>

            <NavLink
              to="/login?mode=signup"
              className="navbar-signup"
            >
              <UserPlus size={17} />
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;