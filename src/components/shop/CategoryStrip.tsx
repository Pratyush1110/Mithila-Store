import Link from 'next/link';

export default function CategoryStrip() {
  const categories = [
    {
      href:    '/shop?category=mithila_painting',
      label:   'Mithila Paintings',
      note:    'Handpainted · natural pigments',
      primary: true,
    },
    {
      href:    '/shop?category=knitting',
      label:   'Knitting',
      note:    'Handknit · wool & cotton',
      primary: false,
    },
    {
      href:    '/shop',
      label:   'All Work',
      note:    'Browse everything',
      primary: false,
    },
  ];

  return (
    <nav
      aria-label="Browse by category"
      style={{
        borderBottom: '1px solid #E8E4DC',
        background:   '#FAFAF7',
        padding:      '0 32px',
      }}
    >
      <div style={{
        maxWidth:       '1200px',
        margin:         '0 auto',
        display:        'flex',
        gap:            '0',
        alignItems:     'stretch',
      }}>
        {categories.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontFamily:     '"DM Sans", system-ui, sans-serif',
              textDecoration: 'none',
              padding:        '18px 28px 18px 0',
              marginRight:    '28px',
              display:        'flex',
              flexDirection:  'column',
              gap:            '3px',
              borderBottom:   item.primary ? '2px solid #C8A96E' : '2px solid transparent',
              transition:     'border-color 0.2s, color 0.2s',
            }}
            // We replaced JavaScript hover handlers with an elegant Tailwind hover helper class name!
            className={item.primary ? '' : 'hover:border-stone-300'}
          >
            <span style={{
              fontSize:   item.primary ? '0.9375rem' : '0.875rem',
              fontWeight: item.primary ? 500 : 400,
              color:      '#1A1714',
            }}>
              {item.label}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color:    '#9B9187',
              }}
              dangerouslySetInnerHTML={{ __html: item.note }}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}