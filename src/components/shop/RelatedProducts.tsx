import type { Product } from '@/types';
import ProductCard from './ProductCard';
export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section style={{ paddingTop: '64px', borderTop: '1px solid #E8E4DC' }}>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#1A1714', marginBottom: '32px' }}>You may also like</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
