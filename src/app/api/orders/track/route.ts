// app/api/orders/track/route.ts — GET order by email AND order identification details securely
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  // 1. ✅ RESOLVE BUILD ERROR: Add strict null-safety defense checks for the admin client initialization
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Internal Server Error: Database administrative client configuration is missing.' },
      { status: 500 }
    );
  }

  const email = req.nextUrl.searchParams.get('email')?.trim();
  const orderId = req.nextUrl.searchParams.get('orderId')?.trim();

  // 2. ✅ PLUG SECURITY HOLE: Require BOTH factors together so attackers cannot scan emails to dump names & addresses
  if (!email || !orderId) {
    return NextResponse.json(
      { error: 'Both email and orderId search parameters are required to securely track tracking summaries.' },
      { status: 400 }
    );
  }

  try {
    // Construct database pipeline safely with guaranteed non-null assertion
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          id, quantity, price_at_purchase,
          product:product_id ( id, title, images, category )
        )
      `)
      .eq('customer_email', email)
      .eq('razorpay_order_id', orderId) // Validates exact ownership association
      .maybeSingle(); // Clean lookup handling single row responses or null mapping safely

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No matching order found. Please check your tracking details and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}