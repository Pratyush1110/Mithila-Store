import type { Product } from '@/types';
export default function AdminProductTable({ products }: { products: Product[] }) {
  if (!products.length) return <p style={{ color: '#9B9187', fontFamily: '"DM Sans"' }}>No products yet. Add your first piece.</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E8E4DC' }}>
            {['Title', 'Category', 'Type', 'Price', 'Featured'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#9B9187', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #F0EDE6' }}>
              <td style={{ padding: '12px 16px', color: '#1A1714', fontWeight: 500 }}>{p.title}</td>
              <td style={{ padding: '12px 16px', color: '#6B6057' }}>{p.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}</td>
              <td style={{ padding: '12px 16px', color: '#6B6057' }}>{p.type === 'ready_to_ship' ? 'Ready to Ship' : 'Made to Order'}</td>
              <td style={{ padding: '12px 16px', color: '#1A1714' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px 16px', color: p.is_featured ? '#3B5E3A' : '#9B9187' }}>{p.is_featured ? 'Yes' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
