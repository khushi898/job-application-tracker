// `status` gives the icon its pipeline colour. Without it, the accent is used.
function StatCard({ title, value, icon: Icon, status, hint }) {
  return (
    <div className="stat-card" data-status={status}>
      <span className="stat-card-icon">
        <Icon size={20} aria-hidden="true" />
      </span>

      <p className="stat-card-title">{title}</p>
      <p className="stat-card-value">{value}</p>
      {hint && <p className="stat-card-hint">{hint}</p>}
    </div>
  );
}

export default StatCard;
