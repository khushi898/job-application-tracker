import { useEffect } from "react";
import { ThemeContext } from "./contexts.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

function isValidTheme(theme) {
  return theme === "light" || theme === "dark";
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    "jobTrackerTheme",
    getSystemTheme(),
    isValidTheme
  );

  // The <html> element is outside React, so an effect keeps it in sync.
  // index.css switches all its colours based on this attribute.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
