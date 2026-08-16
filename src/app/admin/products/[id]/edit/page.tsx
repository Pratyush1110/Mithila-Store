"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductUploadForm from '@/components/admin/ProductUploadForm';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product,   setProduct]   = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/products/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load product.');
        }

        if (!cancelled) setProduct(result.data);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load product.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Back button matching the minimal design theme */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/admin/products"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.875rem',
            color: '#6B6057',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="hover:text-stone-900 transition-colors"
        >
          ← Back to Products Inventory
        </Link>
      </div>

      <h1 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '2rem',
        color: '#1A1714',
        marginBottom: '32px'
      }}>
        Edit Masterpiece
      </h1>

      {isLoading && (
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#6B6057' }}>
          Loading product…
        </p>
      )}

      {!isLoading && error && (
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#DC2626' }}>
          Error: {error}
        </p>
      )}

      {!isLoading && !error && product && (
        <ProductUploadForm initialData={product} isEdit />
      )}
    </div>
  );
}