// app/api/products/route.ts — GET all products (with optional filters)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge'; // free-tier friendly

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category  = searchParams.get('category');
  const type      = searchParams.get('type');
  const featured  = searchParams.get('featured');

  let query = supabase.from('products').select('*');

  if (category) query = query.eq('category', category);
  if (type)     query = query.eq('type', type);
  if (featured) query = query.eq('is_featured', featured === 'true');

  // Paintings first
  query = query
    .order('category', { ascending: false }) // mithila_painting > knitting alphabetically
    .order('created_at', { ascending: false });

  const { data, error } = await query.limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}
