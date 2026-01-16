import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

interface HeaderProps {
  query: string;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ query, onSearch }) => {
  const [localQuery, setLocalQuery] = useState(query);
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { items } = useCart(); // ✅ cart state

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery.trim());
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#131921',
        color: '#fff',
        padding: '0.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* 🟡 BRAND */}
      <div
        style={{
          fontWeight: 800,
          fontSize: '1.4rem',
          cursor: 'pointer',
          letterSpacing: '0.3px',
        }}
        onClick={() => navigate('/')}
      >
        Shiro<span style={{ color: '#febd69' }}>Mart</span>
      </div>

      {/* 🔍 SEARCH */}
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex' }}>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search within your selected category..."
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            border: 'none',
            borderRadius: '4px 0 0 4px',
            fontSize: '0.95rem',
          }}
        />
        <button
          type="submit"
          style={{
            border: 'none',
            padding: '0 1rem',
            backgroundColor: '#febd69',
            borderRadius: '0 4px 4px 0',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* 🛒 CART */}
      <div
        onClick={() => navigate('/cart')}
        style={{
          position: 'relative',
          cursor: 'pointer',
          marginLeft: '0.75rem',
          fontSize: '1.2rem',
        }}
        title="View cart"
      >
        🛒
        {cartCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -10,
              background: '#f97316',
              color: '#020617',
              borderRadius: '999px',
              padding: '1px 6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {cartCount}
          </span>
        )}
      </div>

      {/* 🔐 LOGOUT */}
      {token && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: '0.75rem',
            padding: '0.35rem 0.75rem',
            background: 'transparent',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
};
