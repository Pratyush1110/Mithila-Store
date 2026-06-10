// app/admin/page.tsx — Admin Dashboard (Server Component)
// Shows order summary stats + recent orders table.

import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import AdminOrderTable  from '@/components/admin/AdminOrderTable';
import AdminStatCards   from '@/components/admin/AdminStatCards';

export const dynamic = 'force-dynamic'; // always fresh for admin

async function getDashboardData() {
  const [ordersRes, revenueRes] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('orders')
      .select('total_amount, payment_status, production_status'),
  ]);

  const orders: Order[]  = ordersRes.data   ?? [];
  const allOrders        = revenueRes.data  ?? [];

  const totalRevenue = allOrders
    .filter(o => o.payment_status === 'captured')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const stats = {
    totalOrders:   allOrders.length,
    totalRevenue,
    pending:       allOrders.filter(o => o.production_status === 'received').length,
    inProgress:    allOrders.filter(o => o.production_status === 'painting').length,
    shipped:       allOrders.filter(o => o.production_status === 'shipped').length,
    delivered:     allOrders.filter(o => o.production_status === 'delivered').length,
  };

  return { orders, stats };
}

export default async function AdminDashboardPage() {
  const { orders, stats } = await getDashboardData();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <AdminStatCards stats={stats} />
      <div className="mt-10">
        <h2 className="font-display text-2xl mb-4">Recent Orders</h2>
        <AdminOrderTable orders={orders} />
      </div>
    </div>
  );
}
