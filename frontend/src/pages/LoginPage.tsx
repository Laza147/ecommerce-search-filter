import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import shiroImg from '../assets/shiro.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = isRegister
        ? await registerApi(name, email, password)
        : await loginApi(email, password);

      login(token);
      navigate('/');
    } catch {
      setError(isRegister ? 'Registration failed' : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      {/* 🔷 TOP-LEFT BRAND */}
      <div style={brand}>
        Shiro<span style={{ color: '#fbbf24' }}>Mart</span>
      </div>

      {/* 🟦 LOGIN CARD */}
      <div style={card}>
        <h2 style={title}>{isRegister ? 'Create account' : 'Login'}</h2>

        {isRegister && (
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        {error && <div style={errorText}>{error}</div>}

        <button onClick={submit} disabled={loading} style={button}>
          {loading
            ? 'Please wait…'
            : isRegister
            ? 'Create account'
            : 'Login'}
        </button>

        <div style={toggle}>
          {isRegister ? 'Already have an account?' : 'New to ShiroMart?'}{' '}
          <span onClick={() => setIsRegister(!isRegister)} style={toggleLink}>
            {isRegister ? 'Login' : 'Create one'}
          </span>
        </div>
      </div>

      {/* 🐶 BOTTOM ILLUSTRATION */}
      <img
  src={shiroImg}
  alt="Shiro"
  style={illustration}
  onError={(e) => {
    (e.currentTarget as HTMLImageElement).style.display = 'none';
  }}
/>
    </div>
  );
};

/* ───────────────────────── STYLES ───────────────────────── */

const page: React.CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top, #0f172a 0%, #020617 55%, #020617 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const brand: React.CSSProperties = {
  position: 'absolute',
  top: '1.5rem',
  left: '2rem',
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#e5e7eb',
  letterSpacing: '0.4px',
};

const card: React.CSSProperties = {
  width: 360,
  padding: '1.75rem',
  borderRadius: 14,
  background: 'rgba(2,6,23,0.96)',
  boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backdropFilter: 'blur(6px)',
};

const title: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '1.25rem',
  fontSize: '1.15rem',
};

const input: React.CSSProperties = {
  width: '100%',
  marginBottom: '0.65rem',
  padding: '0.5rem',
  borderRadius: 8,
  border: '1px solid #1e293b',
  background: '#020617',
  color: '#e5e7eb',
};

const button: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: 8,
  background: '#fbbf24',
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '0.25rem',
};

const toggle: React.CSSProperties = {
  marginTop: '0.9rem',
  fontSize: '0.8rem',
  textAlign: 'center',
  color: '#9ca3af',
};

const toggleLink: React.CSSProperties = {
  color: '#38bdf8',
  cursor: 'pointer',
};

const errorText: React.CSSProperties = {
  color: '#ef4444',
  fontSize: '0.8rem',
  marginBottom: '0.5rem',
};

const illustration: React.CSSProperties = {
  position: 'absolute',
  bottom: '-10px',
  left: '0%',
  width: 360,
  opacity: 0.9,
  pointerEvents: 'none',
};

export default LoginPage;
