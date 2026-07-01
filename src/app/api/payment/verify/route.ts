// app/api/payment/verify/route.ts — POST to verify Razorpay signature
import { NextRequest, NextResponse } from 'next/server';
import crypto                        from 'crypto';
import { supabase }             from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields.' }, { status: 400 });
    }

    // Verify HMAC SHA256 signature: order_id|payment_id signed with key secret
    const body     = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(razorpay_signature, 'hex'),
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 });
    }

    // Mark order as paid and move into production pipeline
    const { error, data } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id,
        payment_status:    'captured',
        production_status: 'received',
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Order not found for given razorpay_order_id.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch {
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}