import { useEffect, useState } from "react";

function readStoredValue(key, initialValue, isValid) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return initialValue;

    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : initialValue;
  } catch {
    // Corrupted JSON or blocked storage: fall back instead of crashing the app.
    return initialValue;
  }
}

// Works like useState, but the value survives a page refresh.
// isValid rejects stored data with the wrong shape (e.g. an edited value).
export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() =>
    readStoredValue(key, initialValue, isValid)
  );

  // Runs after every change to value, and again if the key ever changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: the app keeps working from memory.
    }
  }, [key, value]);

  return [value, setValue];
}
