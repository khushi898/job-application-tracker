import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplications } from "../context/ApplicationContext.jsx";
import "./AddApplication.css";

const initialForm = {
  company: "",
  jobTitle: "",
  location: "",
  dateApplied: "",
  status: "Applied",
  notes: "",
};

export default function AddApplication() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();

  const [form, setForm] = useState(initialForm);

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE APPLICATION
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.jobTitle.trim()) {
      alert("Company Name and Job Title are required.");
      return;
    }

    if (!form.dateApplied) {
      alert("Please select an application date.");
      return;
    }

    const newApplication = {
      ...form,
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      timeline: [],
    };

    // Save using Context API
    addApplication(newApplication);

    alert("Application saved successfully!");

    // Reset form
    setForm({ ...initialForm });

    // Navigate to My Applications
    navigate("/applications");
  };

  return (
    <main className="add-application-page">

      {/* PAGE HEADER */}
      <div className="add-application-header">
        <h1>Add New Application</h1>
        <p>
          Keep track of every opportunity in one place.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="add-application-card">
        <form
          onSubmit={handleSubmit}
          className="application-form"
        >

          {/* COMPANY NAME */}
          <div className="add-form-field">
            <label htmlFor="company">
              Company Name *
            </label>

            <input
              id="company"
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              required
            />
          </div>

          {/* JOB TITLE */}
          <div className="add-form-field">
            <label htmlFor="jobTitle">
              Job Title *
            </label>

            <input
              id="jobTitle"
              type="text"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Front-End Developer"
              required
            />
          </div>

          {/* LOCATION */}
          <div className="add-form-field">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. London, UK"
            />
          </div>

          {/* APPLICATION DATE */}
          <div className="add-form-field">
            <label htmlFor="dateApplied">
              Application Date *
            </label>

            <input
              id="dateApplied"
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              required
            />
          </div>

          {/* APPLICATION STATUS */}
          <div className="add-form-field full-width">
            <label htmlFor="status">
              Application Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Saved">
                Saved
              </option>

              <option value="Applied">
                Applied
              </option>

              <option value="Interview">
                Interview
              </option>

              <option value="Offer">
                Offer
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          {/* NOTES */}
          <div className="add-form-field full-width">
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add interview details, follow-up reminders, or other notes..."
              rows={4}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="add-form-actions">
            <button type="submit">
              Save Application →
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}