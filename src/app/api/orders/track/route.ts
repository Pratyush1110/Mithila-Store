// app/api/orders/track/route.ts — GET order by email or razorpay_order_id
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ error: 'Please provide an order ID or email.' }, { status: 400 });
  }

  const isEmail = q.includes('@');

  const query = supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        id, quantity, price_at_purchase,
        product:product_id ( id, title, images, category )
      )
    `);

  const { data, error } = isEmail
    ? await query.eq('customer_email', q).order('created_at', { ascending: false }).limit(5)
    : await query.eq('razorpay_order_id', q).limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No order found. Check your details and try again.' }, { status: 404 });
  }

  // Return single order (by ID) or most recent (by email)
  return NextResponse.json({ order: isEmail ? data[0] : data[0] });
}
