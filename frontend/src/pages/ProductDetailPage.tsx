import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../types';
import { Header } from '../components/layout/Header';
import { fetchProductById } from '../api/products';
import { useCart } from '../hooks/useCart';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false); // ✅ feedback state

  useEffect(() => {
    if (!id) {
      setError('Missing product id');
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const p = await fetchProductById(id);
        if (!cancelled) setProduct(p);
      } catch {
        if (!cancelled) setError('Unable to load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      title: product.title,
      image: product.images?.[0],
      price: product.price,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="app-root">
      <Header query="" onSearch={() => navigate('/')} />

      <main className="main-layout">
        <section className="content" style={{ gridColumn: '1 / -1' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              marginBottom: '0.75rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              border: '1px solid rgba(148, 163, 184, 0.6)',
              background: 'transparent',
              color: '#e5e7eb',
              fontSize: '0.8rem',
            }}
          >
            ← Back to results
          </button>

          {loading && <div className="status">Loading product…</div>}
          {error && <div className="status status-error">{error}</div>}

          {!loading && product && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.5rem',
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.96)',
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.35)',
                  minHeight: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {product.images?.length ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>

              {/* DETAILS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h1>{product.title}</h1>
                <div style={{ color: '#9ca3af' }}>
                  {product.brand} • {product.category}
                </div>

                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                  ₹{product.price}
                </div>

                {/* ✅ ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.availabilityStatus === 'OUT_OF_STOCK'}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.7rem',
                    borderRadius: 10,
                    background:
                      product.availabilityStatus === 'OUT_OF_STOCK'
                        ? '#374151'
                        : added
                        ? '#4ade80'
                        : '#febd69',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor:
                      product.availabilityStatus === 'OUT_OF_STOCK'
                        ? 'not-allowed'
                        : 'pointer',
                    color: '#020617',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {product.availabilityStatus === 'OUT_OF_STOCK'
                    ? 'Out of stock'
                    : added
                    ? '✓ Added to cart'
                    : 'Add to cart'}
                </button>

                {product.description && <p>{product.description}</p>}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
