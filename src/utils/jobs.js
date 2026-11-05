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
  "machine learning",
  "cybersecurity",
  "programmer",
  "web development",
  "tech lead",
  "technical lead",
  "test automation",
];

export function isITJob(job) {
  const text = `${job.title || ""} ${job.category || ""}`.toLowerCase();

  return IT_KEYWORDS.some((word) => text.includes(word));
}

// These links come from an outside API, so only allow real web addresses.
export function isWebUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function formatLocation(locations) {
  if (locations.length === 0) return "Worldwide";
  if (locations.length <= 3) return locations.join(", ");

  return `${locations.slice(0, 3).join(", ")} +${locations.length - 3} more`;
}

function formatSalaryRange({ minSalary, maxSalary, currency, salaryPeriod }) {
  if (minSalary == null && maxSalary == null) return "";

  const format = (amount) => {
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const range =
    minSalary != null && maxSalary != null
      ? `${format(minSalary)} – ${format(maxSalary)}`
      : minSalary != null
        ? `From ${format(minSalary)}`
        : `Up to ${format(maxSalary)}`;

  return `${range} / ${salaryPeriod || "annual"}`;
}

export function formatJobType(type) {
  return (type || "Remote")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// The two APIs name their fields differently, so convert both to one shape.
export function normalizeRemotiveJob(job) {
  const location = job.candidate_required_location || "Worldwide";

  return {
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name,
    location,
    locationLabel: location,
    type: job.job_type,
    category: job.category,
    salary: job.salary || "",
    publishedAt: job.publication_date,
    url: job.url,
    source: "Remotive",
    sourceUrl: "https://remotive.com",
  };
}

export function normalizeHimalayasJob(job) {
  const locations = Array.isArray(job.locationRestrictions)
    ? job.locationRestrictions
        .map((item) =>
          typeof item === "string" ? item : item?.name || item?.country || ""
        )
        .filter(Boolean)
    : [];

  return {
    id: `himalayas-${job.guid}`,
    title: job.title,
    company: job.companyName,
    location: locations.join(", ") || "Worldwide",
    locationLabel: formatLocation(locations),
    type: job.employmentType,
    // Himalayas sends categories as slugs, like "Full-Stack-Engineer".
    category: (
      job.categories?.[0] ||
      job.parentCategories?.[0] ||
      "Software Development"
    ).replace(/-/g, " "),
    salary: formatSalaryRange(job),
    publishedAt: job.pubDate ? new Date(job.pubDate * 1000).toISOString() : null,
    url: job.applicationLink,
    source: "Himalayas",
    sourceUrl: "https://himalayas.app",
  };
}
