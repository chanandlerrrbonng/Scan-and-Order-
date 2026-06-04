import { useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import CartSummary from './CartSummary.jsx';
import CartItem from './CartItem.jsx';
import CheckoutFlow from './Checkout/CheckoutFlow.jsx';
import { useState } from 'react';

export default function CartDrawer({ open, onClose }) {
  const { items } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Cart">
        <header className="drawer-header">
          <h2>Your Cart</h2>
          <button className="drawer-close" aria-label="Close cart" onClick={onClose}>×</button>
        </header>

        {checkoutOpen ? (
          <CheckoutFlow onExit={() => setCheckoutOpen(false)} onDone={onClose} />
        ) : (
          <>
            <div className="drawer-body">
              {items.length === 0 ? (
                <p className="drawer-empty">Your cart is empty. Add something tasty!</p>
              ) : (
                <ul className="cart-items" role="list">
                  {items.map((item) => <CartItem key={item.id} item={item} />)}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="drawer-footer">
                <CartSummary />
                <button className="btn-primary checkout-btn" onClick={() => setCheckoutOpen(true)}>
                  Proceed to Checkout
                </button>
              </footer>
            )}
          </>
        )}
      </aside>
    </>
  );
}
