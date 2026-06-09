export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#1A1714',
      color: '#E8E4DC',
    }}>
      {/* Double-line top border — the Mithila frame signature */}
      <div style={{
        height: '7px',
        background:
          'linear-gradient(#C8A96E 0px, #C8A96E 1.5px, transparent 1.5px, transparent 4px, #C8A96E 4px, #C8A96E 5.5px, #1A1714 5.5px)',
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '56px 32px 48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '48px 64px',
        alignItems: 'start',
      }}>

        {/* ── Brand column ── */}
        <div>
          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#FAFAF7',
            marginBottom: '14px',
            letterSpacing: '0.01em',
          }}>
            Kavita Arts &amp; Crafts
          </p>
          <p style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#9B9187',
            lineHeight: '1.75',
            maxWidth: '280px',
            margin: 0,
          }}>
            Each painting is a living text — a language of fish and lotuses,
            gods and grains — drawn by hand in the ancient Mithila tradition,
            passed from mother to daughter across centuries.
          </p>
        </div>

        {/* ── Navigation column ── */}
        <div>
          <p style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: '#C8A96E',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Shop
          </p>
          <nav aria-label="Footer navigation">
            {[
              { href: '/shop?category=mithila_painting', label: 'Mithila Paintings' },
              { href: '/shop?category=knitting',         label: 'Knitting'           },
              { href: '/shop',                           label: 'All Products'       },
              { href: '/track-order',                    label: 'Track Your Order'   },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: '#9B9187',
                  textDecoration: 'none',
                  marginBottom: '10px',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Heritage note column ── */}
        <div>
          <p style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: '#C8A96E',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Our Craft
          </p>
          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '0.9375rem',
            fontStyle: 'italic',
            color: '#7A7068',
            lineHeight: '1.75',
            margin: 0,
          }}>
            &ldquo;Madhubani is not decoration.
            It is memory, made visible.&rdquo;
          </p>
          <p style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.8125rem',
            color: '#5A534D',
            marginTop: '12px',
            lineHeight: 1,
          }}>
            — Kavita, artist &amp; founder
          </p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: '1px solid #2C2824',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <p style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.8125rem',
          color: '#5A534D',
          margin: 0,
        }}>
          &copy; {year} Kavita Arts &amp; Crafts. All rights reserved.
        </p>
        <p style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.8125rem',
          color: '#5A534D',
          margin: 0,
        }}>
          Preserving Madhubani · Bihar, India
        </p>
      </div>
    </footer>
  );
}
