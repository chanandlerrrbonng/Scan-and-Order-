import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      // Role-aware redirect: staff/owner → admin, everyone else → storefront.
      if (user.role === 'owner' || user.role === 'staff') {
        navigate(from || '/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="brand-name">NoQs</span>
          <span className="brand-tag">Merchant Console</span>
        </div>
        <h1 className="login-title">Sign in</h1>
        {error && <p className="login-error" role="alert">{error}</p>}
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} autoComplete="username"
                 onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} autoComplete="current-password"
                 onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary login-submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in as staff / owner'}
        </button>

        <div className="login-divider"><span>or</span></div>

        <button type="button" className="btn-secondary login-guest"
                onClick={() => navigate('/')}>
          Continue as customer
        </button>
        <p className="login-guest-note">
          No account needed to browse and order — you’ll enter your details at checkout.
        </p>
      </form>
    </div>
  );
}
