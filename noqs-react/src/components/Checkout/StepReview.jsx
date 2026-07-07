export default function StepReview({ items, totals, onBack, onNext }) {
  return (
    <div className="checkout-pane">
      <h3>Review Your Order</h3>
      <ul className="review-list" role="list">
        {items.map((i) => (
          <li key={i.id}>
            <span>{i.emoji} {i.name} × {i.qty}</span>
            <strong>₹{i.price * i.qty}</strong>
          </li>
        ))}
      </ul>
      <p className="review-total">Total payable: <strong>₹{totals.grandTotal}</strong></p>
      <div className="checkout-actions">
        <button className="btn-secondary" onClick={onBack}>Back to Cart</button>
        <button className="btn-primary" onClick={onNext} disabled={items.length === 0}>Continue</button>
      </div>
    </div>
  );
}
