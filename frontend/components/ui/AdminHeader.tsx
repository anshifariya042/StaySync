"use client"

import { useRouter } from 'next/navigation';
import Icon from './Icon';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  children?: React.ReactNode;
}

const AdminHeader = ({ title, onMenuClick, children }: AdminHeaderProps) => {
  const router = useRouter();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <Icon name="menu" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
        
        {/* Profile/User Menu */}
        <button 
          onClick={() => router.push('/user/profile')}
          className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors overflow-hidden"
          title="My Profile"
        >
          <Icon name="person" className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
