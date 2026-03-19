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
    <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <Icon name="menu" className="material-symbols-outlined" />
        </button>
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <button 
          onClick={() => router.push('/user/profile')}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-border-light text-slate-600 hover:bg-slate-200 transition-colors"
          title="My Profile"
        >
          <Icon name="person" className="material-symbols-outlined text-lg" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
