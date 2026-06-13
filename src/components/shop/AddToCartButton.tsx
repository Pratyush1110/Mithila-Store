'use client';

import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(product)}
      style={{
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize: '0.9375rem',
        fontWeight: 500,
        color: '#FAFAF7',
        background: '#1A1714',
        border: 'none',
        padding: '15px 40px',
        cursor: 'pointer',
        letterSpacing: '0.02em',
        width: '100%',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#2C2824')}
      onMouseLeave={e => (e.currentTarget.style.background = '#1A1714')}
    >
      Add to Shopping Cart
    </button>
  );
}