import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function OfferStrip() {
  const { applyPromo } = useCart();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText('NOQS10').catch(() => {});
    applyPromo('NOQS10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="offer-strip" id="offers" aria-label="Current offers">
      <div className="offer-strip-inner">
        <article className="offer-card offer-card--gold">
          <p className="offer-label">🔥 Limited Time</p>
          <h2 className="offer-title">Meal for 2 @ ₹499</h2>
          <p className="offer-desc">Biryani + Starter + 2 Drinks</p>
          <button className="btn-offer">Grab Deal</button>
        </article>
        <article className="offer-card offer-card--purple">
          <p className="offer-label">🆕 Just Added</p>
          <h2 className="offer-title">Paneer Festival</h2>
          <p className="offer-desc">6 exclusive paneer dishes, weekends only</p>
          <button className="btn-offer">Explore →</button>
        </article>
        <article className="offer-card offer-card--dark">
          <p className="offer-label">📱 Scan & Save</p>
          <h2 className="offer-title">10% Off on App</h2>
          <p className="offer-desc">Use code NOQS10 at checkout</p>
          <button className="btn-offer" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </article>
      </div>
    </section>
  );
}
