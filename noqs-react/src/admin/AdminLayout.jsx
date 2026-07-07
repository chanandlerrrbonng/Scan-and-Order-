import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-name">NoQs</span>
          <span className="brand-tag">Console</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/menu" className="admin-nav-link">Menu</NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link">Orders</NavLink>
          <NavLink to="/admin/inbox" className="admin-nav-link">Inbox</NavLink>
          {user?.role === 'owner' && (
            <NavLink to="/admin/analytics" className="admin-nav-link">Analytics</NavLink>
          )}
        </nav>
        <div className="admin-user">
          <span className="admin-user-name">{user?.name}</span>
          <span className="admin-user-role">{user?.role}</span>
          <button className="btn-secondary admin-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
