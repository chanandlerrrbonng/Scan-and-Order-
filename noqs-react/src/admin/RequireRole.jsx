import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequireRole({ roles }) {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <div className="admin-loading">Checking access…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <div className="admin-denied">You don’t have permission to view this page.</div>;
  }
  return <Outlet />;
}
