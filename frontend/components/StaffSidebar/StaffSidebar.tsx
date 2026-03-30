"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore as useAuth } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full transition-all duration-300 group relative ${active
            ? 'bg-[#0B2E33] text-white shadow-lg shadow-[#0B2E33]/20'
            : 'text-[#4F7C82] hover:bg-white/50 hover:text-[#0B2E33]'
            }`}
    >
        <Icon name={icon} className={`${active ? 'text-white' : 'text-[#4F7C82] group-hover:text-[#0B2E33]'} transition-colors duration-200`} />
        <span className={`text-[15px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
)

interface StaffSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function StaffSidebar({ isOpen, setIsOpen }: StaffSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/staff/dashboard", icon: "grid_view" },
        { label: "My Tasks", href: "/staff/tasks", icon: "assignment" },
        // { label: "Messages", href: "/staff/chat", icon: "forum" },
        { label: "My Profile", href: "/staff/profile", icon: "person" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[60] bg-[#0B2E33]/10 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-full max-w-[280px] bg-[#B8E3E9] border-r border-[#4F7C82]/10 flex flex-col p-6 transition-transform duration-500 ease-in-out lg:static
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand Logo */}
                <Link 
                    href="/" 
                    className="flex items-center gap-3 mb-12 px-2 group"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="size-10 bg-[#0B2E33] rounded-xl flex items-center justify-center text-[#B8E3E9] shadow-lg shadow-[#0B2E33]/10 group-hover:rotate-12 transition-transform duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0B2E33] tracking-tighter">StaySync</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4F7C82] opacity-60">Staff Portal</p>
                    </div>
                </Link>

                <nav className="flex-1 space-y-1.5">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={isActive(item.href)}
                            onClick={() => {
                                router.push(item.href)
                                setIsOpen(false)
                            }}
                        />
                    ))}
                </nav>

                {/* Profile Card Section */}
                <div className="mt-auto pt-6 border-t border-[#4F7C82]/10">
                    <div 
                        onClick={() => {
                            router.push('/staff/profile')
                            setIsOpen(false)
                        }}
                        className="flex items-center gap-4 px-4 py-3 bg-white/30 rounded-[1.5rem] cursor-pointer hover:bg-white/50 transition-all duration-300 border border-white/20 mb-4"
                    >
                        <div className="size-10 rounded-xl bg-[#0B2E33] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                            {user?.name?.[0] || 'S'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-[#0B2E33] truncate">{user?.name || 'Staff Member'}</span>
                            <span className="text-[10px] font-bold text-[#4F7C82] truncate uppercase tracking-widest opacity-60">Operations</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-4 px-4 py-3.5 text-[#4F7C82] hover:text-[#0B2E33] hover:bg-white/30 rounded-2xl w-full transition-all duration-300 text-[14px] font-bold group"
                    >
                        <Icon name="logout" className="text-[20px] group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
