import { useEffect, useState } from 'react';
import { adminApi } from './adminApi.js';

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // id currently being edited
  const [draft, setDraft] = useState({ price: '', stockCount: '' });

  async function load() {
    setStatus('loading');
    setError('');
    try {
      const data = await adminApi.getMenu();
      setItems(data);
      setStatus('ready');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }
  useEffect(() => { load(); }, []);

  async function toggle(item) {
    // optimistic UI
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, available: !i.available } : i));
    try {
      await adminApi.setAvailability(item.id, !item.available);
      // reload so stock/availability stay perfectly in sync with the server
      await load();
    } catch (e) {
      setError(e.message);
      load(); // rollback via refetch
    }
  }

  function startEdit(item) {
    setEditing(item.id);
    setDraft({
      price: String(item.price ?? ''),
      stockCount: String(item.stockCount ?? '')
    });
    setError('');
  }

  function cancelEdit() {
    setEditing(null);
    setDraft({ price: '', stockCount: '' });
  }

  async function saveEdit(item) {
    setError('');
    const price = Number(draft.price);
    const stockCount = parseInt(draft.stockCount, 10);

    if (Number.isNaN(price) || price < 0) { setError('Price must be a non-negative number.'); return; }
    if (!Number.isInteger(stockCount) || stockCount < 0) { setError('Quantity must be a non-negative whole number.'); return; }

    try {
      // Update price/details via PUT, and stock via the dedicated stock route.
      if (price !== item.price) {
        await adminApi.updateItem(item.id, { price });
      }
      if (stockCount !== item.stockCount) {
        await adminApi.setStock(item.id, stockCount); // auto-flips availability at 0
      }
      cancelEdit();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) { setError(e.message); }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-title">Menu &amp; Inventory</h1>
        <p className="admin-subtitle">Edit prices and quantities, toggle availability. Sold-out items disappear from the storefront automatically.</p>
      </header>

      {error && <p className="admin-error-banner" role="alert">{error}</p>}
      {status === 'loading' && <p className="admin-loading">Loading menu…</p>}

      {status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th><th>Category</th><th>Price</th><th>Quantity</th><th>Available</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editing === item.id;
                return (
                  <tr key={item.id} className={item.available ? '' : 'row-unavailable'}>
                    <td><span className="cell-emoji">{item.emoji}</span> {item.name}</td>
                    <td>{item.category}</td>

                    <td>
                      {isEditing ? (
                        <input
                          className="admin-input admin-input-sm"
                          type="number" min="0" step="1"
                          value={draft.price}
                          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                        />
                      ) : (
                        <>₹{item.price}</>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          className="admin-input admin-input-sm"
                          type="number" min="0" step="1"
                          value={draft.stockCount}
                          onChange={(e) => setDraft((d) => ({ ...d, stockCount: e.target.value }))}
                        />
                      ) : (
                        <span className={item.stockCount === 0 ? 'stock-zero' : ''}>
                          {item.stockCount ?? '—'}
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        className={`toggle-pill${item.available ? ' on' : ''}`}
                        aria-pressed={item.available}
                        onClick={() => toggle(item)}
                        disabled={isEditing}
                      >
                        {item.available ? 'Available' : 'Sold out'}
                      </button>
                    </td>

                    <td className="admin-actions">
                      {isEditing ? (
                        <>
                          <button className="btn-link" onClick={() => saveEdit(item)}>Save</button>
                          <button className="btn-link" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-link" onClick={() => startEdit(item)}>Edit</button>
                          <button className="btn-link danger" onClick={() => remove(item)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
