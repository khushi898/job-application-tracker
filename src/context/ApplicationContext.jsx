import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Create application context
const ApplicationContext = createContext(null);

// Read existing saved applications
function loadApplications() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("jobApplications") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Context Provider
export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState(
    loadApplications
  );

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(
      "jobApplications",
      JSON.stringify(applications)
    );
  }, [applications]);

  // Add a new application
  const addApplication = (application) => {
    setApplications((previous) => [
      ...previous,
      application,
    ]);
  };

  // Update an existing application
  const updateApplication = (id, changes) => {
    setApplications((previous) =>
      previous.map((app) =>
        String(app.id) === String(id)
          ? { ...app, ...changes }
          : app
      )
    );
  };

  // Delete an application
  const deleteApplication = (id) => {
    setApplications((previous) =>
      previous.filter(
        (app) => String(app.id) !== String(id)
      )
    );
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

// Custom hook
export function useApplications() {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplications must be used inside ApplicationProvider"
    );
  }

  return context;
}