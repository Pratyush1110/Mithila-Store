"use client";

import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const isReady = product.type === 'ready_to_ship';
  const image = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    // min-w-0 is required here: without it, this grid item's default
    // min-width:auto lets the image's intrinsic size push it wider than
    // its 1fr track, which collapses the whole grid toward one column.
    // No w-full / w-screen anywhere in this file — width comes only from
    // the grid track itself.
    <Link
      href={`/shop/${product.id}`}
      aria-label={`${product.title} — ${formatINR(product.price)}`}
      className="group block h-full min-w-0 no-underline text-inherit"
    >
      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#E8E4DC] bg-[#FAFAF7] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image frame: fixed aspect ratio, clipped, never grows past the card */}
        <div
          aria-hidden="true"
          className="relative aspect-[4/5] w-full min-w-0 overflow-hidden bg-[#F0EDE6] border-b-[1.5px] border-[#C8A96E]"
        >
          {image ? (
            <img
              src={image}
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-3.5 transition-transform duration-400 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <ellipse cx="22" cy="24" rx="14" ry="8" stroke="#C8A96E" strokeWidth="1.25" />
                <path d="M36 24 Q42 18 44 24 Q42 30 36 24Z" stroke="#C8A96E" strokeWidth="1.25" />
              </svg>
            </div>
          )}

          <span
            className="absolute top-3 right-3 text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-1 border"
            style={{
              color: isReady ? '#2B4C2A' : '#292522',
              background: isReady ? 'rgba(233, 245, 232, 0.95)' : 'rgba(245, 242, 237, 0.95)',
              borderColor: isReady ? '#7BB579' : '#C8A96E',
            }}
          >
            {isReady ? 'In Stock' : 'Made To Order'}
          </span>
        </div>

        {/* Text details — tightly bounded inside the card, never affecting card width */}
        <div className="flex flex-1 min-w-0 flex-col p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest mb-1 truncate" style={{ color: '#C8A96E' }}>
            {product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
          </p>

          <h3
            className="text-[1.05rem] font-semibold leading-tight mb-1 line-clamp-2"
            style={{ fontFamily: '"Playfair Display", serif', color: '#1A1714' }}
          >
            {product.title}
          </h3>

          {product.size && (
            <p className="text-xs mb-3 truncate" style={{ color: '#9B9187' }}>
              {product.size}
            </p>
          )}

          <div className="flex-1" />

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E4DC]">
            <p
              className="text-[1.1rem] font-bold m-0"
              style={{ fontFamily: '"Playfair Display", serif', color: '#1A1714' }}
            >
              {formatINR(product.price)}
            </p>
            <span className="flex items-center gap-1 text-xs text-[#6B6057] transition-colors group-hover:text-stone-900 shrink-0">
              Explore →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}