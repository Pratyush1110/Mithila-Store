"use client";

import Link from 'next/link';
import ProductUploadForm from '@/components/admin/ProductUploadForm';

export default function NewProductPage() {
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
        Add New Masterpiece
      </h1>

      {/* Renders your beautiful, polished upload form container */}
      <ProductUploadForm />
    </div>
  );
}