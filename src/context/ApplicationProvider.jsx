import { ApplicationContext } from "./contexts.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { todayISO } from "../utils/date.js";

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useLocalStorage(
    "jobApplications",
    [],
    Array.isArray
  );

  function updateApplication(id, changes) {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id ? { ...application, ...changes } : application
      )
    );
  }

  // Returns the new id so the caller can open the new application's page.
  function addApplication(fields) {
    const id = crypto.randomUUID();

    setApplications((previous) => [
      ...previous,
      { timeline: [], ...fields, id, createdAt: new Date().toISOString() },
    ]);

    return id;
  }

  function deleteApplication(id) {
    setApplications((previous) =>
      previous.filter((application) => application.id !== id)
    );
  }

  // A saved job has no applied date until it leaves "Saved", so set it here.
  function changeStatus(id, status) {
    setApplications((previous) =>
      previous.map((application) => {
        if (application.id !== id) return application;

        const dateApplied =
          application.dateApplied || (status === "Saved" ? "" : todayISO());

        return { ...application, status, dateApplied };
      })
    );
  }

  function addNote(id, text) {
    const note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };

    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? { ...application, timeline: [note, ...(application.timeline || [])] }
          : application
      )
    );
  }

  function deleteNote(id, noteId) {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? {
              ...application,
              timeline: (application.timeline || []).filter(
                (note) => note.id !== noteId
              ),
            }
          : application
      )
    );
  }

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        changeStatus,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
