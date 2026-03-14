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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full font-medium transition-colors ${active
      ? 'bg-primary/10 text-primary'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
  >
    <Icon name={icon} />
    {label}
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
    { icon: 'bed', label: 'Rooms', path: '/admin/rooms' },
    { icon: 'group', label: 'Residents', path: '/admin/residents' },
    { icon: 'report_problem', label: 'Complaints', path: '/admin/complaints' },
    { icon: 'badge', label: 'Staff', path: '/admin/staff' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6">
        <div className="flex items-center gap-2 text-primary">
          <Icon name="sync_alt" className="text-3xl font-bold" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StaySync</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
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

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <SidebarItem 
            icon="settings" 
            label="Settings" 
            path="/admin/settings"
            active={pathname === '/admin/settings'}
            onClick={() => {
              router.push('/admin/settings');
              onClose();
            }}
          />
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div 
          onClick={() => router.push('/user/profile')}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white group-hover:text-primary transition-colors">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@staysync.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
