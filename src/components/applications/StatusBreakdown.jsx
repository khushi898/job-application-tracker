import { STATUSES } from "../../utils/applications.js";

// Simple bars built with CSS. Each row is labelled, so nothing relies on colour.
function StatusBreakdown({ counts, total }) {
  return (
    <ul className="breakdown">
      {STATUSES.map((status) => {
        const count = counts[status];
        const percent = total === 0 ? 0 : Math.round((count / total) * 100);

        return (
          <li key={status} className="breakdown-row">
            <span className="breakdown-label">{status}</span>
            <span className="breakdown-track">
              <span className="breakdown-bar" style={{ width: `${percent}%` }} />
            </span>
            <span className="breakdown-value">
              {count} <small>({percent}%)</small>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default StatusBreakdown;
