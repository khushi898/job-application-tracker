import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import ThemeToggle from "../components/layout/ThemeToggle.jsx";
import Button from "../components/ui/Button.jsx";
import FormField from "../components/ui/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Once login() updates Context this page re-renders and lands here.
  if (user) {
    const destination = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={destination} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Enter your name to continue.");
      return;
    }

    login(cleanName);
  }

  return (
    <main className="login-page">
      <ThemeToggle className="login-theme-toggle" />

      <div className="login-card">
        <span className="brand-icon brand-icon-lg">
          <BriefcaseBusiness size={26} aria-hidden="true" />
        </span>

        <h1>Welcome to JobTracker</h1>
        <p className="login-subtitle">
          Keep every application, interview and follow-up in one place.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-name"
            label="Your name"
            placeholder="e.g. Priya"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            error={error}
          />

          <Button type="submit" className="login-submit">
            Continue
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>

        <p className="login-note">
          Demo login: no password needed. Your data stays in this browser.
        </p>
      </div>
    </main>
  );
}

export default Login;
