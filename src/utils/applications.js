// "Saved" holds jobs from Explore Jobs that you have not applied to yet.
// The pipeline from the brief is Applied → Interview → Offer → Rejected.
export const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export const DEFAULT_FILTERS = {
  search: "",
  status: "All",
  sort: "newest",
};

export function getDashboardStats(applications) {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));

  applications.forEach((application) => {
    if (application.status in counts) counts[application.status] += 1;
  });

  // Saved jobs were never sent, so they cannot count towards a response.
  const applied = applications.length - counts.Saved;
  const responded = counts.Interview + counts.Offer + counts.Rejected;

  return {
    counts,
    applied,
    responded,
    responseRate: applied === 0 ? 0 : Math.round((responded / applied) * 100),
  };
}

// Interviews from today onwards, soonest first. Interviews without a date go
// last so they still show up as something to follow up on.
export function getUpcomingInterviews(applications, today) {
  return applications
    .filter(
      (application) =>
        application.status === "Interview" &&
        (!application.interviewDate || application.interviewDate >= today)
    )
    .sort((a, b) => {
      if (!a.interviewDate) return 1;
      if (!b.interviewDate) return -1;
      return a.interviewDate.localeCompare(b.interviewDate);
    });
}

// Applications without a date (saved jobs) always go last.
export function sortByDate(applications, sort = "newest") {
  return [...applications].sort((a, b) => {
    if (!a.dateApplied) return 1;
    if (!b.dateApplied) return -1;

    return sort === "newest"
      ? b.dateApplied.localeCompare(a.dateApplied)
      : a.dateApplied.localeCompare(b.dateApplied);
  });
}

export function filterApplications(applications, { search, status, sort }) {
  const query = search.trim().toLowerCase();

  const matches = applications.filter((application) => {
    const matchesSearch =
      (application.company || "").toLowerCase().includes(query) ||
      (application.jobTitle || "").toLowerCase().includes(query);
    const matchesStatus = status === "All" || application.status === status;

    return matchesSearch && matchesStatus;
  });

  return sortByDate(matches, sort);
}
