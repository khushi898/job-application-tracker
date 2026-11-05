import { useState } from "react";
import { STATUSES } from "../../utils/applications.js";
import { todayISO } from "../../utils/date.js";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";

const EMPTY_FORM = {
  company: "",
  jobTitle: "",
  location: "",
  status: "Applied",
  dateApplied: "",
  interviewDate: "",
  salaryRange: "",
  notes: "",
};

function validate(values) {
  const errors = {};

  if (!values.company.trim()) errors.company = "Enter the company name.";
  if (!values.jobTitle.trim()) errors.jobTitle = "Enter the job title.";

  // Only a saved job is allowed to have no applied date.
  if (values.status !== "Saved" && !values.dateApplied) {
    errors.dateApplied = "Enter the date you applied.";
  } else if (values.dateApplied > todayISO()) {
    errors.dateApplied = "The applied date can't be in the future.";
  }

  return errors;
}

// Used for both adding and editing. The page passes different starting values
// and a different onSubmit; the form's own typing state stays local.
function ApplicationForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...values,
      company: values.company.trim(),
      jobTitle: values.jobTitle.trim(),
      location: values.location.trim(),
      salaryRange: values.salaryRange.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="company"
        name="company"
        label="Company"
        placeholder="e.g. Northwind Labs"
        value={values.company}
        onChange={handleChange}
        error={errors.company}
        required
      />

      <FormField
        id="jobTitle"
        name="jobTitle"
        label="Role"
        placeholder="e.g. Front-End Developer"
        value={values.jobTitle}
        onChange={handleChange}
        error={errors.jobTitle}
        required
      />

      <FormField
        id="status"
        name="status"
        label="Status"
        as="select"
        value={values.status}
        onChange={handleChange}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </FormField>

      <FormField
        id="dateApplied"
        name="dateApplied"
        label="Applied date"
        type="date"
        max={todayISO()}
        value={values.dateApplied}
        onChange={handleChange}
        error={errors.dateApplied}
        required={values.status !== "Saved"}
      />

      {values.status === "Interview" && (
        <FormField
          id="interviewDate"
          name="interviewDate"
          label="Interview date"
          type="date"
          hint="Shows under Upcoming Interviews on your dashboard."
          value={values.interviewDate}
          onChange={handleChange}
        />
      )}

      <FormField
        id="salaryRange"
        name="salaryRange"
        label="Salary range"
        placeholder="e.g. ₹8–12 LPA"
        value={values.salaryRange}
        onChange={handleChange}
      />

      <FormField
        id="location"
        name="location"
        label="Location"
        placeholder="e.g. Remote"
        value={values.location}
        onChange={handleChange}
      />

      <FormField
        id="notes"
        name="notes"
        label="Notes"
        as="textarea"
        rows={4}
        className="field-full"
        placeholder="Referral, recruiter name, anything useful..."
        value={values.notes}
        onChange={handleChange}
      />

      <div className="form-actions field-full">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

export default ApplicationForm;
