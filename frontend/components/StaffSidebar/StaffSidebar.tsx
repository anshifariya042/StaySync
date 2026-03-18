"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    ClipboardList, 
    MessageSquare, 
    User,
    LogOut,
    RotateCw,
    X
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Tasks", href: "/staff/tasks", icon: ClipboardList },
    { label: "Chat", href: "/staff/chat", icon: MessageSquare },
    { label: "Profile", href: "/staff/profile", icon: User },
];

interface StaffSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function StaffSidebar({ isOpen, setIsOpen }: StaffSidebarProps) {
    const pathname = usePathname();

    const { clearProfile } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        clearProfile();
        router.push("/login");
    };

    return (
        <aside className={`
            fixed md:sticky top-0 left-0 z-50
            w-64 h-screen 
            bg-white dark:bg-slate-900 
            border-r border-slate-200 dark:border-slate-800 
            flex flex-col 
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 relative">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                        <RotateCw className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StaySync</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Staff Portal</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isActive 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
