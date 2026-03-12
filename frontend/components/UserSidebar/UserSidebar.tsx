"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useUserStore } from '@/store/useUserStore'
import { useEffect } from 'react'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

const SidebarItem = ({ icon, label, path, active, onClick }: { icon: string, label: string, path?: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full font-semibold transition-colors ${active
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
    >
        <Icon name={icon} />
        {label}
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
        { icon: 'dashboard', label: 'Dashboard', path: '/user/dashboard' },
        { icon: 'domain', label: 'My Hostel', path: '/user/my-hostel' },
        { icon: 'add_box', label: 'Raise Complaint', path: '/user/complaints/new' },
        // { icon: 'history_edu', label: 'My Complaints', path: '/user/complaints' },
        { icon: 'person', label: 'Profile', path: '/user/profile' },
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
                        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <Icon name="sync" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">StaySync</h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={isActive(item.path)}
                            onClick={() => {
                                router.push(item.path)
                                setSidebarOpen(false)
                            }}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-3">
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} className="w-full h-full object-cover" alt="User avatar" />
                            ) : (
                                <Icon name="person" className="text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-bold truncate">{profile?.name || 'User'}</p>
                            <p className="text-xs text-slate-500">{profile?.status === 'occupied' ? 'Resident Member' : 'Premium Member'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 px-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg w-full mt-2 transition-colors text-sm font-semibold"
                    >
                        <Icon name="logout" className="text-sm" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}
