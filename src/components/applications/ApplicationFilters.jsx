import { STATUSES } from "../../utils/applications.js";

// A controlled component: the filter values live in the parent page (lifted
// state), because the page's results list needs to read them too.
function ApplicationFilters({ filters, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-control filter-control-grow">
        <label htmlFor="filter-search">Search</label>
        <input
          id="filter-search"
          type="search"
          placeholder="Company or job title..."
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
        />
      </div>

      <div className="filter-control">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-control">
        <label htmlFor="filter-sort">Sort by date</label>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(event) => onFilterChange("sort", event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  );
}

export default ApplicationFilters;
