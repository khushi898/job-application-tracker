import { useState } from "react";
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [searchParams,setSearchParams]=useSearchParams();
  const [mode, setMode] = useState(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setSearchParams(nextMode === "signup" ? {mode: "signup"} : {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const accounts = JSON.parse(
        localStorage.getItem("jobTrackerDemoUsers") || "[]"
      );

      if (accounts.some((user) => user.email === cleanEmail)) {
        setError("This email is already registered.");
        return;
      }

      accounts.push({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: cleanEmail,
        password,
      });

      localStorage.setItem(
        "jobTrackerDemoUsers",
        JSON.stringify(accounts)
      );

      setMode("signin");
      setPassword("");
      setConfirmPassword("");
      setMessage("Account created! Please sign in.");
      return;
    }

    const accounts = JSON.parse(
      localStorage.getItem("jobTrackerDemoUsers") || "[]"
    );

    const validDemo =
      cleanEmail === "demo@jobtracker.com" &&
      password === "Demo123!";

    const validAccount = accounts.some(
      (user) =>
        user.email === cleanEmail &&
        user.password === password
    );

    if (!validDemo && !validAccount) {
      setError("Invalid email or password.");
      return;
    }

    sessionStorage.setItem("jobTrackerLoggedIn", "true");
    sessionStorage.setItem("jobTrackerUserEmail", cleanEmail);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">💼</div>

        <h1>
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="auth-subtitle">
          {mode === "signin"
            ? "Sign in to manage your career journey"
            : "Start tracking your next opportunity"}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <>
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="auth-password">Password</label>
          <div className="auth-password-field">
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-show-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {mode === "signup" && (
            <>
              <label htmlFor="auth-confirm">
                Confirm Password
              </label>
              <input
                id="auth-confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button type="submit" className="auth-submit">
            {mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              switchMode(mode === "signin" ? "signup" : "signin")
            }
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <p className="auth-demo">
          Demo: demo@jobtracker.com / Demo123!
        </p>

        <Link to="/dashboard" className="auth-back">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default Login;