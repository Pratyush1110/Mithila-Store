// app/shop/page.tsx — Shop Listing (Server Component)
// Mithila paintings are always fetched + rendered before knitting.

import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/types';
import ProductCard   from '@/components/shop/ProductCard';
import ShopFilters   from '@/components/shop/ShopFilters';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: {
    category?: ProductCategory;
    type?:     'ready_to_ship' | 'made_to_order';
    sort?:     'newest' | 'price_asc' | 'price_desc';
  };
}

async function getProducts(params: ShopPageProps['searchParams']): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*');

  // Category filter — default to mithila_painting first if no filter set
  if (params.category) {
    query = query.eq('category', params.category);
  }
  if (params.type) {
    query = query.eq('type', params.type);
  }

  // Sorting
  switch (params.sort) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  const { data } = await query.limit(50);

  if (!data) return [];

  // If no category filter: paintings always surface first
  if (!params.category) {
    return [
      ...data.filter(p => p.category === 'mithila_painting'),
      ...data.filter(p => p.category === 'knitting'),
    ];
  }
  return data;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const products = await getProducts(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ink)] mb-3">
          The Shop
        </h1>
        <p className="text-[var(--color-muted)] text-lg">
          Authentic Mithila paintings and handknitted pieces — made with tradition.
        </p>
      </div>

      {/* Filters */}
      <ShopFilters active={searchParams} />

      {/* Product grid */}
      {products.length === 0 ? (
        <p className="text-center text-[var(--color-muted)] mt-24 text-lg">
          No products found. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
