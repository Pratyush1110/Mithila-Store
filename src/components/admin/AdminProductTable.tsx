"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  type: string;
  images: string[];
  created_at: string;
}

export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this artwork? This cannot be undone.')) return;

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err: unknown) {
      alert('Error deleting product: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  const formatText = (text: string) => {
    if (!text) return '';
    return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) {
    return <div className="py-12 text-[#6B6057] font-['DM_Sans'] animate-pulse">Loading gallery...</div>;
  }

  if (error) {
    return <div className="py-12 text-red-600 font-['DM_Sans']">Error: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-[#E8E4DC] bg-[#FAFAF7]">
        <p className="text-[#6B6057] font-['DM_Sans'] text-lg">No artworks found. Add your first masterpiece.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF7] border border-[#E8E4DC] overflow-hidden">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="border-b border-[#E8E4DC] bg-[#F0EDE6]">
            <th className="py-4 px-6 font-['DM_Sans'] font-medium text-[#1A1714] text-sm tracking-wide w-1/2">Artwork</th>
            <th className="py-4 px-6 font-['DM_Sans'] font-medium text-[#1A1714] text-sm tracking-wide w-1/8">Price</th>
            <th className="py-4 px-6 font-['DM_Sans'] font-medium text-[#1A1714] text-sm tracking-wide w-1/8">Category</th>
            <th className="py-4 px-6 font-['DM_Sans'] font-medium text-[#1A1714] text-sm tracking-wide w-1/8">Type</th>
            <th className="py-4 px-6 font-['DM_Sans'] font-medium text-[#1A1714] text-sm tracking-wide text-right w-1/8">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8E4DC]">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-white transition-colors duration-200">
              {/* Artwork Title & Compressed Thumbnail Column */}
              <td className="py-4 px-6 flex items-center gap-4">
                <div 
                  style={{ width: '60px', height: '60px', minWidth: '60px', minHeight: '60px' }} 
                  className="bg-[#E8E4DC] overflow-hidden border border-[#E8E4DC] relative flex-shrink-0 rounded-none"
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9B9187] text-[10px]">No Image</div>
                  )}
                </div>
                <span className="font-['Playfair_Display'] font-medium text-[#1A1714] text-base truncate">
                  {product.title}
                </span>
              </td>
              <td className="py-4 px-6 font-['DM_Sans'] text-[#6B6057] text-sm whitespace-nowrap">
                ₹{product.price.toLocaleString('en-IN')}
              </td>
              <td className="py-4 px-6 font-['DM_Sans'] text-[#6B6057] text-sm">
                {formatText(product.category)}
              </td>
              <td className="py-4 px-6 font-['DM_Sans'] text-[#6B6057] text-sm">
                {formatText(product.type)}
              </td>
              <td className="py-4 px-6 text-right">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="font-['DM_Sans'] text-xs text-red-600 hover:text-red-800 transition-colors duration-200 uppercase tracking-wider font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}