import {
  Banknote,
  BriefcaseBusiness,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  Plus,
} from "lucide-react";
import { formatJobType } from "../../utils/jobs.js";
import Button from "../ui/Button.jsx";

function JobCard({ job, isSaved, onSave }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <span className="job-card-avatar" aria-hidden="true">
          {(job.company || "J").slice(0, 1).toUpperCase()}
        </span>
        <span className="job-card-category">{job.category}</span>
      </div>

      <h3>{job.title}</h3>
      <p className="job-card-company">{job.company}</p>

      <ul className="meta-list">
        <li>
          <MapPin size={15} aria-hidden="true" />
          {job.locationLabel}
        </li>
        <li>
          <BriefcaseBusiness size={15} aria-hidden="true" />
          {formatJobType(job.type)}
        </li>
        {job.salary && (
          <li>
            <Banknote size={15} aria-hidden="true" />
            {job.salary}
          </li>
        )}
        {job.publishedAt && (
          <li>
            <Clock3 size={15} aria-hidden="true" />
            Posted{" "}
            {new Date(job.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </li>
        )}
      </ul>

      <div className="job-card-actions">
        <Button
          variant={isSaved ? "secondary" : "primary"}
          size="sm"
          disabled={isSaved}
          onClick={() => onSave(job)}
        >
          {isSaved ? (
            <>
              <Check size={15} aria-hidden="true" />
              In your tracker
            </>
          ) : (
            <>
              <Plus size={15} aria-hidden="true" />
              Save to my tracker
            </>
          )}
        </Button>

        <Button variant="secondary" size="sm" href={job.url}>
          View job
          <ExternalLink size={14} aria-hidden="true" />
        </Button>
      </div>

      <p className="job-card-source">
        Source:{" "}
        <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
          {job.source}
        </a>
      </p>
    </article>
  );
}

export default JobCard;
