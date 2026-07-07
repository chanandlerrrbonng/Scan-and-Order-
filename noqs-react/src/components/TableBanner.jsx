export default function TableBanner({ kitchenOpen = true }) {
  return (
    <div className="table-banner" role="status" aria-live="polite">
      <div className="table-banner-inner">
        <span className="table-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Table 07
        </span>
        <span className="table-info">The Spice Garden &nbsp;·&nbsp; Puri Road, Bhubaneswar</span>
        <span className="table-status">
          <span className="status-dot" aria-hidden="true" style={{ background: kitchenOpen ? '#FFD700' : '#C0392B' }}></span>
          {kitchenOpen ? 'Kitchen Open' : 'Kitchen Offline'}
        </span>
      </div>
    </div>
  );
}
