import { memo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

function HighlightedText({ text, query }) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts = [];
  let cursor = 0;
  let idx;
  while ((idx = lower.indexOf(q, cursor)) !== -1) {
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(<mark className="search-hit" key={idx}>{text.slice(idx, idx + q.length)}</mark>);
    cursor = idx + q.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function Badge({ type }) {
  const map = {
    veg:    { cls: 'badge--veg',    label: '🟢 Veg',         aria: 'Vegetarian' },
    nonveg: { cls: 'badge--nonveg', label: '🔴 Non-Veg',     aria: 'Non-vegetarian' },
    hot:    { cls: 'badge--hot',    label: '🔥 Best',        aria: 'Bestseller' },
    chef:   { cls: 'badge--chef',   label: "👨‍🍳 Chef's Pick", aria: "Chef's pick" }
  };
  const m = map[type];
  if (!m) return <span className="badge">{type}</span>;
  return <span className={`badge ${m.cls}`} aria-label={m.aria}>{m.label}</span>;
}

function ProductCard({ item, searchQuery, onAdd }) {
  const [wishlist, setWishlist] = useLocalStorage('noqs:wishlist', []);
  const isWished = wishlist.includes(item.id);
  const [added, setAdded] = useState(false);

  function toggleWishlist() {
    setWishlist((prev) =>
      prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
    );
  }

  function handleAdd() {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article
      className={`product-card${item.featured ? ' product-card--featured' : ''}`}
      role="listitem"
      data-id={item.id}
    >
      <div className="card-image-wrap">
        <figure className="card-image" aria-label={item.name}>
          <span className="food-emoji" aria-hidden="true">{item.emoji || '🍽️'}</span>
        </figure>

        {item.badges?.length > 0 && (
          <div className="card-badges">
            {item.badges.map((b) => <Badge key={b} type={b} />)}
          </div>
        )}

        <button
          className="btn-wishlist"
          aria-label={`${isWished ? 'Remove from' : 'Add to'} wishlist: ${item.name}`}
          aria-pressed={isWished}
          onClick={toggleWishlist}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              fill={isWished ? '#e11d48' : 'none'}
              stroke={isWished ? '#e11d48' : 'currentColor'}
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div className="card-body">
        <header className="card-header">
          <h3 className="card-name"><HighlightedText text={item.name} query={searchQuery} /></h3>
          <p className="card-desc">{item.desc}</p>
        </header>

        <div className="card-meta">
          <span className="card-prep" aria-label={`Preparation time: ${item.prep} minutes`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {' '}{item.prep} min
          </span>
          <span className="card-rating" aria-label={`Rating: ${item.rating} out of 5`}>★ {item.rating}</span>
        </div>

        <footer className="card-footer">
          <div className="card-price">
            <span className="price-current" aria-label={`Price: ₹${item.price}`}>₹{item.price}</span>
            {item.oldPrice && (
              <span className="price-old" aria-label={`Original price: ₹${item.oldPrice}`}>₹{item.oldPrice}</span>
            )}
          </div>
          <button
            className="btn-add"
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAdd}
            disabled={added}
            style={added ? { background: '#1A8C47' } : undefined}
          >
            {added ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {' '}Added!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {' '}Add
              </>
            )}
          </button>
        </footer>
      </div>
    </article>
  );
}

// memoised to avoid re-rendering every card when only one item's state changes
export default memo(ProductCard);
