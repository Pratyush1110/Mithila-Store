import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/types';
import ProductCard from '@/components/shop/ProductCard';
import ShopFilters from '@/components/shop/ShopFilters';

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: {
    category?: ProductCategory;
    type?: 'ready_to_ship' | 'made_to_order';
    sort?: 'newest' | 'price_asc' | 'price_desc';
  };
}

async function getProducts(params: ShopPageProps['searchParams']): Promise<Product[]> {
  // Fetch everything matching the category/type filters, unsorted here —
  // sorting happens client-side below, uniformly, with no category
  // splitting anywhere in the pipeline.
  let query = supabase.from('products').select('*');

  if (params.category) {
    query = query.eq('category', params.category);
  }
  if (params.type) {
    query = query.eq('type', params.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch products:', error.message);
    return [];
  }

  const products = data ?? [];

  switch (params.sort) {
    case 'price_asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price_desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return [...products].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const products = await getProducts(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ink)] mb-3">
          The Shop
        </h1>
        <p className="text-[var(--color-muted)] text-lg">
          Authentic Mithila paintings and handknitted pieces — made with tradition.
        </p>
      </div>

      <ShopFilters active={searchParams} />

      {products.length === 0 ? (
        <p className="text-center text-[var(--color-muted)] mt-24 text-lg">
          No products found. Check back soon!
        </p>
      ) : (
        // grid-cols-N in Tailwind compiles to repeat(N, minmax(0, 1fr)) —
        // the minmax(0, ...) is what stops a child (e.g. an image) from
        // blowing out its track and collapsing everything to one column.
        // min-w-0 below is a second guard on each grid item for the same reason.
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}