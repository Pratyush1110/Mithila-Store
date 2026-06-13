"use client";

import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const isReady = product.type === 'ready_to_ship';
  const image = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link
      href={`/shop/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
      aria-label={`${product.title} — ${formatINR(product.price)}`}
      className="group"
    >
      <article
        style={{
          background: '#FAFAF7',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          border: '1px solid #E8E4DC',
          transition: 'all 0.3s ease',
        }}
      >
        {/* ── Image Box with Strict Height Ceiling & Mithila Borders ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            height: '240px', // Strict height constraint so cards never look massive
            width: '100%',
            borderBottom: '1.5px solid #C8A96E',
            outline: '1.5px solid #C8A96E',
            outlineOffset: '-6px', // Sets the inner line of the double-border accent
            overflow: 'hidden',
            background: '#F0EDE6', // Clean background matting for different artwork shapes
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Prevents distortion or aggressive zooming
                padding: '14px', // Creates an elegant art gallery matting effect
                transition: 'transform 0.4s ease',
              }}
              className="group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <ellipse cx="22" cy="24" rx="14" ry="8" stroke="#C8A96E" strokeWidth="1.25"/>
                <path d="M36 24 Q42 18 44 24 Q42 30 36 24Z" stroke="#C8A96E" strokeWidth="1.25"/>
              </svg>
            </div>
          )}

          {/* Availability Status Badge */}
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isReady ? '#2B4C2A' : '#292522',
              background: isReady ? 'rgba(233, 245, 232, 0.95)' : 'rgba(245, 242, 237, 0.95)',
              border: `1px solid ${isReady ? '#7BB579' : '#C8A96E'}`,
              padding: '4px 8px',
            }}
          >
            {isReady ? 'In Stock' : 'Made To Order'}
          </span>
        </div>

        {/* ── Content Text Metadata Details ── */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C8A96E',
            margin: '0 0 4px',
          }}>
            {product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
          </p>

          <h3 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#1A1714',
            margin: '0 0 4px',
            lineHeight: 1.3,
          }}>
            {product.title}
          </h3>

          {product.size && (
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.75rem',
              color: '#9B9187',
              margin: '0 0 12px',
            }}>
              {product.size}
            </p>
          )}

          <div style={{ flex: 1 }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #E8E4DC',
          }}>
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#1A1714',
              margin: 0,
            }}>
              {formatINR(product.price)}
            </p>
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.75rem',
              color: '#6B6057',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }} className="group-hover:text-stone-900 transition-colors">
              Explore →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}