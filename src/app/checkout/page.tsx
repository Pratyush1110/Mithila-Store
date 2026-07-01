// app/checkout/page.tsx — Checkout (Client Component)
// Premium, gallery-style checkout: shipping form (left) + order summary (right).
// Online payments are currently disabled — after the customer fills in their
// details, we stash the order summary and redirect to /order-unavailable,
// where they're pointed to WhatsApp / a phone call to complete the order.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface FormState {
  customer_name:  string;
  customer_email: string;
  customer_phone: string;
  address_line:   string;
  city:           string;
  state:          string;
  pincode:        string;
}

const INITIAL_FORM: FormState = {
  customer_name:  '',
  customer_email: '',
  customer_phone: '',
  address_line:   '',
  city:           '',
  state:          '',
  pincode:        '',
};

// ─── Shared field styles ───────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-body)',
  fontSize:      '0.6875rem',
  fontWeight:    500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color:         '#9B9187',
  marginBottom:  '8px',
};

const inputBaseStyle: React.CSSProperties = {
  width:        '100%',
  fontFamily:   'var(--font-body)',
  fontSize:     '0.9375rem',
  color:        'var(--color-ink)',
  background:   '#FFFFFF',
  border:       '1px solid var(--color-border)',
  borderRadius: 0,
  padding:      '13px 16px',
  outline:      'none',
  boxSizing:    'border-box',
  transition:   'border-color 0.18s ease',
};

function Field({
  label,
  required,
  ...rest
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={rest.id} style={labelStyle}>
        {label}
        {required && <span style={{ color: '#C8A96E', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        {...rest}
        required={required}
        style={inputBaseStyle}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#C8A96E';
          e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(200,169,110,0.12)';
          rest.onFocus?.(e);
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow   = 'none';
          rest.onBlur?.(e);
        }}
      />
    </div>
  );
}

// ─── Section heading ────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{
        fontFamily:    'var(--font-body)',
        fontSize:      '0.6875rem',
        fontWeight:    500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         '#C8A96E',
        margin:        '0 0 8px',
      }}>
        {eyebrow}
      </p>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize:   '1.375rem',
        fontWeight: 600,
        color:      'var(--color-ink)',
        margin:     0,
        paddingBottom: '16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {title}
      </h2>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clear } = useCart();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const shipping  = 0; // free shipping for now
  const grandTotal = totalAmount + shipping;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }

    const shipping_address = [
      form.address_line,
      form.city,
      form.state,
      form.pincode,
    ].filter(Boolean).join(', ');

    if (
      !form.customer_name.trim() ||
      !form.customer_email.trim() ||
      !form.address_line.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Online payments are currently disabled. Stash the order summary so
    // the /order-unavailable page can show it and pre-fill a WhatsApp
    // message, then send the customer there — no DB write, no payment.
    const pendingOrder = {
      customer_name:  form.customer_name.trim(),
      customer_email: form.customer_email.trim(),
      customer_phone: form.customer_phone.trim(),
      shipping_address,
      items: items.map(i => ({
        title:    i.product.title,
        quantity: i.quantity,
        price:    i.product.price,
      })),
      total: grandTotal,
    };

    try {
      sessionStorage.setItem('mithila_pending_order', JSON.stringify(pendingOrder));
    } catch {
      // sessionStorage unavailable — order-unavailable page will just show a generic message
    }

    clear();
    router.push('/order-unavailable');
  }

  // ── Empty cart guard ────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ color: 'var(--color-ink)' }}>
          Your Cart is Empty
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-10">
          Add a piece from the gallery before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          style={{
            fontFamily:     'var(--font-body)',
            fontSize:       '0.9375rem',
            fontWeight:     500,
            color:          '#FAFAF7',
            background:     'var(--color-primary)',
            textDecoration: 'none',
            padding:        '14px 36px',
            letterSpacing:  '0.02em',
            display:        'inline-block',
          }}
        >
          Browse the Gallery
        </Link>
      </div>
    );
  }

  // ── Checkout form ────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          fontWeight:    500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color:         '#C8A96E',
          margin:        '0 0 8px',
        }}>
          Final Step
        </p>
        <h1 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--color-ink)', margin: 0 }}>
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── LEFT: Shipping & Delivery (60%) ── */}
          <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Contact section */}
            <section>
              <SectionHeading eyebrow="Contact" title="Who shall we send this to?" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field
                    id="customer_name"
                    name="customer_name"
                    label="Full Name"
                    required
                    type="text"
                    placeholder="e.g. Anjali Sharma"
                    value={form.customer_name}
                    onChange={handleChange}
                  />
                </div>
                <Field
                  id="customer_email"
                  name="customer_email"
                  label="Email Address"
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.customer_email}
                  onChange={handleChange}
                />
                <Field
                  id="customer_phone"
                  name="customer_phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.customer_phone}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Delivery address section */}
            <section>
              <SectionHeading eyebrow="Delivery" title="Where shall we deliver it?" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <Field
                  id="address_line"
                  name="address_line"
                  label="Address"
                  required
                  type="text"
                  placeholder="House no., street, locality"
                  value={form.address_line}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* City / State / PIN section */}
            <section>
              <SectionHeading eyebrow="Location" title="City &amp; postal details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px 28px' }}>
                <Field
                  id="city"
                  name="city"
                  label="City"
                  required
                  type="text"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={handleChange}
                />
                <Field
                  id="state"
                  name="state"
                  label="State"
                  required
                  type="text"
                  placeholder="Maharashtra"
                  value={form.state}
                  onChange={handleChange}
                />
                <Field
                  id="pincode"
                  name="pincode"
                  label="PIN Code"
                  required
                  type="text"
                  inputMode="numeric"
                  placeholder="400101"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>
            </section>

            {error && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.875rem',
                color:      '#991B1B',
                background: '#FEF2F2',
                border:     '1px solid #FCA5A5',
                padding:    '12px 16px',
                margin:     0,
              }}>
                {error}
              </p>
            )}

            {/* Submit (desktop, shown under form on left column for larger screens) */}
            <div className="hidden lg:block">
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.9375rem',
                  fontWeight:    500,
                  color:         '#FAFAF7',
                  background:    submitting ? '#9B9187' : 'var(--color-primary)',
                  border:        'none',
                  borderRadius:  0,
                  padding:       '16px 24px',
                  cursor:        submitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  width:         '100%',
                  transition:    'background 0.2s',
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'var(--color-primary)'; }}
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.75rem',
                color:      '#9B9187',
                textAlign:  'center',
                marginTop:  '14px',
              }}>
                Currently, orders are finalized via WhatsApp or a phone call
              </p>
            </div>
          </div>

          {/* ── RIGHT: Order Summary (40%) ── */}
          <div className="lg:col-span-2">
            <div style={{
              background:  '#F9F6F0',
              border:      '1px solid var(--color-border)',
              outline:     '1px solid var(--color-border)',
              outlineOffset: '6px',
              padding:     '32px 28px 36px',
              position:    'sticky',
              top:         '24px',
            }}>
              <h2 style={{
                fontFamily:    'var(--font-display)',
                fontSize:      '1.25rem',
                fontWeight:    600,
                color:         'var(--color-ink)',
                margin:        '0 0 24px',
                paddingBottom: '16px',
                borderBottom:  '1px solid var(--color-border)',
              }}>
                Order Summary
              </h2>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                {items.map(item => (
                  <div
                    key={item.product.id}
                    style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      alignItems:     'flex-start',
                      gap:            '12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize:   '0.9375rem',
                        fontWeight: 600,
                        color:      'var(--color-ink)',
                        margin:     '0 0 4px',
                        lineHeight: 1.35,
                      }}>
                        {item.product.title}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.8125rem',
                        color:      '#9B9187',
                        margin:     0,
                      }}>
                        Qty {item.quantity} · {formatINR(item.product.price)} each
                      </p>
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize:   '0.9375rem',
                      fontWeight: 600,
                      color:      'var(--color-ink)',
                      margin:     0,
                      whiteSpace: 'nowrap',
                    }}>
                      {formatINR(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                fontFamily:     'var(--font-body)',
                fontSize:       '0.9375rem',
                color:          'var(--color-muted)',
                marginBottom:   '12px',
                paddingTop:     '16px',
                borderTop:      '1px solid var(--color-border)',
              }}>
                <span>Subtotal</span>
                <span>{formatINR(totalAmount)}</span>
              </div>

              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                fontFamily:     'var(--font-body)',
                fontSize:       '0.9375rem',
                color:          'var(--color-muted)',
                marginBottom:   '20px',
              }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
              </div>

              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'baseline',
                paddingTop:     '16px',
                borderTop:      '1px solid var(--color-border)',
                marginBottom:   '28px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '1rem',
                  fontWeight: 500,
                  color:      'var(--color-ink)',
                }}>
                  Total
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize:   '1.5rem',
                  fontWeight: 700,
                  color:      'var(--color-primary)',
                }}>
                  {formatINR(grandTotal)}
                </span>
              </div>

              {/* Submit (mobile/tablet — visible here, hidden on desktop where the left column button shows) */}
              <button
                type="submit"
                disabled={submitting}
                className="lg:hidden"
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.9375rem',
                  fontWeight:    500,
                  color:         '#FAFAF7',
                  background:    submitting ? '#9B9187' : 'var(--color-primary)',
                  border:        'none',
                  borderRadius:  0,
                  padding:       '15px 24px',
                  cursor:        submitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  width:         '100%',
                  transition:    'background 0.2s',
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'var(--color-primary)'; }}
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.75rem',
                color:      '#9B9187',
                textAlign:  'center',
                marginTop:  '16px',
                marginBottom: 0,
              }}>
                Currently, orders are finalized via WhatsApp or a phone call
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}