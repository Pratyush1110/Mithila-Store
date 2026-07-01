// app/track-order/page.tsx — Order Tracking (Client Component)
// Customers enter their explicit Razorpay Order ID AND email to securely verify and look up order status.

'use client';

import { useState } from 'react';
import type { Order } from '@/types';

const STATUS_STEPS: { key: Order['production_status']; label: string; description: string }[] = [
  { key: 'received',  label: 'Order Received',  description: 'We\'ve received your order and are preparing materials.' },
  { key: 'painting',  label: 'Being Crafted',   description: 'Your piece is being hand-painted or knitted with care.' },
  { key: 'shipped',   label: 'Shipped',          description: 'Your order is on its way to you!' },
  { key: 'delivered', label: 'Delivered',        description: 'Your piece has arrived. Enjoy!' },
];

const STATUS_INDEX: Record<Order['production_status'], number> = {
  received: 0, painting: 1, shipped: 2, delivered: 3,
};

export default function TrackOrderPage() {
  // ✅ Declared distinct state managers matching the updated 2-factor verification inputs
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      // ✅ Properly bound input elements directly to parameters required by our secure tracking endpoint
      const res = await fetch(`/api/orders/track?email=${encodeURIComponent(email.trim())}&orderId=${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'No matching order details found.');
      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const currentStep = order ? STATUS_INDEX[order.production_status] : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl mb-2">Track Your Order</h1>
      <p className="text-[var(--color-muted)] mb-10">
        To securely access your order progress, please supply both parameters below.
      </p>

      {/* Search form expanded for explicit input layout rows */}
      <form onSubmit={handleTrack} className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address used at checkout"
            required
            className="flex-1 border border-[var(--color-border)] bg-white rounded-lg px-4 py-3
                       text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Razorpay Order ID"
            required
            className="flex-1 border border-[var(--color-border)] bg-white rounded-lg px-4 py-3
                       text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto sm:self-end bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                     text-white px-8 py-3 rounded-lg font-medium transition-colors
                     disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Track Order'}
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {/* Order result */}
      {order && (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Order for</p>
              <p className="font-semibold text-lg">{order.customer_name}</p>
              <p className="text-[var(--color-muted)] text-sm">{order.customer_email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--color-muted)]">Total</p>
              <p className="font-display text-2xl text-[var(--color-primary)]">
                ₹{order.total_amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Payment badge */}
          <div className="mb-6">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full
              ${order.payment_status === 'captured'
                ? 'bg-green-100 text-green-700'
                : order.payment_status === 'failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'}`}>
              Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>

          {/* Progress steps */}
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= currentStep;
              const current = i === currentStep;
              return (
                <div key={step.key} className="flex items-start gap-4">
                  {/* Connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                      ${done
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                        : 'bg-white border-[var(--color-border)] text-[var(--color-muted)]'}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 ${done ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
                    )}
                  </div>

                  {/* Label */}
                  <div className="pb-8">
                    <p className={`font-semibold ${current ? 'text-[var(--color-primary)]' : done ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'}`}>
                      {step.label}
                    </p>
                    {current && (
                      <p className="text-sm text-[var(--color-muted)] mt-0.5">{step.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}