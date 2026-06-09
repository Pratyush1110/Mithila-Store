// app/admin/layout.tsx — Admin shell layout
// Route is protected by middleware.ts (checks for admin session cookie)

import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin — Mithila Art Studio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
