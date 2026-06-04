export default function StepDetails({ details, onChange, onBack, onSubmit }) {
  const valid = details.name.trim().length >= 2 && /^\d{10}$/.test(details.phone);

  function handleSubmit(e) {
    e.preventDefault();
    if (valid) onSubmit();
  }

  return (
    <form className="checkout-pane" onSubmit={handleSubmit}>
      <h3>Your Details</h3>
      <label className="field">
        <span>Name</span>
        <input
          type="text"
          value={details.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Your full name"
          required
        />
      </label>
      <label className="field">
        <span>Phone</span>
        <input
          type="tel"
          inputMode="numeric"
          pattern="\d{10}"
          value={details.phone}
          onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          placeholder="10-digit phone number"
          required
        />
      </label>
      <label className="field">
        <span>Notes (optional)</span>
        <textarea
          rows="3"
          value={details.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Less spicy, extra raita, no onion…"
        />
      </label>
      <div className="checkout-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn-primary" disabled={!valid}>Place Order</button>
      </div>
    </form>
  );
}
