import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import RelatedProducts from '@/components/shop/RelatedProducts';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ProductGallery from '@/components/shop/ProductGallery';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

async function getRelated(product: Product): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4);
  return data ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} — Mithila Art Studio`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await getRelated(product);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--color-muted)] mb-8">
        <a href="/" className="hover:text-[var(--color-primary)]">Home</a>
        {' / '}
        <a href="/shop" className="hover:text-[var(--color-primary)]">Shop</a>
        {' / '}
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="max-h-[500px] w-full">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div>
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C8A96E',
              marginBottom: '12px',
            }}
          >
            {product.category === 'mithila_painting' ? 'Mithila Painting' : 'Knitting'}
          </p>

          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1A1714',
              marginBottom: '8px',
              lineHeight: 1.15,
            }}
          >
            {product.title}
          </h1>

          {product.size && (
            <p
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: '0.875rem',
                color: '#9B9187',
                marginBottom: '20px',
              }}
            >
              {product.size}
            </p>
          )}

          <p
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1A1714',
              marginBottom: '28px',
            }}
          >
            {formatINR(product.price)}
          </p>

          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '1rem',
              color: '#6B6057',
              lineHeight: 1.75,
              marginBottom: product.story ? '28px' : '32px',
            }}
          >
            {product.description}
          </p>

          {product.story && (
            <div
              style={{
                background: '#FAF8F4',
                border: '1px solid #E8E4DC',
                borderLeft: '3px solid #C8A96E',
                padding: '24px 28px',
                marginBottom: '32px',
              }}
            >
              <p
                style={{
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C8A96E',
                  marginBottom: '12px',
                }}
              >
                The Story Behind the Art
              </p>
              <p
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: '#4A3F36',
                  lineHeight: 1.85,
                  margin: 0,
                  paddingLeft: '12px',
                  borderLeft: '1px solid #E0D8CB',
                }}
              >
                {product.story}
              </p>
            </div>
          )}

          <AddToCartButton product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <RelatedProducts products={related} />
      )}
    </div>
  );
}