// app/shop/[id]/page.tsx — Product Detail (Server Component)
// Renders the full product story, image gallery, and add-to-cart CTA.

import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { notFound }         from 'next/navigation';
import type { Metadata }    from 'next';
import ProductGallery       from '@/components/shop/ProductGallery';
import ProductInfo          from '@/components/shop/ProductInfo';
import RelatedProducts      from '@/components/shop/RelatedProducts';

export const revalidate = 60;

interface PageProps {
  params: { id: string };
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

// Dynamic SEO metadata per product
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title:       `${product.title} — Mithila Art Studio`,
    description: product.description,
    openGraph: {
      title:  product.title,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-muted)] mb-8">
        <a href="/"    className="hover:text-[var(--color-primary)]">Home</a>
        {' / '}
        <a href="/shop" className="hover:text-[var(--color-primary)]">Shop</a>
        {' / '}
        <span>{product.title}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo    product={product} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <RelatedProducts products={related} />
      )}
    </div>
  );
}
