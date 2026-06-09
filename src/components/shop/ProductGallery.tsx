'use client';
import { useState } from 'react';
import Image from 'next/image';
interface Props { images: string[]; title: string; }
export default function ProductGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  if (!images.length) return (
    <div style={{ aspectRatio: '1', background: '#F0EDE6', border: '1.5px solid #C8A96E', outline: '1.5px solid #C8A96E', outlineOffset: '4px' }}/>
  );
  return (
    <div>
      <div style={{ position: 'relative', aspectRatio: '4/5', border: '1.5px solid #C8A96E', outline: '1.5px solid #C8A96E', outlineOffset: '4px', overflow: 'hidden', background: '#F0EDE6' }}>
        <Image src={images[active]} alt={title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 1024px) 100vw, 50vw" priority />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ position: 'relative', width: '72px', height: '72px', border: i === active ? '1.5px solid #C8A96E' : '1.5px solid #E8E4DC', cursor: 'pointer', overflow: 'hidden', background: '#F0EDE6', padding: 0 }}>
              <Image src={img} alt={`${title} view ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
