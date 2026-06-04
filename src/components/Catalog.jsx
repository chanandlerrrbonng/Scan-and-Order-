import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorState from './ErrorState.jsx';
import { fetchMenu } from '../data/menuService.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useCart } from '../context/CartContext.jsx';

export default function Catalog({ searchQuery, activeCategory, sortOption, onSortChange }) {
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [fromCache, setFromCache] = useState(false);
  const { addItem } = useCart();

  const debouncedQuery = useDebounce(searchQuery, 250);

  // Mount-time data fetch with cleanup via AbortController (Ticket 611 Phase 2)
  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetchMenu({ signal: controller.signal })
      .then(({ data, fromCache }) => {
        setMenu(data);
        setFromCache(fromCache);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setStatus('error');
      });
    return () => controller.abort();
  }, []);

  // Derived list — recompute only when relevant inputs change
  const visibleItems = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let result = menu.filter((item) => {
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (q && !item.name.toLowerCase().includes(q) &&
              !item.category.toLowerCase().includes(q)) return false;
      return true;
    });

    switch (sortOption) {
      case 'price-asc':  result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'veg':        result = result.filter((i) => i.veg).sort((a, b) => b.popularity - a.popularity); break;
      case 'popular':
      default:           result = [...result].sort((a, b) => b.popularity - a.popularity);
    }
    return result;
  }, [menu, debouncedQuery, activeCategory, sortOption]);

  const counterText =
    status === 'loading' ? 'Loading menu…' :
    status === 'error'   ? 'Menu unavailable' :
    visibleItems.length === 0 ? 'No items found' :
    `Showing ${visibleItems.length} ${visibleItems.length === 1 ? 'item' : 'items'}${fromCache ? ' (offline cache)' : ''}`;

  return (
    <section className="catalog" id="menu" aria-label="Menu catalog">
      <div className="catalog-header">
        <div className="catalog-heading-group">
          <h2 className="catalog-title">Full Menu</h2>
          <p className="result-counter" aria-live="polite" aria-atomic="true">{counterText}</p>
        </div>
        <div className="catalog-controls">
          <label htmlFor="sort-select" className="sr-only">Sort items by</label>
          <select
            id="sort-select"
            className="sort-select"
            aria-label="Sort menu items"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="popular">Popular First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="veg">Veg Only</option>
          </select>
        </div>
      </div>

      <div className="product-grid" role="list" aria-busy={status === 'loading'}>
        {status === 'loading' &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {status === 'error' && <ErrorState />}

        {status === 'ready' && visibleItems.length === 0 && <EmptyState />}

        {status === 'ready' && visibleItems.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            searchQuery={debouncedQuery}
            onAdd={addItem}
          />
        ))}
      </div>
    </section>
  );
}
