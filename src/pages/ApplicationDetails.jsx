import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  FileQuestion,
  Pencil,
  Trash2,
} from "lucide-react";
import NotesTimeline from "../components/applications/NotesTimeline.jsx";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Panel from "../components/ui/Panel.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import StatusSelect from "../components/ui/StatusSelect.jsx";
import { useApplications } from "../hooks/useApplications.js";
import { formatDate } from "../utils/date.js";
import { isWebUrl } from "../utils/jobs.js";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, changeStatus, deleteApplication, addNote, deleteNote } =
    useApplications();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const application = applications.find((item) => String(item.id) === id);

  if (!application) {
    return (
      <div className="panel">
        <EmptyState
          icon={FileQuestion}
          title="Application not found"
          message="It may have been deleted, or the link is wrong."
          action={<Button to="/applications">Back to applications</Button>}
        />
      </div>
    );
  }

  function handleDelete() {
    deleteApplication(application.id);
    navigate("/applications", { replace: true });
  }

  return (
    <>
      <Link to="/applications" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to applications
      </Link>

      <PageHeader
        title={application.jobTitle}
        subtitle={application.company}
        action={
          <>
            <Button variant="secondary" to={`/applications/${application.id}/edit`}>
              <Pencil size={15} aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="danger-soft"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 size={15} aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />

      <div className="details-grid">
        <Panel title="Details" action={<StatusBadge status={application.status} />}>
          <dl className="details-list">
            <div>
              <dt>Location</dt>
              <dd>{application.location || "Not set"}</dd>
            </div>
            <div>
              <dt>Applied date</dt>
              <dd>{formatDate(application.dateApplied)}</dd>
            </div>
            {application.status === "Interview" && (
              <div>
                <dt>Interview date</dt>
                <dd>{formatDate(application.interviewDate)}</dd>
              </div>
            )}
            <div>
              <dt>Salary range</dt>
              <dd>{application.salaryRange || "Not set"}</dd>
            </div>
            <div className="details-list-full">
              <dt>Notes</dt>
              <dd>{application.notes || "No notes added."}</dd>
            </div>
          </dl>

          <StatusSelect
            id="details-status"
            label="Move to"
            value={application.status}
            onChange={(status) => changeStatus(application.id, status)}
          />

          {isWebUrl(application.jobUrl) && (
            <Button
              variant="secondary"
              size="sm"
              href={application.jobUrl}
              className="details-job-link"
            >
              View job posting
              <ExternalLink size={14} aria-hidden="true" />
            </Button>
          )}
        </Panel>

        <Panel title="Notes Timeline">
          <NotesTimeline
            notes={application.timeline || []}
            onAddNote={(text) => addNote(application.id, text)}
            onDeleteNote={(noteId) => deleteNote(application.id, noteId)}
          />
        </Panel>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this application?"
        message={`${application.jobTitle} at ${application.company} and its notes will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ApplicationDetails;
