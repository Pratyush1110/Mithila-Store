// app/page.tsx — Homepage (Server Component)
// Fetches featured products at build/request time via Supabase.
// Mithila paintings are always rendered first.

import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import HeroSection    from '@/components/shop/HeroSection';
import FeaturedGrid   from '@/components/shop/FeaturedGrid';
import StoryBanner    from '@/components/shop/StoryBanner';
import CategoryStrip  from '@/components/shop/CategoryStrip';

// ISR: revalidate every 60 s so the free-tier DB isn't hammered
export const revalidate = 60;

async function getFeaturedProducts(): Promise<{
  paintings: Product[];
  knitting:  Product[];
}> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error || !data) return { paintings: [], knitting: [] };

  return {
    paintings: data.filter(p => p.category === 'mithila_painting'),
    knitting:  data.filter(p => p.category === 'knitting'),
  };
}

export default async function HomePage() {
  const { paintings, knitting } = await getFeaturedProducts();

  return (
    <>
      {/* Full-bleed hero with primary Mithila focus */}
      <HeroSection />

      {/* Category nav strip */}
      <CategoryStrip />

      {/* Featured Mithila Paintings — always primary */}
      {paintings.length > 0 && (
        <FeaturedGrid
          products={paintings}
          heading="Featured Mithila Paintings"
          subheading="Each piece is hand-painted with natural pigments, carrying centuries of tradition."
          variant="primary"
        />
      )}

      {/* Cultural story interstitial */}
      <StoryBanner />

      {/* Knitting — secondary section */}
      {knitting.length > 0 && (
        <FeaturedGrid
          products={knitting}
          heading="Handknitted Pieces"
          subheading="Made with the same meditative patience as Mithila art."
          variant="secondary"
        />
      )}
    </>
  );
}
