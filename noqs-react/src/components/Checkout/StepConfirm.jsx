export default function StepConfirm({ orderId, totals, details, onFinish }) {
  return (
    <div className="checkout-pane checkout-done">
      <div className="confirm-emoji">🎉</div>
      <h3>Order Confirmed!</h3>
      <p>Thanks, <strong>{details.name}</strong>. Your order is being prepared.</p>
      <dl className="confirm-info">
        <div><dt>Order ID</dt><dd>{orderId}</dd></div>
        <div><dt>Total Paid</dt><dd>₹{totals.grandTotal}</dd></div>
        <div><dt>ETA</dt><dd>~15 minutes</dd></div>
      </dl>
      <button className="btn-primary" onClick={onFinish}>Done</button>
    </div>
  );
}
