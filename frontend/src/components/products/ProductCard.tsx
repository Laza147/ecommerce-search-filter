import React, { useState } from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  index = 0,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const hasValidImage =
    product.images &&
    product.images.length > 0 &&
    product.images[0].startsWith('http');

  const handleClick = () => {
    setIsExiting(true);      // 🔥 exit micro-interaction
    onClick?.(product);     // 🔥 navigate immediately
  };

  return (
    <div
      className={`product-card ${isExiting ? 'is-exiting' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      style={{
        border: '1px solid #1f2933',
        borderRadius: '8px',
        padding: '0.75rem',
        backgroundColor: 'rgba(15, 23, 42, 0.96)',
        cursor: 'pointer',

        // 🔥 STAGGER ENTRY (40ms PER CARD)
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          height: 180,
          borderRadius: '6px',
          background: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          color: '#9ca3af',
          fontSize: '0.8rem',
        }}
      >
        {hasValidImage ? (
          <img
            src={product.images![0]}
            alt={product.title}
            loading="lazy"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <span>No image available</span>
        )}
      </div>

      {/* TITLE */}
      <div style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: '0.4rem' }}>
        {product.title}
      </div>

      {/* BRAND */}
      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
        {product.brand}
      </div>

      {/* PRICE */}
      <div style={{ fontSize: '1rem', fontWeight: 700 }}>
        ₹{product.price}
      </div>
      

      {/* RATING */}
      {product.rating != null && (
        <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
          ⭐ {product.rating.toFixed(1)}
          {product.reviewCount != null && (
            <span style={{ color: '#9ca3af' }}>
              {' '}({product.reviewCount})
            </span>
          )}
        </div>
      )}

      {/* BEST SELLER */}
      {product.salesCount != null && product.salesCount > 100 && (
        <div style={{ fontSize: '0.75rem', color: '#b12704', fontWeight: 600 }}>
          Best seller
        </div>
      )}
    </div>
  );
};
