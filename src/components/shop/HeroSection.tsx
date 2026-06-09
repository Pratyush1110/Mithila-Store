import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      aria-label="Hero — Kavita Arts & Crafts"
      style={{
        background: '#FAFAF7',
        padding: '80px 32px 96px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint geometric pattern — top-right corner decorative motif */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '380px',
          height: '380px',
          opacity: 0.045,
          backgroundImage: `
            radial-gradient(circle, #1A1714 1px, transparent 1px),
            radial-gradient(circle, #1A1714 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Eyebrow ── */}
        <p style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C8A96E',
          marginBottom: '24px',
        }}>
          Handcrafted in Bihar, India
        </p>

        {/* ── Headline with double-line left accent ── */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '24px', marginBottom: '36px' }}>
          {/* Double-line bar — Mithila frame signature */}
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: '7px',
              background:
                'linear-gradient(to bottom, #C8A96E 0px, #C8A96E 1.5px, transparent 1.5px, transparent 4px, #C8A96E 4px, #C8A96E 5.5px, transparent 5.5px) repeat-y',
              backgroundSize: '100% 7px',
            }}
          />
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
            fontWeight: 700,
            color: '#1A1714',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            margin: 0,
            maxWidth: '680px',
          }}>
            Art that carries<br />
            a thousand<br />
            <em style={{ fontStyle: 'italic', color: '#4A3F36' }}>years of story.</em>
          </h1>
        </div>

        {/* ── Sub-copy ── */}
        <p style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
          color: '#6B6057',
          lineHeight: '1.75',
          maxWidth: '520px',
          marginBottom: '48px',
        }}>
          Every Mithila painting is a hand-drawn conversation between the
          artist and tradition — painted with natural pigments on handmade
          paper, each piece is unrepeatable.
        </p>

        {/* ── CTAs ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <Link
            href="/shop?category=mithila_painting"
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#FAFAF7',
              background: '#1A1714',
              textDecoration: 'none',
              padding: '14px 32px',
              letterSpacing: '0.02em',
              display: 'inline-block',
              transition: 'background 0.2s',
            }}
          >
            Explore Paintings
          </Link>
          <Link
            href="/shop"
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: '#1A1714',
              textDecoration: 'none',
              padding: '13px 32px',
              border: '1px solid #1A1714',
              display: 'inline-block',
              letterSpacing: '0.02em',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            View All Work
          </Link>
        </div>

        {/* ── Bottom stat strip ── */}
        <div style={{
          marginTop: '72px',
          paddingTop: '32px',
          borderTop: '1px solid #E8E4DC',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '32px',
          maxWidth: '640px',
        }}>
          {[
            { value: 'Hand-painted', label: 'every piece, by one artist' },
            { value: 'Natural pigments', label: 'ochre, turmeric &amp; lamp-black' },
            { value: 'Made to order', label: 'commissioned works welcome' },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1A1714',
                margin: '0 0 4px',
              }}>
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#9B9187',
                  margin: 0,
                  lineHeight: 1.4,
                }}
                dangerouslySetInnerHTML={{ __html: stat.label }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
