'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order, ProductionStatus } from '@/types';

// ─── Toast ────────────────────────────────────────────────────────
interface ToastState { message: string; kind: 'success' | 'error' }

function Toast({ message, kind }: ToastState) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position:   'fixed',
        bottom:     '32px',
        right:      '32px',
        zIndex:     9999,
        background: kind === 'success' ? '#EAF3E9' : '#FEF2F2',
        border:     `1px solid ${kind === 'success' ? '#8CBF8A' : '#FCA5A5'}`,
        color:      kind === 'success' ? '#3B5E3A' : '#991B1B',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize:   '0.875rem',
        padding:    '12px 20px',
        maxWidth:   '320px',
        boxShadow:  '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {message}
    </div>
  );
}

// ─── Status select ────────────────────────────────────────────────
const STATUS_OPTIONS: { value: ProductionStatus; label: string; color: string; bg: string }[] = [
  { value: 'received',  label: 'Received',      color: '#7A4F00', bg: '#FEF3E2' },
  { value: 'painting',  label: 'Being Crafted',  color: '#1A5276', bg: '#EBF5FB' },
  { value: 'shipped',   label: 'Shipped',        color: '#5B2C6F', bg: '#F5EEF8' },
  { value: 'delivered', label: 'Delivered',      color: '#3B5E3A', bg: '#EAF3E9' },
];

function statusStyle(value: ProductionStatus): React.CSSProperties {
  const opt = STATUS_OPTIONS.find(o => o.value === value) ?? STATUS_OPTIONS[0];
  return { color: opt.color, background: opt.bg };
}

interface StatusSelectProps {
  orderId:  string;
  current:  ProductionStatus;
  onUpdate: (orderId: string, status: ProductionStatus) => Promise<void>;
}

function StatusSelect({ orderId, current, onUpdate }: StatusSelectProps) {
  const [value,   setValue]   = useState<ProductionStatus>(current);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProductionStatus;
    setValue(next);
    setLoading(true);
    await onUpdate(orderId, next);
    setLoading(false);
  }

  const style = statusStyle(value);

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      aria-label="Workshop status"
      style={{
        fontFamily:         '"DM Sans", system-ui, sans-serif',
        fontSize:           '0.75rem',
        fontWeight:         500,
        letterSpacing:      '0.04em',
        ...style,
        border:             `1px solid ${style.color}33`,
        padding:            '5px 28px 5px 10px',
        cursor:             loading ? 'not-allowed' : 'pointer',
        appearance:         'none',
        backgroundImage:    `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6057' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:   'no-repeat',
        backgroundPosition: 'right 8px center',
        outline:            'none',
        opacity:            loading ? 0.6 : 1,
        transition:         'opacity 0.15s',
        minWidth:           '140px',
      }}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// ─── Payment badge ─────────────────────────────────────────────────
function PaymentBadge({ status }: { status: string }) {
  const palette =
    status === 'captured' ? { bg: '#EAF3E9', color: '#3B5E3A', border: '#8CBF8A' } :
    status === 'failed'   ? { bg: '#FEF2F2', color: '#991B1B', border: '#FCA5A5' } :
                            { bg: '#FEF3E2', color: '#7A4F00', border: '#F6C96A' };
  return (
    <span style={{
      fontFamily:    '"DM Sans", system-ui, sans-serif',
      fontSize:      '0.6875rem',
      fontWeight:    500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding:       '3px 8px',
      background:    palette.bg,
      color:         palette.color,
      border:        `1px solid ${palette.border}`,
      whiteSpace:    'nowrap',
    }}>
      {status}
    </span>
  );
}

// ─── Skeleton row ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[200, 120, 140, 180, 90, 80, 160].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{
            width:        `${w}px`,
            height:       '13px',
            background:   '#E8E4DC',
            borderRadius: '2px',
            animation:    'pulse 1.6s ease-in-out infinite',
          }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Main component ────────────────────────────────────────────────
interface AdminOrderTableProps {
  orders?: Order[];
}

export default function AdminOrderTable({ orders: initialOrders = [] }: AdminOrderTableProps) {
  const [orders,  setOrders]  = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [toast,   setToast]   = useState<ToastState | null>(null);

  function showToast(message: string, kind: 'success' | 'error') {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders', { credentials: 'same-origin' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      const { orders: data } = await res.json();
      setOrders(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusUpdate(orderId: string, status: ProductionStatus) {
    try {
      const res = await fetch('/api/admin/orders', {
        method:      'PATCH',
        credentials: 'same-origin',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ id: orderId, production_status: status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }
      showToast('Status updated successfully.', 'success');
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, production_status: status } : o),
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Update failed.', 'error');
      fetchOrders();
    }
  }

  const TH = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <th style={{
      textAlign:     'left',
      padding:       '11px 16px',
      fontFamily:    '"DM Sans", system-ui, sans-serif',
      fontSize:      '0.6875rem',
      fontWeight:    500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color:         '#9B9187',
      borderBottom:  '1px solid #E8E4DC',
      whiteSpace:    'nowrap',
      background:    '#F4F1EC',
      ...style,
    }}>
      {children}
    </th>
  );

  const TD = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <td style={{
      padding:       '14px 16px',
      fontFamily:    '"DM Sans", system-ui, sans-serif',
      fontSize:      '0.875rem',
      color:         '#1A1714',
      borderBottom:  '1px solid #F0EDE6',
      verticalAlign: 'middle',
      ...style,
    }}>
      {children}
    </td>
  );

  return (
    <>
      {toast && <Toast {...toast} />}

      <div style={{ overflowX: 'auto' }}>
        {error && (
          <div style={{
            fontFamily:   '"DM Sans", system-ui, sans-serif',
            fontSize:     '0.875rem',
            color:        '#991B1B',
            background:   '#FEF2F2',
            border:       '1px solid #FCA5A5',
            padding:      '12px 16px',
            marginBottom: '16px',
            display:      'flex',
            alignItems:   'center',
            gap:          '12px',
          }}>
            <span style={{ flex: 1 }}>Failed to load orders: {error}</span>
            <button
              onClick={fetchOrders}
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize:   '0.8125rem',
                fontWeight: 500,
                color:      '#991B1B',
                background: 'transparent',
                border:     '1px solid #FCA5A5',
                padding:    '4px 12px',
                cursor:     'pointer',
                flexShrink: 0,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!error && !loading && orders.length === 0 && (
          <div style={{
            textAlign:  'center',
            padding:    '64px 32px',
            background: '#FAFAF7',
            border:     '1px solid #E8E4DC',
          }}>
            <p style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize:   '1.125rem',
              color:      '#4A3F36',
              margin:     '0 0 8px',
            }}>
              No orders yet
            </p>
            <p style={{ fontFamily: '"DM Sans"', fontSize: '0.875rem', color: '#9B9187', margin: 0 }}>
              Orders placed by customers will appear here.
            </p>
          </div>
        )}

        {(loading || orders.length > 0) && (
          <table style={{
            width:          '100%',
            borderCollapse: 'collapse',
            background:     '#FAFAF7',
            border:         '1px solid #E8E4DC',
          }}>
            <thead>
              <tr>
                <TH>Order ID</TH>
                <TH>Date</TH>
                <TH>Customer</TH>
                <TH>Contact</TH>
                <TH>Amount</TH>
                <TH>Payment</TH>
                <TH style={{ minWidth: '160px' }}>Workshop Status</TH>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : orders.map(order => (
                  <tr
                    key={order.id}
                    style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8F5F0')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <TD>
                      <span style={{
                        fontFamily:         '"DM Sans", system-ui, sans-serif',
                        fontSize:           '0.75rem',
                        color:              '#9B9187',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing:      '0.03em',
                      }}>
                        {order.razorpay_order_id
                          ? order.razorpay_order_id.slice(-10)
                          : order.id.slice(0, 8)}…
                      </span>
                    </TD>

                    <TD style={{ color: '#6B6057', whiteSpace: 'nowrap' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </TD>

                    <TD style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {order.customer_name}
                    </TD>

                    <TD>
                      <span style={{ display: 'block', color: '#1A1714', fontSize: '0.875rem' }}>
                        {order.customer_email}
                      </span>
                      {order.customer_phone && (
                        <span style={{ display: 'block', color: '#9B9187', fontSize: '0.8125rem' }}>
                          {order.customer_phone}
                        </span>
                      )}
                    </TD>

                    <TD style={{ whiteSpace: 'nowrap' }}>
                      <span style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize:   '0.9375rem',
                        fontWeight: 600,
                        color:      '#1A1714',
                      }}>
                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                      </span>
                    </TD>

                    <TD>
                      <PaymentBadge status={order.payment_status} />
                    </TD>

                    <TD>
                      <StatusSelect
                        orderId={order.id}
                        current={order.production_status}
                        onUpdate={handleStatusUpdate}
                      />
                    </TD>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
      `}</style>
    </>
  );
}