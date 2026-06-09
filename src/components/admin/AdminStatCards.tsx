interface Stats {
  totalOrders: number; totalRevenue: number;
  pending: number; inProgress: number; shipped: number; delivered: number;
}
export default function AdminStatCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Total Orders',   value: stats.totalOrders },
    { label: 'Revenue (₹)',    value: new Intl.NumberFormat('en-IN').format(stats.totalRevenue) },
    { label: 'Pending',        value: stats.pending    },
    { label: 'In Progress',    value: stats.inProgress },
    { label: 'Shipped',        value: stats.shipped    },
    { label: 'Delivered',      value: stats.delivered  },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: '#FAFAF7', border: '1px solid #E8E4DC', padding: '20px 24px' }}>
          <p style={{ fontFamily: '"DM Sans"', fontSize: '0.75rem', color: '#9B9187', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</p>
          <p style={{ fontFamily: '"Playfair Display"', fontSize: '1.5rem', fontWeight: 700, color: '#1A1714', margin: 0 }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
