'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/types';

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CartLineItem({ item, onUpdate, onRemove }: {
  item: CartItem;
  onUpdate: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}) {
  const image = item.product.images[0] ?? null;
  const lineTotal = item.product.price * item.quantity;

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px 0',
        borderBottom: '1px solid var(--color-border)',
        alignItems: 'center',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '88px',
          height: '110px',
          flexShrink: 0,
          background: 'var(--color-surface)',
          border: '1.5px solid #C8A96E',
          outline: '1.5px solid #C8A96E',
          outlineOffset: '3px',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={item.product.title}
            fill
            sizes="88px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              color: '#C8A96E',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.08em',
            }}
          >
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C8A96E',
            margin: '0 0 4px',
          }}
        >
          {item.product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
        </p>
        <Link
          href={`/shop/${item.product.id}`}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-ink)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '4px',
            lineHeight: 1.3,
          }}
        >
          {item.product.title}
        </Link>
        {item.product.size && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-muted)',
              margin: '0 0 10px',
            }}
          >
            {item.product.size}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          {/* Quantity stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
            }}
          >
            <button
              type="button"
              onClick={() => onUpdate(item.product.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              style={{
                width: '30px',
                height: '30px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
              }}
            >
              −
            </button>
            <span
              style={{
                width: '36px',
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--color-ink)',
              }}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdate(item.product.id, item.quantity + 1)}
              aria-label="Increase quantity"
              style={{
                width: '30px',
                height: '30px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
              }}
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(item.product.id)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#9B9187',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: 'var(--color-ink)',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {formatINR(lineTotal)}
        </p>
        {item.quantity > 1 && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-muted)',
              margin: '4px 0 0',
              whiteSpace: 'nowrap',
            }}
          >
            {formatINR(item.product.price)} each
          </p>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, totalAmount, update, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-3xl md:text-4xl mb-4" style={{ color: 'var(--color-ink)' }}>
          Your Cart is Empty
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-10">
          Browse our collection of hand-painted Mithila art and handknitted pieces.
        </p>
        <Link
          href="/shop"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: '#FAFAF7',
            background: 'var(--color-primary)',
            textDecoration: 'none',
            padding: '14px 36px',
            letterSpacing: '0.02em',
            display: 'inline-block',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = 0; // calculated at checkout
  const grandTotal = totalAmount + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl md:text-4xl mb-10" style={{ color: 'var(--color-ink)' }}>
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--color-border)',
              padding: '8px 24px',
            }}
          >
            {items.map(item => (
              <CartLineItem
                key={item.product.id}
                item={item}
                onUpdate={update}
                onRemove={remove}
              />
            ))}
          </div>

          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              marginTop: '24px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-ink)',
              paddingBottom: '1px',
            }}
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div>
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '28px 28px 32px',
              position: 'sticky',
              top: '24px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-ink)',
                margin: '0 0 24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-muted)',
                marginBottom: '12px',
              }}
            >
              <span>Subtotal</span>
              <span>{formatINR(totalAmount)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-muted)',
                marginBottom: '20px',
              }}
            >
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: '16px',
                borderTop: '1px solid var(--color-border)',
                marginBottom: '28px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                {formatINR(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                // TODO: hook up payment gateway flow
                window.location.href = '/checkout';
              }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#FAFAF7',
                background: 'var(--color-primary)',
                border: 'none',
                padding: '15px 24px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                width: '100%',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
            >
              Proceed to Secure Checkout
            </button>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: '#9B9187',
                textAlign: 'center',
                marginTop: '16px',
                marginBottom: 0,
              }}
            >
              Secure payments powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}