import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
}) => {
  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
      return;
    }
    console.log('Open product detail for', product.id);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginTop: '0.75rem',
      }}
    >
      {products.map((p, index) => (
        <ProductCard
          key={p.id}
          product={p}
          index={index}                 // 🔥 STAGGER INDEX
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
};
