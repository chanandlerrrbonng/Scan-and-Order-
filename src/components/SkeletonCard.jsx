export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-block skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-block skeleton-line lg" />
        <div className="skeleton-block skeleton-line md" />
        <div className="skeleton-block skeleton-line sm" />
        <div className="skeleton-footer">
          <div className="skeleton-block skeleton-line" />
          <div className="skeleton-block skeleton-line" />
        </div>
      </div>
    </div>
  );
}
