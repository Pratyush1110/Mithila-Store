import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: '#1A1714', padding: '32px 0',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #2C2824' }}>
        <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1rem', fontWeight: 600, color: '#FAFAF7', margin: 0 }}>
          Kavita Arts
        </p>
        <p style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '0.75rem', color: '#7A7068', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Admin
        </p>
      </div>
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {[
          { href: '/admin',          label: 'Dashboard' },
          { href: '/admin/products', label: 'Products'  },
        ].map(link => (
          <Link key={link.href} href={link.href} style={{
            display: 'block', padding: '10px 24px',
            fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '0.875rem',
            color: '#9B9187', textDecoration: 'none',
          }}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
