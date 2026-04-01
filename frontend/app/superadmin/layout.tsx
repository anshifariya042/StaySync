'use client';

import React, { useState } from 'react';
import SuperAdminSidebar from '@/components/ui/SuperAdminSidebar';
import AdminHeader from '@/components/ui/AdminHeader';
import { usePathname } from 'next/navigation';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes('/approvals')) return 'Hostel Approvals';
    if (pathname.includes('/hostels')) return 'All Hostels';
    if (pathname.includes('/users')) return 'Users Management';
    if (pathname.includes('/complaints')) return 'System Complaints';
    // if (pathname.includes('/analytics')) return 'Platform Analytics';
    return 'Super Admin Dashboard';
  };

  return (
    <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased flex">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Public Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-h-screen flex flex-col lg:pl-[280px]">
        <AdminHeader title={getPageTitle()} onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-screen lg:min-h-0 bg-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
