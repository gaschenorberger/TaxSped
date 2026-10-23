export default function PageTitle({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`page-head ${className}`}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="head-actions">{actions}</div>}
    </div>
  );
}
