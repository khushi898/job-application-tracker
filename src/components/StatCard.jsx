function StatCard({ title, value, icon, color = "#38bdf8" }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-icon" style={{ color }}>
          {icon}
        </span>
        <span className="stat-card-title">{title}</span>
      </div>

      <h2 className="stat-card-value">{value}</h2>
    </div>
  );
}

export default StatCard;