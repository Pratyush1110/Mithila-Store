// src/app/api/admin/orders/route.ts
// GET  — fetch all orders (admin only, service role)
// PATCH — update production_status for a single order
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { ProductionStatus } from '@/types';

// Build the admin client inline so this file never imports the nullable
// supabaseAdmin from lib/supabase.ts — guaranteed server-only context.
function getAdminClient() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, service, { auth: { persistSession: false } });
}

function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminClient();
  const { data, error } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { id: string; production_status: ProductionStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { id, production_status } = body;
  if (!id || !production_status) {
    return NextResponse.json({ error: 'id and production_status are required.' }, { status: 400 });
  }

  const VALID: ProductionStatus[] = ['received', 'painting', 'shipped', 'delivered'];
  if (!VALID.includes(production_status)) {
    return NextResponse.json({ error: 'Invalid production_status value.' }, { status: 400 });
  }

  const db = getAdminClient();
  const { error } = await db
    .from('orders')
    .update({ production_status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}