// app/order-unavailable/page.tsx — Post-checkout redirect (Client Component)
// Online payments are currently disabled. Customers land here after filling
// in the checkout form; we show their order summary and hand them off to
// WhatsApp or a phone call to actually place the order.

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ─── Configure your contact details here ──────────────────────────
// Country code + number, no "+", no spaces, no dashes (used in the wa.me link).
const WHATSAPP_NUMBER = '919867911749';
// Display-friendly version shown on the page.
const WHATSAPP_NUMBER_DISPLAY = '+91 98679 11749';

interface PendingOrderItem {
  title:    string;
  quantity: number;
  price:    number;
}

interface PendingOrder {
  customer_name:     string;
  customer_email:    string;
  customer_phone:    string;
  shipping_address:  string;
  items:             PendingOrderItem[];
  total:             number;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildWhatsAppMessage(order: PendingOrder | null): string {
  if (!order) {
    return "Hi! I'd like to place an order from the Mithila Art Studio website.";
  }

  const lines = [
    `Hi! I'd like to place an order from the Mithila Art Studio website.`,
    ``,
    `Name: ${order.customer_name}`,
    order.customer_phone ? `Phone: ${order.customer_phone}` : null,
    `Delivery address: ${order.shipping_address}`,
    ``,
    `Items:`,
    ...order.items.map(i => `- ${i.title} x${i.quantity} (${formatINR(i.price * i.quantity)})`),
    ``,
    `📦 Note: Standard shipping charges will be added based on your location, weight, and quantity.`,
    ``,
    `Total: ${formatINR(order.total)} + shipping charges`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export default function OrderUnavailablePage() {
  const [order, setOrder] = useState<PendingOrder | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('mithila_pending_order');
      if (saved) setOrder(JSON.parse(saved) as PendingOrder);
    } catch {
      // no-op — falls back to the generic message
    }
  }, []);

  const whatsappMessage = buildWhatsAppMessage(order);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const callHref = `tel:+${WHATSAPP_NUMBER}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--color-bg)' }}>
      <div style={{
        maxWidth:   '520px',
        width:      '100%',
        background: '#FFFFFF',
        border:     '1px solid var(--color-border)',
        padding:    '56px 48px',
        textAlign:  'center',
      }}>
        {/* Double-line accent */}
        <div aria-hidden="true" style={{
          width:        '64px',
          height:       '7px',
          margin:       '0 auto 32px',
          background:
            'linear-gradient(90deg, #C8A96E 0px, #C8A96E 1.5px, transparent 1.5px, transparent 4px, #C8A96E 4px, #C8A96E 5.5px, transparent 5.5px) repeat-x',
          backgroundSize: '8px 7px',
        }} />

        <p style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          fontWeight:    500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         '#C8A96E',
          margin:        '0 0 16px',
        }}>
          One Step Left
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize:   '2rem',
          fontWeight: 700,
          color:      'var(--color-ink)',
          margin:     '0 0 16px',
          lineHeight: 1.2,
        }}>
          Online Orders Are Currently Unavailable
        </h1>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize:   '1rem',
          fontStyle:  'italic',
          color:      '#4A3F36',
          lineHeight: 1.75,
          margin:     '0 0 32px',
        }}>
          {order
            ? `Thank you, ${order.customer_name}. We've noted what you'd like to order — `
            : "We've saved your details — "}
          just send it across on WhatsApp or give us a call, and we'll take it from there.
        </p>

        {order && (
          <div style={{
            border:       '1px solid var(--color-border)',
            background:   '#F9F6F0',
            padding:      '24px 28px',
            marginBottom: '32px',
            textAlign:    'left',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  fontFamily:     'var(--font-body)',
                  fontSize:       '0.875rem',
                  color:          'var(--color-muted)',
                }}>
                  <span>{item.title} × {item.quantity}</span>
                  <span>{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'baseline',
              paddingTop:     '12px',
              borderTop:      '1px solid var(--color-border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.9375rem',
                fontWeight: 500,
                color:      'var(--color-ink)',
              }}>
                Total
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize:   '1.375rem',
                fontWeight: 700,
                color:      'var(--color-primary)',
              }}>
                {formatINR(order.total)}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        'inline-block',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.9375rem',
              fontWeight:     500,
              color:          '#FAFAF7',
              background:     'var(--color-primary)',
              textDecoration: 'none',
              padding:        '15px 24px',
              letterSpacing:  '0.02em',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
          >
            Continue on WhatsApp
          </a>

          <a
            href={callHref}
            style={{
              display:        'inline-block',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.9375rem',
              fontWeight:     500,
              color:          'var(--color-ink)',
              background:     '#FFFFFF',
              border:         '1px solid var(--color-border)',
              textDecoration: 'none',
              padding:        '15px 24px',
              letterSpacing:  '0.02em',
            }}
          >
            Call {WHATSAPP_NUMBER_DISPLAY}
          </a>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   '0.8125rem',
          color:      '#9B9187',
        }}>
          <Link href="/shop" style={{ color: '#9B9187', textDecoration: 'underline' }}>
            Back to the Gallery
          </Link>
        </p>
      </div>
    </div>
  );
}
