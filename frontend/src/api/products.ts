import type { Product } from '../types';

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`);

  if (!res.ok) {
    throw new Error(`Product API error: ${res.status}`);
  }

  return res.json();
}
