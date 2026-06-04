import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function CartSummary() {
  const { totals, promoCode, applyPromo } = useCart();
  const [code, setCode] = useState(promoCode || '');

  return (
    <div className="cart-summary">
      <div className="promo-row">
        <input
          type="text"
          className="promo-input"
          placeholder="Promo code (try NOQS10)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Promo code"
        />
        <button className="btn-apply" onClick={() => applyPromo(code)}>Apply</button>
      </div>

      <dl className="summary-list">
        <div><dt>Subtotal</dt><dd>₹{totals.subtotal}</dd></div>
        {totals.discount > 0 && (
          <div className="summary-discount"><dt>Discount</dt><dd>−₹{totals.discount}</dd></div>
        )}
        <div><dt>GST (5%)</dt><dd>₹{totals.tax}</dd></div>
        <div><dt>Service (5%)</dt><dd>₹{totals.service}</dd></div>
        <div><dt>Delivery</dt><dd>{totals.delivery === 0 ? 'Free' : `₹${totals.delivery}`}</dd></div>
        <div className="summary-total"><dt>Total</dt><dd>₹{totals.grandTotal}</dd></div>
      </dl>
    </div>
  );
}
