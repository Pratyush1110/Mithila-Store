'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  title: string;
}

const ACCENT = '#C8A96E';

export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // ── Empty state (no images uploaded) ──────────────────────────────
  if (!images.length) {
    return (
      <div
        className="w-full max-w-[480px] mx-auto"
        style={{
          aspectRatio: '4/5',
          background: '#F0EDE6',
          border: '1.5px solid ' + ACCENT,
          outline: '1.5px solid ' + ACCENT,
          outlineOffset: '4px',
        }}
      />
    );
  }

  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const next = (index + images.length) % images.length; // wrap around safely
    setActive(next);
  };

  const goPrev = () => goTo(active - 1);
  const goNext = () => goTo(active + 1);

  // ── Basic swipe support for touch devices ──────────────────────────
  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 40;

    if (deltaX > SWIPE_THRESHOLD) goPrev();
    else if (deltaX < -SWIPE_THRESHOLD) goNext();

    touchStartX.current = null;
  }

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* ── Main sliding viewport ── */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '4/5',
          border: '1.5px solid ' + ACCENT,
          outline: '1.5px solid ' + ACCENT,
          outlineOffset: '4px',
          overflow: 'hidden',
          background: '#F0EDE6',
        }}
        onTouchStart={hasMultiple ? handleTouchStart : undefined}
        onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
      >
        {/* Sliding track — one slide per image, translated horizontally */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${active * (100 / images.length)}%)`,
          }}
        >
          {images.map((img, i) => (
            <div
              key={img + i}
              className="relative h-full"
              style={{ width: `${100 / images.length}%` }}
            >
              <Image
                src={img}
                alt={`${title}${images.length > 1 ? ` — view ${i + 1}` : ''}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Left/right arrow navigation — hidden entirely for single-image products */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(250, 247, 242, 0.9)',
                border: '1px solid ' + ACCENT,
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(250, 247, 242, 0.9)',
                border: '1px solid ' + ACCENT,
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="#1A1714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Slide position indicator */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                background: 'rgba(26, 23, 20, 0.55)',
                color: '#FAFAF7',
                fontSize: '0.6875rem',
                padding: '3px 10px',
                letterSpacing: '0.04em',
              }}
            >
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail indicators — hidden entirely for single-image products ── */}
      {hasMultiple && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className="relative overflow-hidden transition-colors duration-200"
              style={{
                width: '72px',
                height: '72px',
                border: i === active ? '1.5px solid ' + ACCENT : '1.5px solid #E8E4DC',
                background: '#F0EDE6',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}