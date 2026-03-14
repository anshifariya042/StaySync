"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'
import { useEffect } from 'react'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl w-full transition-all duration-300 group relative ${active
            ? 'bg-[#ec5b13]/5 text-[#ec5b13]'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        {/* Active Indicator Line */}
        {active && (
            <motion.div 
                layoutId="activeNav"
                className="absolute left-0 w-1 h-6 bg-[#ec5b13] rounded-r-full"
            />
        )}
        
        <Icon name={icon} className={`${active ? 'text-[#ec5b13] font-fill' : 'text-slate-400 group-hover:text-slate-600'} transition-colors duration-200`} />
        <span className={`text-[15px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
)

interface UserSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function UserSidebar({ sidebarOpen, setSidebarOpen }: UserSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { logout } = useAuth()
    const { profile, fetchProfile } = useUserStore()

    useEffect(() => {
        if (!profile) {
            fetchProfile()
        }
    }, [profile, fetchProfile])

    const navItems = [
        { icon: 'grid_view', label: 'Dashboard', path: '/user/dashboard' },
        { icon: 'person', label: 'My Profile', path: '/user/profile' },
        { icon: 'domain', label: 'My Hostel', path: '/user/my-hostel' },
        { icon: 'edit_square', label: 'Raise Complaint', path: '/user/complaints/new' },
    ]

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-md lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-full max-w-[280px] bg-white border-r border-slate-100 flex flex-col p-6 transition-transform duration-500 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand Logo */}
                <Link 
                    href="/" 
                    className="flex items-center gap-3 mb-12 px-2 group"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="size-10 bg-[#ec5b13] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ec5b13]/20 group-hover:rotate-12 transition-transform duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter">StaySync</h1>
                    </div>
                </Link>

                <nav className="flex-1 space-y-8" data-purpose="main-navigation">
                    <div>
                        <ul className="space-y-1.5">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <SidebarItem
                                        icon={item.icon}
                                        label={item.label}
                                        active={isActive(item.path)}
                                        onClick={() => {
                                            router.push(item.path)
                                            setSidebarOpen(false)
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Profile Card Section */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div 
                        onClick={() => {
                            router.push('/user/profile')
                            setSidebarOpen(false)
                        }}
                        className="bg-slate-50 rounded-[2rem] p-4 mb-4 flex items-center gap-3 border border-slate-100/50 cursor-pointer hover:bg-slate-100 transition-colors group"
                    >
                        <div className="size-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} className="w-full h-full object-cover" alt="User avatar" />
                            ) : (
                                <Icon name="person" className="text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-slate-900">{profile?.name || 'User'}</p>
                            <p className="text-[10px] font-bold text-[#ec5b13] truncate uppercase tracking-tight">Active Resident</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl w-full transition-all duration-300 text-[14px] font-bold group"
                    >
                        <Icon name="logout" className="text-[20px] group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
