export default function ErrorState() {
  return (
    <div className="menu-error" role="alert">
      <div className="menu-error-emoji">⚠️</div>
      <p className="menu-error-title">Unable to load the menu</p>
      <p className="menu-error-sub">We could not reach the kitchen right now. Please check your connection and try again.</p>
    </div>
  );
}
