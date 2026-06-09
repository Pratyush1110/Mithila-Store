'use client';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
function formatINR(n: number) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n); }
export default function ProductInfo({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div>
      <p style={{ fontFamily: '"DM Sans"', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A96E', marginBottom: '12px' }}>
        {product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
      </p>
      <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#1A1714', marginBottom: '8px', lineHeight: 1.15 }}>{product.title}</h1>
      {product.size && <p style={{ fontFamily: '"DM Sans"', fontSize: '0.875rem', color: '#9B9187', marginBottom: '20px' }}>{product.size}</p>}
      <p style={{ fontFamily: '"Playfair Display"', fontSize: '1.75rem', fontWeight: 600, color: '#1A1714', marginBottom: '28px' }}>{formatINR(product.price)}</p>
      <p style={{ fontFamily: '"DM Sans"', fontSize: '1rem', color: '#6B6057', lineHeight: 1.75, marginBottom: product.story ? '28px' : '32px' }}>{product.description}</p>
      {product.story && (
        <div style={{ borderLeft: '3px solid #C8A96E', paddingLeft: '20px', marginBottom: '32px' }}>
          <p style={{ fontFamily: '"DM Sans"', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8A96E', marginBottom: '8px' }}>The Story</p>
          <p style={{ fontFamily: '"Playfair Display"', fontSize: '0.9375rem', fontStyle: 'italic', color: '#4A3F36', lineHeight: 1.75, margin: 0 }}>{product.story}</p>
        </div>
      )}
      <button onClick={() => add(product)} style={{ fontFamily: '"DM Sans"', fontSize: '0.9375rem', fontWeight: 500, color: '#FAFAF7', background: '#1A1714', border: 'none', padding: '15px 40px', cursor: 'pointer', letterSpacing: '0.02em', width: '100%' }}>
        Add to Cart
      </button>
    </div>
  );
}
