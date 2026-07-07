import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function Header({ searchQuery, onSearch, onOpenCart }) {
  const { totals } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="#FFD700"/>
              <path d="M9 12h4v4H9zM9 20h4v4H9zM17 12h4v4h-4zM23 12h4v4h-4zM17 20h10v4H17z" fill="#47128C"/>
              <path d="M23 20h4v-4h-4v4z" fill="#47128C" opacity="0.6"/>
            </svg>
          </span>
          <div className="brand-text">
            <span className="brand-name">NoQs</span>
            <span className="brand-tag">Scan &amp; Order</span>
          </div>
        </div>

        <nav className="site-nav" aria-label="Primary navigation">
          <ul role="list">
            <li><a href="#menu" className="nav-link active" aria-current="page">Menu</a></li>
            <li><a href="#offers" className="nav-link">Offers</a></li>
            <li><a href="#track" className="nav-link">Track Order</a></li>
            <li><a href="#help" className="nav-link">Help</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <form className="header-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="menu-search" className="sr-only">Search menu items</label>
            <span className="header-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              id="menu-search"
              type="search"
              className="header-search-input"
              placeholder="Search dishes…"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </form>

          <button
            className="btn-cart"
            aria-label={`View cart – ${totals.count} item${totals.count !== 1 ? 's' : ''}`}
            onClick={onOpenCart}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            {totals.count > 0 && <span className="cart-badge" aria-hidden="true">{totals.count}</span>}
          </button>

          <button
            className="btn-hamburger"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <nav
        className="mobile-nav"
        id="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        data-open={mobileOpen}
      >
        <ul role="list">
          <li><a href="#menu" className="nav-link active" onClick={() => setMobileOpen(false)}>Menu</a></li>
          <li><a href="#offers" className="nav-link" onClick={() => setMobileOpen(false)}>Offers</a></li>
          <li><a href="#track" className="nav-link" onClick={() => setMobileOpen(false)}>Track Order</a></li>
          <li><a href="#help" className="nav-link" onClick={() => setMobileOpen(false)}>Help</a></li>
        </ul>
      </nav>
    </header>
  );
}
