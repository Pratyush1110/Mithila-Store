// components/shop/CartNotificationToast.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import type { CartItem } from '@/types';
import { useCart } from '@/hooks/useCart';

interface CartNotificationToastProps {
  /** The id sonner assigned this toast — used so our own buttons can dismiss it. */
  toastId: string | number;
  item: CartItem;
  /** Selected variant/options label, e.g. "Size: A3" — falls back to product.size. */
  optionsLabel?: string;
}

export default function CartNotificationToast({
  toastId,
  item,
  optionsLabel,
}: CartNotificationToastProps) {
  const { product } = item;
  const [quantity, setQuantity] = useState(item.quantity);const image = product.images?.[0];
  const label = optionsLabel ?? product.size ?? null;

  const dismiss = () => toast.dismiss(toastId);

  const refreshToast = (newQuantity: number) => {
    toast.custom(
      id => (
        <CartNotificationToast
          toastId={id}
          item={{
            product,
            quantity: newQuantity,
          }}
          optionsLabel={optionsLabel}
        />
      ),
      {
        id: `cart-${product.id}`,
        duration: 5000,
      }
    );
  };

  const { update } = useCart();

  const handleDecrease = () => {
    if (quantity <= 0) return;

    const newQty = quantity - 1;

    setQuantity(newQty);
    update(product.id, newQty);
    refreshToast(newQty);

    if(newQty === 0) {
      dismiss();
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;

    setQuantity(newQty);
    update(product.id, newQty);
    refreshToast(newQty);
  };

  const card = (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto w-full md:w-[380px] bg-[var(--color-bg)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-[0_8px_30px_rgba(28,20,16,0.18)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[var(--color-border)]">
        <span className="font-body text-[0.7rem] font-medium tracking-[0.15em] uppercase text-[var(--color-primary)]">
          Added to cart
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors leading-none text-xl px-1 -mr-1"
        >
          ×
        </button>
      </div>

      <div className="flex gap-4 px-5 py-4">
        <div className="relative w-16 h-20 flex-shrink-0 bg-[var(--color-surface)] overflow-hidden border border-[var(--color-border)]">
          {image && (
            <Image src={image} alt={product.title} fill sizes="64px" className="object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-[0.95rem] text-[var(--color-ink)] leading-snug line-clamp-2">
            {product.title}
          </p>
          {label && (
            <p className="font-body text-xs text-[var(--color-muted)] mt-1">{label}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center border border-[var(--color-border)] rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 0}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>

              <span className="w-10 text-center font-body text-sm text-[var(--color-ink)]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
              >
                +
              </button>
            </div>

            <span className="font-body text-sm font-medium text-[var(--color-ink)]">
              ₹{(product.price * quantity).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={dismiss}
          className="flex-1 font-body text-sm text-[var(--color-ink)] border border-[var(--color-border)] py-2.5 hover:bg-[var(--color-surface)] transition-colors"
        >
          Continue Shopping
        </button>
        <Link
          href="/checkout"
          onClick={dismiss}
          className="flex-1 text-center font-body text-sm font-medium text-[#FAFAF7] bg-[#1A1714] py-2.5 hover:bg-[#2C2824] transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );

  // Desktop: sonner already renders/animates/stacks the toast in a top-right
  // fixed column, so we just hand it the card and let it do the sliding.
  //
  // Mobile: we want a full-viewport dim overlay + bottom sheet — a different
  // DOM shape than a toast. Sonner applies a CSS transform to each toast's
  // wrapper for its own slide/stack animation, and a transformed ancestor
  // creates a new containing block: any `position: fixed` overlay rendered
  // *inside* that wrapper gets trapped there instead of covering the
  // viewport. So on mobile we portal a standalone overlay+sheet straight to
  // <body>, and hide the "inline" desktop card instead.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="hidden md:block">{card}</div>

      {mounted &&
        createPortal(
          <div
            className={`md:hidden fixed inset-0 z-[100] flex items-end justify-center backdrop-blur-sm bg-black/20 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={dismiss}
          >
            <div
              onClick={e => e.stopPropagation()}
              className={`w-full transform transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
              {card}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}