import { useEffect, useState } from 'react';
import { adminApi } from './adminApi.js';

export default function AnalyticsAdmin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getAnalytics().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="admin-error-banner">{error}</p>;
  if (!data) return <p className="admin-loading">Loading analytics…</p>;

  const totalRevenue = data.branchRevenue.reduce((s, b) => s + (b.total_revenue || 0), 0);
  const totalOrders  = data.branchRevenue.reduce((s, b) => s + (b.active_order_count || 0), 0);

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-title">Analytics</h1>
        <p className="admin-subtitle">Active revenue across your branches.</p>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Active Revenue</p>
          <p className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Orders</p>
          <p className="stat-value">{totalOrders}</p>
        </div>
      </div>

      <h2 className="admin-section-title">By Branch</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Branch</th><th>Orders</th><th>Revenue</th><th>Avg Ticket</th></tr></thead>
          <tbody>
            {data.branchRevenue.map((b) => (
              <tr key={b.branch_id}>
                <td>{b.branch_name}</td>
                <td>{b.active_order_count}</td>
                <td>₹{Number(b.total_revenue).toLocaleString('en-IN')}</td>
                <td>₹{b.avg_ticket_size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="admin-section-title">Top Items</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Item</th><th>Units Sold</th><th>Revenue</th></tr></thead>
          <tbody>
            {data.topItems.map((t) => (
              <tr key={t.menu_item_id}>
                <td>{t.name}</td>
                <td>{t.units_sold}</td>
                <td>₹{Number(t.item_revenue).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
