export default function Logo({ compact = false, tagline = false }) {
  return (
    <div className={`logo ${compact ? 'compact' : ''}`}>
      <span className="logo-image">
        <img src="/assets/logoTaxSped_semFundo.png" alt="" />
      </span>
      <div>
        <strong>TaxSped</strong>
        {tagline && <small>Conversão sem complicação</small>}
      </div>
    </div>
  );
}
