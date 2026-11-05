import { useNavigate, useParams } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import ApplicationForm from "../components/applications/ApplicationForm.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Panel from "../components/ui/Panel.jsx";
import { useApplications } from "../hooks/useApplications.js";
import { todayISO } from "../utils/date.js";

// Handles both /applications/new and /applications/:id/edit.
function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, addApplication, updateApplication } = useApplications();

  const isEditing = id !== undefined;
  const application = applications.find((item) => String(item.id) === id);

  if (isEditing && !application) {
    return (
      <div className="panel">
        <EmptyState
          icon={FileQuestion}
          title="Application not found"
          message="It may have been deleted."
          action={<Button to="/applications">Back to applications</Button>}
        />
      </div>
    );
  }

  function handleSubmit(values) {
    if (isEditing) {
      updateApplication(application.id, values);
      navigate(`/applications/${application.id}`);
    } else {
      navigate(`/applications/${addApplication(values)}`);
    }
  }

  return (
    <>
      <PageHeader
        title={isEditing ? "Edit application" : "Add application"}
        subtitle={
          isEditing
            ? `${application.jobTitle} at ${application.company}`
            : "Keep track of every opportunity in one place."
        }
      />

      <Panel>
        {/* The key gives each application a fresh form with its own state. */}
        <ApplicationForm
          key={id ?? "new"}
          initialValues={isEditing ? application : { dateApplied: todayISO() }}
          submitLabel={isEditing ? "Save changes" : "Save application"}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
      </Panel>
    </>
  );
}

export default ApplicationFormPage;
