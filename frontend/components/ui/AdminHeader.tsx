"use client"

import { useRouter } from 'next/navigation';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
  children?: React.ReactNode;
}

const AdminHeader = ({ title, onMenuClick, children }: AdminHeaderProps) => {
  const router = useRouter();

  return (
    <header className="h-24 bg-[#F8FAFC]/80 backdrop-blur-md flex items-center justify-between px-10 shrink-0 sticky top-0 z-40 border-b border-[#B8E3E9]/20">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2.5 bg-white rounded-[18px] border-2 border-[#B8E3E9] shadow-[0_4px_12px_rgba(184,227,233,0.2)] hover:bg-[#B8E3E9]/10 transition-all duration-300 active:scale-95 flex items-center justify-center group"
        >
          <Icon name="menu" className="text-[#4F7C82] group-hover:scale-110 transition-transform" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#13454d] tracking-tight">
            {title}
          </h2>
          <p className="text-[10px] font-bold text-[#4F7C82] uppercase tracking-[0.2em] opacity-60 mt-0.5">Administrative Controls</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {children}
        <NotificationDropdown />
        <button 
          onClick={() => router.push('/user/profile')}
          className="size-12 rounded-2xl bg-white flex items-center justify-center border border-white text-[#4F7C82] hover:text-[#0B2E33] shadow-sm hover:shadow-lg transition-all active:scale-95 group"
          title="My Profile"
        >
          <Icon name="person" className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
