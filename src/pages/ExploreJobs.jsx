import { useMemo, useState } from "react";
import { CloudOff, RefreshCw, SearchX } from "lucide-react";
import JobCard from "../components/jobs/JobCard.jsx";
import JobCardSkeleton from "../components/jobs/JobCardSkeleton.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { useApplications } from "../hooks/useApplications.js";
import { useRemoteJobs } from "../hooks/useRemoteJobs.js";

const JOBS_PER_PAGE = 12;
const SKELETON_IDS = ["a", "b", "c", "d", "e", "f"];
const DEFAULT_FILTERS = { search: "", location: "", category: "All" };

function ExploreJobs() {
  const { applications, addApplication } = useApplications();
  const { jobs, loading, error, refresh } = useRemoteJobs();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(),
    [jobs]
  );

  // The list can hold hundreds of jobs, so only re-filter when jobs or filters
  // change, not when the page number or saved jobs change.
  const filteredJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();

    return jobs.filter(
      (job) =>
        `${job.title} ${job.company} ${job.category}`
          .toLowerCase()
          .includes(search) &&
        job.location.toLowerCase().includes(location) &&
        (filters.category === "All" || job.category === filters.category)
    );
  }, [jobs, filters]);

  const savedJobIds = new Set(
    applications.map((application) => application.externalJobId).filter(Boolean)
  );

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  // A refresh can return fewer jobs, so never stay past the last page.
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const visibleJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({ ...previous, [name]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveJob(job) {
    addApplication({
      externalJobId: job.id,
      company: job.company || "",
      jobTitle: job.title,
      location: job.locationLabel,
      status: "Saved",
      dateApplied: "",
      interviewDate: "",
      salaryRange: job.salary,
      notes: "",
      jobUrl: job.url,
    });
  }

  return (
    <>
      <PageHeader
        title="Explore Jobs"
        subtitle="Live remote tech roles. Save the good ones to your tracker."
        action={
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            <RefreshCw
              size={16}
              className={loading ? "spin" : undefined}
              aria-hidden="true"
            />
            Refresh
          </Button>
        }
      />

      <div className="filter-bar">
        <div className="filter-control filter-control-grow">
          <label htmlFor="jobs-search">Search</label>
          <input
            id="jobs-search"
            name="search"
            type="search"
            placeholder="React, company, category..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="jobs-location">Location</label>
          <input
            id="jobs-location"
            name="location"
            type="search"
            placeholder="e.g. India"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="jobs-category">Category</label>
          <select
            id="jobs-category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="card-grid" role="status" aria-label="Loading jobs">
          {SKELETON_IDS.map((id) => (
            <JobCardSkeleton key={id} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="panel" role="alert">
          <EmptyState
            icon={CloudOff}
            title="Couldn't load jobs"
            message={error}
            action={<Button onClick={refresh}>Try again</Button>}
          />
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="panel">
          <EmptyState
            icon={SearchX}
            title="No matching jobs"
            message="Try another keyword or clear your filters."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <>
          <p className="results-count" aria-live="polite">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>

          <div className="card-grid">
            {visibleJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.has(job.id)}
                onSave={handleSaveJob}
              />
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}

export default ExploreJobs;
