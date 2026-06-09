import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const isReady = product.type === 'ready_to_ship';
  const image   = product.images[0] ?? null;

  return (
    <Link
      href={`/shop/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
      aria-label={`${product.title} — ${formatINR(product.price)}`}
    >
      <article
        style={{
          background: '#FAFAF7',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.25s ease',
        }}
      >

        {/* ── Image with Mithila double-line border frame ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            /* Outer rule */
            border:       '1.5px solid #C8A96E',
            /* Simulate the double-line: an inner rule via outline */
            outline:      '1.5px solid #C8A96E',
            outlineOffset: '4px',
            /* Margin to let outline breathe */
            margin:       '8px',
            aspectRatio:  '4 / 5',
            overflow:     'hidden',
            background:   '#F0EDE6',
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            />
          ) : (
            /* Placeholder when no image is present */
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              {/* Fish motif — the most iconic Mithila symbol */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <ellipse cx="22" cy="24" rx="14" ry="8" stroke="#C8A96E" strokeWidth="1.25"/>
                <path d="M36 24 Q42 18 44 24 Q42 30 36 24Z" fill="none" stroke="#C8A96E" strokeWidth="1.25"/>
                <circle cx="16" cy="22" r="1.5" fill="#C8A96E"/>
                <path d="M20 20 Q22 24 20 28" stroke="#C8A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
                <path d="M25 18 Q27 24 25 30" stroke="#C8A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
              </svg>
              <span style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: '0.75rem',
                color: '#C8A96E',
                letterSpacing: '0.1em',
              }}>No image yet</span>
            </div>
          )}

          {/* Type badge — positioned inside the frame */}
          <span
            aria-label={isReady ? 'Ready to ship' : 'Made to order'}
            style={{
              position:   'absolute',
              bottom:     '10px',
              left:       '10px',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize:   '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:      isReady ? '#3B5E3A' : '#1A1714',
              background: isReady ? 'rgba(234, 243, 233, 0.92)' : 'rgba(250, 250, 247, 0.92)',
              border:     `1px solid ${isReady ? '#8CBF8A' : '#C8A96E'}`,
              padding:    '4px 8px',
              backdropFilter: 'blur(2px)',
            }}
          >
            {isReady ? 'Ready to ship' : 'Made to order'}
          </span>
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: '16px 8px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category eyebrow */}
          <p style={{
            fontFamily:    '"DM Sans", system-ui, sans-serif',
            fontSize:      '0.6875rem',
            fontWeight:    500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         '#C8A96E',
            margin:        '0 0 6px',
          }}>
            {product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
          </p>

          {/* Title */}
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize:   '1rem',
            fontWeight: 600,
            color:      '#1A1714',
            margin:     '0 0 6px',
            lineHeight: 1.3,
          }}>
            {product.title}
          </h3>

          {/* Size (if present) */}
          {product.size && (
            <p style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize:   '0.8125rem',
              color:      '#9B9187',
              margin:     '0 0 12px',
            }}>
              {product.size}
            </p>
          )}

          {/* Spacer pushes price to bottom */}
          <div style={{ flex: 1 }} />

          {/* Price + CTA row */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginTop:      '12px',
            paddingTop:     '12px',
            borderTop:      '1px solid #F0EDE6',
          }}>
            <p style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize:   '1.125rem',
              fontWeight: 600,
              color:      '#1A1714',
              margin:     0,
            }}>
              {formatINR(product.price)}
            </p>
            <span style={{
              fontFamily:    '"DM Sans", system-ui, sans-serif',
              fontSize:      '0.75rem',
              color:         '#6B6057',
              letterSpacing: '0.06em',
              display:       'flex',
              alignItems:    'center',
              gap:           '4px',
            }}>
              View
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
