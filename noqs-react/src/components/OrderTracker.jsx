export default function OrderTracker() {
  return (
    <section className="order-track" id="track" aria-label="Track your order">
      <div className="order-track-inner">
        <h2 className="section-title">Your Order</h2>
        <div className="track-steps" role="list" aria-label="Order progress">
          <div className="track-step track-step--done" role="listitem">
            <div className="step-dot" aria-hidden="true">✓</div>
            <p className="step-label">Order Placed</p>
          </div>
          <div className="track-step track-step--done" role="listitem">
            <div className="step-dot" aria-hidden="true">✓</div>
            <p className="step-label">Confirmed</p>
          </div>
          <div className="track-step track-step--active" role="listitem">
            <div className="step-dot" aria-hidden="true">
              <span className="pulse-ring" aria-hidden="true"></span>
            </div>
            <p className="step-label">Preparing</p>
          </div>
          <div className="track-step" role="listitem">
            <div className="step-dot" aria-hidden="true"></div>
            <p className="step-label">Served</p>
          </div>
        </div>
        <p className="track-eta" aria-live="polite">Estimated time: <strong>~12 minutes</strong></p>
      </div>
    </section>
  );
}
