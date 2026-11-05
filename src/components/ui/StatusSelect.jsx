import { STATUSES } from "../../utils/applications.js";

function StatusSelect({ id, label = "Status", value, onChange }) {
  return (
    <div className="status-select">
      <label htmlFor={id}>{label}</label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StatusSelect;
