import { useEffect, useState } from 'react';
import { adminApi } from './adminApi.js';

// Terminal success state in the DB is 'served'. We just label it nicely.
const NEXT_STATUS = {
  placed:    ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['served', 'cancelled'],
  served:    [],
  cancelled: []
};
const LABEL = {
  confirmed: 'Confirm',
  preparing: 'Start preparing',
  served: 'Mark delivered',
  cancelled: 'Cancel'
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  async function load() {
    try {
      setOrders(await adminApi.listOrders());
      setStatus('ready');
    } catch (e) { setError(e.message); setStatus('error'); }
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  async function advance(order, next) {
    setError('');
    try {
      await adminApi.advanceOrder(order.id, next);
      await load();
    } catch (e) { setError(e.message); }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-title">Orders</h1>
        <p className="admin-subtitle">Live order queue. Advance each through the kitchen flow.</p>
      </header>

      {error && <p className="admin-error-banner" role="alert">{error}</p>}
      {status === 'loading' && orders.length === 0 && <p className="admin-loading">Loading orders…</p>}

      <div className="order-cards">
        {orders.map((o) => (
          <article key={o.id} className={`order-card status-${o.status}`}>
            <header className="order-card-head">
              <span className="order-id">{o.id}</span>
              <span className={`status-chip status-${o.status}`}>
                {o.status === 'served' ? 'delivered' : o.status}
              </span>
            </header>
            <p className="order-customer">{o.customer?.name} · {o.customer?.phone}</p>
            <ul className="order-lines">
              {o.items.map((i) => (<li key={i.id}>{i.emoji} {i.name} × {i.qty}</li>))}
            </ul>
            <p className="order-total">Total: <strong>₹{o.totals?.grandTotal}</strong></p>
            <div className="order-actions">
              {(NEXT_STATUS[o.status] || []).map((next) => (
                <button key={next}
                  className={`btn-status${next === 'cancelled' ? ' danger' : ''}`}
                  onClick={() => advance(o, next)}>
                  {LABEL[next] || next}
                </button>
              ))}
            </div>
          </article>
        ))}
        {status === 'ready' && orders.length === 0 && <p className="admin-empty">No orders yet.</p>}
      </div>
    </section>
  );
}
