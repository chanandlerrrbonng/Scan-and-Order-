export default function Hero() {
  return (
    <section className="hero" aria-label="Today's featured offer">
      <div className="hero-content">
        <p className="hero-eyebrow">Today's Special</p>
        <h1 className="hero-title">Biryani &amp; Beyond</h1>
        <p className="hero-sub">Slow-cooked dum biryani, freshly baked rotis &amp; artisan desserts — all at your table in minutes.</p>
        <a href="#menu" className="btn-primary">Explore the Menu</a>
      </div>
      <figure className="hero-visual" aria-hidden="true">
        <div className="hero-plate">
          <div className="plate-ring ring-1"></div>
          <div className="plate-ring ring-2"></div>
          <div className="plate-center"><span>🍛</span></div>
        </div>
        <div className="floating-tag tag-1">Veg ✓</div>
        <div className="floating-tag tag-2">Chef's Pick ⭐</div>
        <div className="floating-tag tag-3">₹249</div>
      </figure>
    </section>
  );
}
