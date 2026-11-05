function Panel({ title, action, className = "", children }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || action) && (
        <div className="panel-header">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}

      {children}
    </section>
  );
}

export default Panel;
