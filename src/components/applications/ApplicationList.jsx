import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge.jsx";

// A compact linked list for the dashboard. The parent decides what to show on
// the right of each row through getDetail, e.g. an applied or interview date.
function ApplicationList({ applications, getDetail }) {
  return (
    <ul className="application-list">
      {applications.map((application) => (
        <li key={application.id}>
          <Link to={`/applications/${application.id}`}>
            <span className="application-list-main">
              <strong>{application.jobTitle}</strong>
              <span>{application.company}</span>
            </span>
            <span className="application-list-detail">
              <StatusBadge status={application.status} />
              <span>{getDetail(application)}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ApplicationList;
