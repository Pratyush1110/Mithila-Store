import type { Product } from '@/types';
import ProductCard from '@/components/shop/ProductCard';

interface FeaturedGridProps {
  products:   Product[];
  heading:    string;
  subheading: string;
  variant:    'primary' | 'secondary';
}

export default function FeaturedGrid({ products, heading, subheading, variant }: FeaturedGridProps) {
  return (
    <section
      aria-label={heading}
      style={{
        background:  variant === 'primary' ? '#FAFAF7' : '#F4F1EC',
        padding:     '72px 32px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-end',
          marginBottom:   '40px',
          flexWrap:       'wrap',
          gap:            '12px',
        }}>
          <div>
            {variant === 'primary' && (
              <p style={{
                fontFamily:    '"DM Sans", system-ui, sans-serif',
                fontSize:      '0.6875rem',
                fontWeight:    500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#C8A96E',
                marginBottom:  '8px',
              }}>
                Featured Collection
              </p>
            )}
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize:   'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color:      '#1A1714',
              margin:     '0 0 8px',
              lineHeight: 1.15,
            }}>
              {heading}
            </h2>
            <p style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize:   '0.9375rem',
              color:      '#6B6057',
              margin:     0,
              maxWidth:   '480px',
            }}>
              {subheading}
            </p>
          </div>
          <a
            href={`/shop${variant === 'secondary' ? '?category=knitting' : '?category=mithila_painting'}`}
            style={{
              fontFamily:    '"DM Sans", system-ui, sans-serif',
              fontSize:      '0.875rem',
              fontWeight:    500,
              color:         '#1A1714',
              textDecoration: 'none',
              borderBottom:  '1px solid #1A1714',
              paddingBottom: '1px',
              whiteSpace:    'nowrap',
            }}
          >
            View all →
          </a>
        </div>

        {/* Product grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap:                 '24px',
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
