// app/admin/products/page.tsx — Product Manager (Server Component)

import { supabase } from '@/lib/supabase';
import type { Product }  from '@/types';
import AdminProductTable from '@/components/admin/AdminProductTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <a
          href="/admin/products/new"
          className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg
                     hover:bg-[var(--color-primary-hover)] transition-colors font-medium"
        >
          + Add Product
        </a>
      </div>
      <AdminProductTable products={(products as Product[]) ?? []} />
    </div>
  );
}
