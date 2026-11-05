import { Banknote, CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date.js";
import Button from "../ui/Button.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import StatusSelect from "../ui/StatusSelect.jsx";

// Only receives data and callbacks through props. The page decides what
// a status change or a delete actually does.
function ApplicationCard({ application, onStatusChange, onDelete }) {
  const { id, company, jobTitle, location, dateApplied, salaryRange, status } =
    application;

  return (
    <article className="application-card">
      <div className="application-card-top">
        <div>
          <h2>
            <Link to={`/applications/${id}`}>{jobTitle}</Link>
          </h2>
          <p className="application-card-company">{company}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <ul className="meta-list">
        <li>
          <MapPin size={15} aria-hidden="true" />
          {location || "Location not set"}
        </li>
        <li>
          <CalendarDays size={15} aria-hidden="true" />
          {dateApplied ? `Applied ${formatDate(dateApplied)}` : "Not applied yet"}
        </li>
        <li>
          <Banknote size={15} aria-hidden="true" />
          {salaryRange || "Salary not set"}
        </li>
      </ul>

      <StatusSelect
        id={`status-${id}`}
        label="Move to"
        value={status}
        onChange={(newStatus) => onStatusChange(id, newStatus)}
      />

      <div className="application-card-actions">
        <Button variant="secondary" size="sm" to={`/applications/${id}`}>
          View
        </Button>
        <Button variant="secondary" size="sm" to={`/applications/${id}/edit`}>
          <Pencil size={14} aria-hidden="true" />
          Edit
        </Button>
        <Button
          variant="danger-soft"
          size="sm"
          onClick={() => onDelete(application)}
        >
          <Trash2 size={14} aria-hidden="true" />
          Delete
        </Button>
      </div>
    </article>
  );
}

export default ApplicationCard;
