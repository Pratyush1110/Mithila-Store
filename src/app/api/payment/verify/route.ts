// app/api/payment/verify/route.ts — POST to verify Razorpay signature
import { NextRequest, NextResponse }  from 'next/server';
import crypto                         from 'crypto';
import { supabaseAdmin }              from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // Verify HMAC signature
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    // Mark order as captured in Supabase
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        razorpay_payment_id,
        payment_status: 'captured',
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
