import type { Order } from '@/types';
export default function AdminOrderTable({ orders }: { orders: Order[] }) {
  if (!orders.length) return <p style={{ color: '#9B9187', fontFamily: '"DM Sans"' }}>No orders yet.</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E8E4DC' }}>
            {['Customer', 'Email', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#9B9187', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #F0EDE6' }}>
              <td style={{ padding: '12px 16px', color: '#1A1714' }}>{o.customer_name}</td>
              <td style={{ padding: '12px 16px', color: '#6B6057' }}>{o.customer_email}</td>
              <td style={{ padding: '12px 16px', color: '#1A1714', fontWeight: 500 }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '2px', background: o.payment_status === 'captured' ? '#EAF3E9' : '#FEF3E2', color: o.payment_status === 'captured' ? '#3B5E3A' : '#7A4F00' }}>
                  {o.payment_status}
                </span>
              </td>
              <td style={{ padding: '12px 16px', color: '#6B6057' }}>{o.production_status}</td>
              <td style={{ padding: '12px 16px', color: '#9B9187' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
