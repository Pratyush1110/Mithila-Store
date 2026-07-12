'use client';

import { useCallback, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

// Leading-edge debounce: first tap fires immediately (stays responsive),
// extra taps inside the window are swallowed instead of queuing more
// ADD actions / re-firing the toast.
const CLICK_DEBOUNCE_MS = 500;

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const lastClickAt = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickAt.current < CLICK_DEBOUNCE_MS) return;
    lastClickAt.current = now;
    add(product);
  }, [add, product]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] text-sm hover:bg-neutral-800 transition-colors"
    >
      Add to Shopping Cart
    </button>
  );
}