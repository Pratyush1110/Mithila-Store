// app/api/payment/create-order/route.ts — POST to create Razorpay order
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json(); // amount in paise (INR * 100)

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    });

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}