import { useCart } from '../context/CartContext.jsx';

export default function StickyCart({ onOpenCart }) {
  const { totals } = useCart();
  if (totals.count === 0) return null;

  return (
    <div className="sticky-cart" role="complementary" aria-label="Cart summary">
      <div className="sticky-cart-inner">
        <div className="sticky-cart-info">
          <span className="sticky-cart-count">{totals.count} item{totals.count !== 1 ? 's' : ''}</span>
          <span className="sticky-cart-total">₹{totals.subtotal}</span>
        </div>
        <button className="btn-view-cart" aria-label="View full cart and proceed to checkout" onClick={onOpenCart}>
          View Cart &amp; Checkout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
