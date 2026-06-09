// app/api/orders/route.ts — POST to create an order
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { CartItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,              // CartItem[]
      razorpay_order_id,
    }: {
      customer_name:    string;
      customer_email:   string;
      customer_phone?:  string;
      shipping_address: string;
      items:            CartItem[];
      razorpay_order_id: string;
    } = body;

    // Validate
    if (!customer_name || !customer_email || !shipping_address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const total_amount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone ?? null,
        shipping_address,
        total_amount,
        razorpay_order_id,
        payment_status:   'pending',
        production_status: 'received',
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message ?? 'Failed to create order.' }, { status: 500 });
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id:          order.id,
      product_id:        item.product.id,
      quantity:          item.quantity,
      price_at_purchase: item.product.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
