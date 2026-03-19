"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore as useAuth } from '@/store/useAuthStore';
import Icon from './Icon';

interface SidebarItemProps {
  icon: string;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 w-full font-medium transition-all duration-200 ${active
      ? 'bg-white/5 text-accent border-r-2 border-accent'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
  >
    <Icon name={icon} className="material-symbols-outlined" />
    <span className="text-sm">{label}</span>
  </button>
);

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'meeting_room', label: 'Rooms', path: '/admin/rooms' },
    { icon: 'group', label: 'Residents', path: '/admin/residents' },
    { icon: 'report_problem', label: 'Complaints', path: '/admin/complaints' },
    { icon: 'badge', label: 'Staff', path: '/admin/staff' },
  ];

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-sidebar text-slate-300 flex flex-col shrink-0 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-2">
          <Icon name="corporate_fare" className="text-accent text-3xl font-bold material-symbols-outlined" />
          <h1 className="text-xl font-bold tracking-tight text-white">StaySync</h1>
        </div>
        
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={pathname === item.path}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
            />
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={() => {
              router.push('/admin/settings');
              onClose();
            }}
            className={`flex items-center gap-3 px-2 py-3 mb-4 w-full rounded-lg transition-colors text-slate-300 hover:bg-white/5 hover:text-white ${pathname === '/admin/settings' ? 'bg-white/5 text-accent' : ''}`}
          >
            <Icon name="settings" className="material-symbols-outlined" />
            <span>Settings</span>
          </button>
          
          <div 
            onClick={() => router.push('/user/profile')}
            className="flex items-center gap-3 px-2 py-2 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-sm font-semibold text-white truncate">{user?.name || 'Admin User'}</span>
              <span className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@gmail.com'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
