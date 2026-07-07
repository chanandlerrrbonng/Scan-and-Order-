export default function EmptyState() {
  return (
    <div className="menu-empty" role="status">
      <div className="menu-empty-emoji">🍽️</div>
      <p className="menu-empty-title">No dishes match your search</p>
      <p className="menu-empty-sub">Try a different keyword or clear your filters to see the full menu.</p>
    </div>
  );
}
