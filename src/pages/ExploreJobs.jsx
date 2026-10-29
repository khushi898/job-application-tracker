import { useEffect, useMemo, useState } from "react";

import {
  Search,
  MapPin,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  SlidersHorizontal,
  Globe2,
  Clock3,
  RefreshCw,
  X,
  Check,
} from "lucide-react";

import { useApplications } from "../context/ApplicationContext.jsx";

import "./ExploreJobs.css";

const IT_KEYWORDS = [
  "developer",
  "engineer",
  "software",
  "react",
  "frontend",
  "front-end",
  "front end",
  "backend",
  "back-end",
  "back end",
  "fullstack",
  "full-stack",
  "full stack",
  "devops",
  "cloud",
  "data scientist",
  "data engineer",
  "machine learning",
  "cybersecurity",
  "security engineer",
  "programmer",
  "web development",
  "technical lead",
  "tech lead",
  "qa engineer",
  "test automation",
];

const SEARCH_TERMS = [
  "software engineer",
  "react developer",
  "frontend developer",
  "full stack developer",
  "devops engineer",
];

function isITJob(job) {
  const text = `${job.title || ""} ${job.category || ""}`
    .toLowerCase();

  return IT_KEYWORDS.some((word) => text.includes(word));
}

function formatJobType(type) {
  return (type || "Remote")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSalary(job) {
  if (job.salary) return job.salary;

  if (job.minSalary == null && job.maxSalary == null) {
    return null;
  }

  const currency = job.currency || "USD";

  const format = (amount) => {
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const range =
    job.minSalary != null && job.maxSalary != null
      ? `${format(job.minSalary)} – ${format(job.maxSalary)}`
      : job.minSalary != null
      ? `From ${format(job.minSalary)}`
      : `Up to ${format(job.maxSalary)}`;

  return `${range} / ${job.salaryPeriod || "annual"}`;
}

function normalizeRemotive(job) {
  return {
    id: `remotive-${job.id}`,
    title: job.title,
    company_name: job.company_name,
    candidate_required_location:
      job.candidate_required_location || "Remote",
    job_type: job.job_type,
    category: job.category,
    salary: job.salary,
    publication_date: job.publication_date,
    url: job.url,
    source: "Remotive",
  };
}

function normalizeHimalayas(job) {
  const locations = Array.isArray(job.locationRestrictions)
    ? job.locationRestrictions
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.name || item?.country || ""
        )
        .filter(Boolean)
    : [];

  return {
    id: `himalayas-${job.guid}`,
    title: job.title,
    company_name: job.companyName,
    candidate_required_location:
      locations.join(", ") || "Worldwide",
    job_type: job.employmentType,
    category:
      job.categories?.[0] ||
      job.parentCategories?.[0] ||
      "Software Development",
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    currency: job.currency,
    salaryPeriod: job.salaryPeriod,
    publication_date: job.pubDate
      ? new Date(job.pubDate * 1000).toISOString()
      : null,
    url: job.applicationLink,
    source: "Himalayas",
  };
}

function ExploreJobs() {
  // CONTEXT API
  const { applications, addApplication } = useApplications();

  // PAGE STATE
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 12;

  // FETCH REMOTE IT JOBS
  useEffect(() => {
    const controller = new AbortController();

    async function fetchJobs() {
      setLoading(true);
      setError("");

      const collectedJobs = [];
      let successfulSources = 0;

      try {
        // SOURCE 1: REMOTIVE
        const remotiveRequest = fetch(
          "https://remotive.com/api/remote-jobs",
          { signal: controller.signal }
        ).then(async (response) => {
          if (!response.ok) {
            throw new Error("Remotive request failed");
          }

          const data = await response.json();

          successfulSources++;

          return (data.jobs || [])
            .filter(isITJob)
            .map(normalizeRemotive);
        });

        // SOURCE 2: HIMALAYAS
        const himalayasRequests = SEARCH_TERMS.flatMap(
          (term) =>
            [1, 2].map(async (page) => {
              const params = new URLSearchParams({
                q: term,
                page: String(page),
                sort: "recent",
              });

              const response = await fetch(
                `/himalayas-api/search?${params}`,
                { signal: controller.signal }
              );

              if (!response.ok) {
                throw new Error("Himalayas request failed");
              }

              const data = await response.json();

              return (
                Array.isArray(data.jobs) ? data.jobs : []
              ).map(normalizeHimalayas);
            })
        );

        const results = await Promise.allSettled([
          remotiveRequest,
          ...himalayasRequests,
        ]);

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            if (index > 0) successfulSources++;
            collectedJobs.push(...result.value);
          }
        });

        if (controller.signal.aborted) return;

        if (successfulSources === 0) {
          throw new Error("All job sources failed");
        }

        // REMOVE DUPLICATES
        const uniqueJobs = Array.from(
          new Map(
            collectedJobs
              .filter(
                (job) =>
                  job.id &&
                  job.title &&
                  job.url
              )
              .map((job) => [job.id, job])
          ).values()
        );

        // NEWEST JOBS FIRST
        uniqueJobs.sort(
          (a, b) =>
            new Date(b.publication_date || 0) -
            new Date(a.publication_date || 0)
        );

        setJobs(uniqueJobs);
      } catch (err) {
        if (
          err.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          setError(
            "Unable to load jobs. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchJobs();

    return () => controller.abort();
  }, [refreshKey]);

  // AVAILABLE CATEGORIES
  const categories = useMemo(
    () =>
      [
        ...new Set(
          jobs
            .map((job) => job.category)
            .filter(Boolean)
        ),
      ].sort(),
    [jobs]
  );

  // FILTER JOBS
  const filteredJobs = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    const place = location.toLowerCase().trim();

    return jobs.filter((job) => {
      const searchableText = `
        ${job.title || ""}
        ${job.company_name || ""}
        ${job.category || ""}
      `.toLowerCase();

      const jobLocation = (
        job.candidate_required_location || ""
      ).toLowerCase();

      return (
        searchableText.includes(search) &&
        (category === "all" ||
          job.category === category) &&
        jobLocation.includes(place)
      );
    });
  }, [jobs, searchTerm, category, location]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const startIndex = (currentPage - 1) * jobsPerPage;

  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, location]);

  // TRACK SAVED EXTERNAL JOBS
  const savedJobIds = useMemo(
    () =>
      new Set(
        applications
          .map((app) => app.externalJobId)
          .filter(Boolean)
      ),
    [applications]
  );

  // SAVE JOB USING CONTEXT API
  function handleSaveJob(job) {
    if (savedJobIds.has(job.id)) {
      alert("This job is already in My Applications.");
      return;
    }

    const newApplication = {
      id: crypto.randomUUID(),
      externalJobId: job.id,
      company: job.company_name || "",
      jobTitle: job.title || "",
      location:
        job.candidate_required_location || "Remote",
      status: "Saved",
      dateApplied: new Date()
        .toISOString()
        .slice(0, 10),
      notes: "",
      timeline: [],
      jobUrl: job.url,
      createdAt: new Date().toISOString(),
    };

    addApplication(newApplication);

    alert("Job added to My Applications!");
  }

  // CLEAR FILTERS
  function clearFilters() {
    setSearchTerm("");
    setCategory("all");
    setLocation("");
    setCurrentPage(1);
  }

  const hasFilters =
    searchTerm.trim() ||
    category !== "all" ||
    location.trim();

  return (
    <main className="explore-page">

      {/* HERO SECTION */}
      <section className="explore-hero">
        <div className="explore-hero-content">
          <span className="explore-eyebrow">
            <Globe2 size={16} />
            YOUR NEXT IT OPPORTUNITY STARTS HERE
          </span>

          <h1>
            Discover Your Next
            <span> Tech Career.</span>
          </h1>

          <p>
            Explore remote Front-End, React, Full-Stack,
            Software Engineering, DevOps, and other
            technology opportunities around the world.
          </p>

          <div className="explore-hero-stats">
            <div>
              <strong>{jobs.length}</strong>
              <span>Available IT jobs</span>
            </div>

            <div>
              <strong>
                {
                  new Set(
                    jobs.map((job) => job.company_name)
                  ).size
                }
              </strong>
              <span>Companies</span>
            </div>

            <div>
              <strong>{categories.length}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>

        <div className="explore-hero-decoration">
          <BriefcaseBusiness
            size={76}
            strokeWidth={1.4}
          />
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="explore-search-panel">
        <div className="explore-search-heading">
          <div>
            <h2>Find your perfect IT role</h2>
            <p>
              Search by technology, company, or location.
            </p>
          </div>

          <SlidersHorizontal size={22} />
        </div>

        <div className="explore-filters">
          <div className="explore-input-wrap">
            <Search size={19} />

            <input
              type="search"
              placeholder="React, Front-End, Software Engineer..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          <div className="explore-input-wrap">
            <MapPin size={19} />

            <input
              type="search"
              placeholder="Location..."
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <select
            className="explore-category-select"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="all">
              All IT Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            className="explore-clear-btn"
            onClick={clearFilters}
            type="button"
          >
            <X size={15} />
            Clear filters
          </button>
        )}
      </section>

      {/* JOB RESULTS */}
      <section className="explore-results-section">
        <div className="explore-results-header">
          <div>
            <h2>Latest IT Opportunities</h2>

            <p>
              {loading
                ? "Finding IT opportunities..."
                : `Showing ${filteredJobs.length} of ${jobs.length} jobs`}
            </p>
          </div>

          <button
            className="explore-refresh-btn"
            onClick={() =>
              setRefreshKey((key) => key + 1)
            }
            disabled={loading}
            type="button"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="explore-message">
            <RefreshCw
              className="explore-spin"
              size={28}
            />

            <h3>Loading IT opportunities...</h3>

            <p>
              Searching multiple remote job sources.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            className="explore-message"
            role="alert"
          >
            <h3>Unable to load jobs</h3>
            <p>{error}</p>

            <button
              className="explore-retry-btn"
              onClick={() =>
                setRefreshKey((key) => key + 1)
              }
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="explore-message">
              <Search size={32} />

              <h3>No matching IT jobs found</h3>

              <p>
                Try another keyword or clear your filters.
              </p>

              <button
                className="explore-retry-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* JOB CARDS */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="explore-jobs-grid">
              {paginatedJobs.map((job) => {
                const isSaved = savedJobIds.has(job.id);

                return (
                  <article
                    className="explore-job-card"
                    key={job.id}
                  >
                    <div className="explore-job-top">
                      <div className="explore-company-avatar">
                        {(job.company_name || "J")
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>

                      <span className="explore-remote-badge">
                        <Globe2 size={13} />
                        Remote
                      </span>
                    </div>

                    <h3>{job.title}</h3>

                    <div className="explore-company-name">
                      <Building2 size={16} />
                      <span>{job.company_name}</span>
                    </div>

                    <div className="explore-job-details">
                      <div>
                        <MapPin size={16} />
                        <span>
                          {job.candidate_required_location}
                        </span>
                      </div>

                      <div>
                        <BriefcaseBusiness size={16} />
                        <span>
                          {formatJobType(job.job_type)}
                        </span>
                      </div>

                      {formatSalary(job) && (
                        <div className="explore-salary">
                          <span>
                            {formatSalary(job)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="explore-job-bottom">
                      <span className="explore-job-category">
                        {job.category}
                      </span>

                      {job.publication_date && (
                        <span className="explore-job-date">
                          <Clock3 size={13} />
                          {new Date(
                            job.publication_date
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>

                    {/* EXTERNAL JOB LINK */}
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explore-view-job-btn"
                    >
                      View Opportunity
                      <ExternalLink size={16} />
                    </a>

                    {/* SAVE JOB */}
                    <button
                      type="button"
                      className="explore-save-job-btn"
                      disabled={isSaved}
                      onClick={() => handleSaveJob(job)}
                      style={
                        isSaved
                          ? {
                              opacity: 0.7,
                              cursor: "not-allowed",
                            }
                          : undefined
                      }
                    >
                      {isSaved ? (
                        <>
                          <Check size={16} />
                          Saved ✓
                        </>
                      ) : (
                        "+ Add to My Applications"
                      )}
                    </button>

                    {/* JOB SOURCE */}
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#898297",
                        margin: "10px 0 0",
                      }}
                    >
                      Source:{" "}
                      <a
                        href={
                          job.source === "Himalayas"
                            ? "https://himalayas.app"
                            : "https://remotive.com"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job.source}
                      </a>
                    </p>
                  </article>
                );
              })}
            </div>
          )}

        {/* PAGINATION */}
        {!loading &&
          !error &&
          totalPages > 1 && (
            <div className="explore-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
              >
                ← Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
              >
                Next →
              </button>
            </div>
          )}
      </section>
    </main>
  );
}

export default ExploreJobs;