import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import TableBanner from './components/TableBanner.jsx';
import Hero from './components/Hero.jsx';
import FilterBar from './components/FilterBar.jsx';
import OfferStrip from './components/OfferStrip.jsx';
import Catalog from './components/Catalog.jsx';
import OrderTracker from './components/OrderTracker.jsx';
import Footer from './components/Footer.jsx';
import StickyCart from './components/StickyCart.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { useServerHealth } from './hooks/useServerHealth.js';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('popular');
  const [cartOpen, setCartOpen] = useState(false);

  // Ticket 611 Phase 2 – mount-time health check + cleanup
  const health = useServerHealth();

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onOpenCart={openCart}
      />
      <TableBanner kitchenOpen={health.kitchenOpen} />
      <Hero />

      <main id="main-content" className="main-content">
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <OfferStrip />
        <Catalog
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
      </main>

      <OrderTracker />
      <Footer />

      <StickyCart onOpenCart={openCart} />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}
