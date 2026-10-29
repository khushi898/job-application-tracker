import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  Link,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import StatCard from "./components/StatCard.jsx";
import AddApplication from "./pages/AddApplication.jsx";
import ExploreJobs from "./pages/ExploreJobs.jsx";
import ApplicationChart from "./components/ApplicationChart.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import {
  ApplicationProvider,
  useApplications,
} from "./context/ApplicationContext.jsx";

import "./App.css";

// DASHBOARD
function Dashboard() {
  const { applications } = useApplications();

  const savedJobs = applications.filter(
    (app) => app.status?.toLowerCase() === "saved"
  ).length;

  const totalApplications = applications.filter(
    (app) => app.status?.toLowerCase() !== "saved"
  ).length;

  const interviews = applications.filter(
    (app) => app.status?.toLowerCase() === "interview"
  ).length;

  const offers = applications.filter(
    (app) => app.status?.toLowerCase() === "offer"
  ).length;

  const rejected = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.dateApplied || 0) -
        new Date(a.dateApplied || 0)
    )
    .slice(0, 3);

  return (
    <main className="page">
      <h1>Dashboard</h1>

      <p>
        Welcome to JobTracker! Track your job applications,
        interviews, and career progress.
      </p>

      <div className="stats-grid">
        <StatCard
          title="Saved Jobs"
          value={savedJobs}
          icon="🔖"
        />

        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon="📋"
        />

        <StatCard
          title="Interviews"
          value={interviews}
          icon="📅"
        />

        <StatCard
          title="Offers"
          value={offers}
          icon="🎉"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon="❌"
        />
      </div>

      <ApplicationChart applications={applications} />

      {/* RECENT APPLICATIONS */}
      <section className="recent-applications-section">
        <h2 className="recent-applications-title">
          Recent Applications
        </h2>

        <div className="recent-applications-grid">
          {recentApplications.length === 0 ? (
            <p>No recent applications yet.</p>
          ) : (
            recentApplications.map((app) => (
              <div
                className="recent-application-card"
                key={app.id}
              >
                <h3>{app.jobTitle}</h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {app.company}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {app.location || "Remote"}
                </p>

                <span className="recent-status">
                  {app.status || "Applied"}
                </span>

                <Link
                  to={`/applications/${app.id}`}
                  className="recent-view-btn"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

// MY APPLICATIONS
function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    applications,
    updateApplication,
    deleteApplication,
  } = useApplications();

  const filteredApplications = applications.filter(
    (application) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        (application.company || "")
          .toLowerCase()
          .includes(search) ||
        (application.jobTitle || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        (application.status || "Applied").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    }
  );

  // UPDATE STATUS
  const handleStatusChange = (id, newStatus) => {
    updateApplication(id, {
      status: newStatus,
    });
  };

  // DELETE APPLICATION
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    deleteApplication(id);
  };

  return (
    <main className="page">
      <h1>My Applications</h1>

      <p>Manage all your job applications here.</p>

      <div className="applications-toolbar">
        <div className="applications-search">
          <input
            type="search"
            placeholder="Search by company or job title..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            aria-label="Search job applications"
          />
        </div>

        <div className="applications-filter">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            aria-label="Filter applications by status"
          >
            <option value="All">All Statuses</option>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <p className="applications-count">
        Showing {filteredApplications.length} of{" "}
        {applications.length} applications
      </p>

      {applications.length === 0 ? (
        <p>No applications saved yet.</p>
      ) : filteredApplications.length === 0 ? (
        <p>No applications match your search or filter.</p>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map((application) => (
            <div
              className="application-card"
              key={application.id}
            >
              <h2>{application.jobTitle}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {application.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.location}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {application.dateApplied}
              </p>

              <div className="status-field">
                <label
                  htmlFor={`status-${application.id}`}
                >
                  <strong>Status:</strong>
                </label>

                <select
                  id={`status-${application.id}`}
                  value={application.status || "Applied"}
                  onChange={(e) =>
                    handleStatusChange(
                      application.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <p>
                <strong>Notes:</strong>{" "}
                {application.notes || "No notes yet."}
              </p>

              <Link
                to={`/applications/${application.id}`}
                className="view-details-btn"
              >
                View Details
              </Link>

              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  handleDelete(application.id)
                }
              >
                Delete Application
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// APPLICATION DETAILS
function ApplicationDetails() {
  const { id } = useParams();

  const {
    applications,
    updateApplication,
  } = useApplications();

  const application = applications.find(
    (app) => String(app.id) === String(id)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState("");

  const [formData, setFormData] = useState(() => {
    const selected = applications.find(
      (app) => String(app.id) === String(id)
    );

    return {
      company: selected?.company || "",
      jobTitle: selected?.jobTitle || "",
      location: selected?.location || "",
      dateApplied: selected?.dateApplied || "",
      status: selected?.status || "Applied",
      notes: selected?.notes || "",
    };
  });

  // HANDLE FORM INPUTS
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // START EDITING
  const handleEdit = () => {
    if (!application) return;

    setFormData({
      company: application.company || "",
      jobTitle: application.jobTitle || "",
      location: application.location || "",
      dateApplied: application.dateApplied || "",
      status: application.status || "Applied",
      notes: application.notes || "",
    });

    setIsEditing(true);
  };

  // SAVE CHANGES USING CONTEXT API
  const handleSave = (e) => {
    e.preventDefault();

    if (
      !formData.company.trim() ||
      !formData.jobTitle.trim()
    ) {
      alert("Company and Job Title are required.");
      return;
    }

    updateApplication(id, {
      ...formData,
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
    });

    setIsEditing(false);
  };

  // CANCEL EDITING
  const handleCancel = () => {
    setIsEditing(false);
  };

  // ADD TIMELINE NOTE
  const handleAddTimelineNote = (e) => {
    e.preventDefault();

    const noteText = newNote.trim();

    if (!noteText || !application) return;

    const timelineEntry = {
      id: crypto.randomUUID(),
      text: noteText,
      createdAt: new Date().toISOString(),
    };

    const existingTimeline = Array.isArray(
      application.timeline
    )
      ? application.timeline
      : [];

    updateApplication(id, {
      timeline: [
        timelineEntry,
        ...existingTimeline,
      ],
    });

    setNewNote("");
  };

  // DELETE TIMELINE NOTE
  const handleDeleteTimelineNote = (noteId) => {
    const confirmed = window.confirm(
      "Delete this timeline note?"
    );

    if (!confirmed || !application) return;

    const existingTimeline = Array.isArray(
      application.timeline
    )
      ? application.timeline
      : [];

    updateApplication(id, {
      timeline: existingTimeline.filter(
        (note) => note.id !== noteId
      ),
    });
  };

  if (!application) {
    return (
      <main className="page">
        <h1>Application Not Found</h1>

        <p>This application could not be found.</p>

        <Link
          to="/applications"
          className="back-link"
        >
          Back to Applications
        </Link>
      </main>
    );
  }

  const timeline = Array.isArray(application.timeline)
    ? application.timeline
    : [];

  return (
    <main className="page">
      <Link
        to="/applications"
        className="back-link"
      >
        ← Back to Applications
      </Link>

      <h1>{application.jobTitle}</h1>

      <p>Application details and progress</p>

      <div className="application-details-card">
        {isEditing ? (
          <form
            className="application-edit-form"
            onSubmit={handleSave}
          >
            <h2>Edit Application</h2>

            <label htmlFor="edit-company">
              Company
            </label>

            <input
              id="edit-company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="edit-jobTitle">
              Job Title
            </label>

            <input
              id="edit-jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="edit-location">
              Location
            </label>

            <input
              id="edit-location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />

            <label htmlFor="edit-date">
              Date Applied
            </label>

            <input
              id="edit-date"
              type="date"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleInputChange}
            />

            <label htmlFor="edit-status">
              Status
            </label>

            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label htmlFor="edit-notes">
              Notes
            </label>

            <textarea
              id="edit-notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
            />

            <div className="edit-actions">
              <button
                type="submit"
                className="save-btn"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2>{application.company}</h2>

            <button
              type="button"
              className="edit-btn"
              onClick={handleEdit}
            >
              Edit Application
            </button>

            <p>
              <strong>Job Title:</strong>{" "}
              {application.jobTitle}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {application.location}
            </p>

            <p>
              <strong>Date Applied:</strong>{" "}
              {application.dateApplied}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {application.notes || "No notes yet."}
            </p>
          </>
        )}
      </div>

      {/* APPLICATION TIMELINE */}
      <section className="notes-timeline">
        <h2>Application Timeline</h2>

        <p>
          Record interview invitations, follow-ups,
          and other progress updates.
        </p>

        <form onSubmit={handleAddTimelineNote}>
          <label htmlFor="timeline-note">
            Add a progress update
          </label>

          <textarea
            id="timeline-note"
            placeholder="Example: Received interview invitation..."
            value={newNote}
            onChange={(e) =>
              setNewNote(e.target.value)
            }
            rows={3}
            required
          />

          <button
            type="submit"
            className="save-btn"
            disabled={!newNote.trim()}
          >
            Add Timeline Note
          </button>
        </form>

        <div className="timeline-list">
          {timeline.length === 0 ? (
            <p className="timeline-empty">
              No timeline updates yet.
            </p>
          ) : (
            timeline.map((note) => (
              <article
                key={note.id}
                className="timeline-entry"
              >
                <div className="timeline-entry-header">
                  <time dateTime={note.createdAt}>
                    {new Date(
                      note.createdAt
                    ).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>

                  <button
                    type="button"
                    className="timeline-delete-btn"
                    onClick={() =>
                      handleDeleteTimelineNote(note.id)
                    }
                  >
                    Delete
                  </button>
                </div>

                <p>{note.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

// MAIN APP
function App() {
  return (
    <ApplicationProvider>
      <Navbar />

      <Routes>
        {/* PUBLIC LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED PAGES */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/applications"
            element={<Applications />}
          />

          <Route
            path="/applications/new"
            element={<AddApplication />}
          />

          <Route
            path="/applications/:id"
            element={<ApplicationDetails />}
          />

          <Route
            path="/explore-jobs"
            element={<ExploreJobs />}
          />
        </Route>

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </ApplicationProvider>
  );
}

export default App;

