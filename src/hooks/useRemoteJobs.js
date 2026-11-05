import { useEffect, useState } from "react";
import {
  isITJob,
  isWebUrl,
  normalizeHimalayasJob,
  normalizeRemotiveJob,
} from "../utils/jobs.js";

const SEARCH_TERMS = [
  "software engineer",
  "react developer",
  "frontend developer",
  "full stack developer",
  "devops engineer",
];

// Kept outside the hook so leaving the page and coming back does not call the
// APIs again. A page refresh clears it, and so does the Refresh button.
let cachedJobs = null;

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchRemotiveJobs(signal) {
  const data = await fetchJson("https://remotive.com/api/remote-jobs", signal);

  return (data.jobs || []).filter(isITJob).map(normalizeRemotiveJob);
}

async function fetchHimalayasJobs(term, page, signal) {
  const params = new URLSearchParams({
    q: term,
    page: String(page),
    sort: "recent",
  });
  const data = await fetchJson(`/himalayas-api/search?${params}`, signal);

  return (Array.isArray(data.jobs) ? data.jobs : []).map(normalizeHimalayasJob);
}

async function loadAllJobs(signal) {
  const requests = [
    fetchRemotiveJobs(signal),
    ...SEARCH_TERMS.flatMap((term) =>
      [1, 2].map((page) => fetchHimalayasJobs(term, page, signal))
    ),
  ];

  // allSettled keeps the successful results when one source is down.
  const results = await Promise.allSettled(requests);
  const successful = results.filter((result) => result.status === "fulfilled");

  if (successful.length === 0) {
    throw new Error("All job sources failed");
  }

  const validJobs = successful
    .flatMap((result) => result.value)
    .filter((job) => job.id && job.title && isWebUrl(job.url));

  // The same job can match several searches. A Map keeps one copy per id.
  const uniqueJobs = [...new Map(validJobs.map((job) => [job.id, job])).values()];

  return uniqueJobs.sort(
    (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  );
}

export function useRemoteJobs() {
  const [jobs, setJobs] = useState(cachedJobs ?? []);
  const [loading, setLoading] = useState(cachedJobs === null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshKey === 0 && cachedJobs !== null) return undefined;

    const controller = new AbortController();

    loadAllJobs(controller.signal)
      .then((loadedJobs) => {
        if (controller.signal.aborted) return;

        cachedJobs = loadedJobs;
        setJobs(loadedJobs);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setError("We couldn't reach the job boards. Please try again.");
        setLoading(false);
      });

    // Cancels the requests if the user leaves the page before they finish.
    return () => controller.abort();
  }, [refreshKey]);

  function refresh() {
    setLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  }

  return { jobs, loading, error, refresh };
}
