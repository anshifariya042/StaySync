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
            ? 'bg-[#0B2E33] text-white shadow-lg shadow-[#0B2E33]/20'
            : 'text-[#4F7C82] hover:bg-white/50 hover:text-[#0B2E33]'
            }`}
    >
        <Icon name={icon} className={`${active ? 'text-white' : 'text-[#4F7C82] group-hover:text-[#0B2E33]'} transition-colors duration-200`} />
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
        { icon: 'history', label: 'Previous Hostels', path: '/user/previous-hostels' },
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
                        className="fixed inset-0 z-[60] bg-[#0B2E33]/10 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-full max-w-[280px] bg-[#B8E3E9] border-r border-[#4F7C82]/10 flex flex-col p-6 transition-transform duration-500 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Brand Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 mb-12 px-2 group"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="size-10 bg-[#0B2E33] rounded-xl flex items-center justify-center text-[#B8E3E9] shadow-lg shadow-[#0B2E33]/10 group-hover:rotate-12 transition-transform duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#0B2E33] tracking-tighter">StaySync</h1>
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
                <div className="mt-auto pt-6 border-t border-[#4F7C82]/10">
                    <div
                        onClick={() => {
                            router.push('/user/profile')
                            setSidebarOpen(false)
                        }}
                    >

                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 text-[#4F7C82] hover:text-[#0B2E33] hover:bg-white/30 rounded-2xl w-full transition-all duration-300 text-[14px] font-bold group"
                    >
                        <Icon name="logout" className="text-[20px] group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
