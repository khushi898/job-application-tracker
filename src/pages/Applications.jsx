import { useMemo, useState } from "react";
import { BriefcaseBusiness, Plus, SearchX } from "lucide-react";
import ApplicationCard from "../components/applications/ApplicationCard.jsx";
import ApplicationFilters from "../components/applications/ApplicationFilters.jsx";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useApplications } from "../hooks/useApplications.js";
import {
  DEFAULT_FILTERS,
  filterApplications,
} from "../utils/applications.js";

function Applications() {
  const { applications, changeStatus, deleteApplication } = useApplications();

  // Lifted state: ApplicationFilters edits these and the list below reads them,
  // so they live in this page, the closest parent of both.
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  // Skips re-sorting when only the delete dialog state changes.
  const visibleApplications = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters]
  );

  function handleFilterChange(name, value) {
    setFilters((previous) => ({ ...previous, [name]: value }));
  }

  function handleConfirmDelete() {
    deleteApplication(applicationToDelete.id);
    setApplicationToDelete(null);
  }

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Search, filter and move every application through your pipeline."
        action={
          <Button to="/applications/new">
            <Plus size={17} aria-hidden="true" />
            Add application
          </Button>
        }
      />

      {applications.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={BriefcaseBusiness}
            title="No applications yet"
            message="Add your first one, or find a role in Explore Jobs."
            action={
              <>
                <Button to="/applications/new">Add application</Button>
                <Button variant="secondary" to="/explore-jobs">
                  Explore jobs
                </Button>
              </>
            }
          />
        </div>
      ) : (
        <>
          <ApplicationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <p className="results-count" aria-live="polite">
            Showing {visibleApplications.length} of {applications.length}{" "}
            applications
          </p>

          {visibleApplications.length === 0 ? (
            <div className="panel">
              <EmptyState
                icon={SearchX}
                title="No applications match"
                message="Try another search or status."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Clear filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="card-grid">
              {visibleApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onStatusChange={changeStatus}
                  onDelete={setApplicationToDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={applicationToDelete !== null}
        title="Delete this application?"
        message={`${applicationToDelete?.jobTitle} at ${applicationToDelete?.company} and its notes will be permanently removed.`}
        onCancel={() => setApplicationToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default Applications;
