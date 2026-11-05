function StatusBadge({ status }) {
  return (
    <span className="status-badge" data-status={status}>
      {status}
    </span>
  );
}

export default StatusBadge;
