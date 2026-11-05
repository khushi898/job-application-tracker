import { AuthContext } from "./contexts.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

function isValidUser(user) {
  return user === null || typeof user?.name === "string";
}

// A simple fake login: it only remembers a name. There are no passwords,
// so it gates the app for the demo but is not real security.
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("jobTrackerUser", null, isValidUser);

  function login(name) {
    setUser({ name });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
