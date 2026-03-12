"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getDashboardOverview } from '@/services/adminService'
import { useAuth } from '@/context/AuthContext'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
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
)

const StatsCard = ({ icon, label, value, subtext, trend, trendColor }: {
    icon: string, label: string, value: string | number, subtext: string, trend?: string, trendColor?: string
}) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <span className={`p-2 rounded-lg ${trendColor ? trendColor.replace('text-', 'bg-').replace('600', '100 dark:bg-') + '900/30' : 'bg-primary/10 dark:bg-primary/20'} ${trendColor || 'text-primary'}`}>
                <Icon name={icon} />
            </span>
            {trend ? (
                <span className={`text-xs font-semibold ${trendColor || 'text-slate-400 uppercase tracking-wider'}`}>{trend}</span>
            ) : (
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            )}
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{subtext}</p>
    </div>
)

export default function AdminDashboard() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [stats, setStats] = useState({
        totalRooms: 0,
        occupiedRooms: 0,
        pendingComplaints: 0,
        staffCount: 0,
        capacityPercentage: 0
    })
    const [recentComplaints, setRecentComplaints] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getDashboardOverview()
                setStats(data.stats)
                setRecentComplaints(data.recentComplaints)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700'
            case 'In Progress': return 'bg-blue-100 text-blue-700'
            case 'Resolved': return 'bg-green-100 text-green-700'
            case 'High Priority': return 'bg-red-100 text-red-700'
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen">
            {/* Load Google Fonts and Icons */}
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <style jsx global>{`
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-primary">
                            <Icon name="sync_alt" className="text-3xl font-bold" />
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StaySync</span>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 space-y-1">
                        <SidebarItem icon="dashboard" label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => router.push('/admin/dashboard')} />
                        <SidebarItem icon="bed" label="Rooms" active={activeTab === 'Rooms'} onClick={() => router.push('/admin/rooms')} />
                        <SidebarItem icon="group" label="Residents" active={activeTab === 'Residents'} onClick={() => router.push('/admin/residents')} />
                        <SidebarItem icon="report_problem" label="Complaints" active={activeTab === 'Complaints'} onClick={() => router.push('/admin/complaints')} />
                        <SidebarItem icon="badge" label="Staff" active={activeTab === 'Staff'} onClick={() => router.push('/admin/staff')} />

                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                            <SidebarItem icon="settings" label="Settings" active={activeTab === 'Settings'} onClick={() => router.push('/admin/settings')} />
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@staysync.com'}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 min-h-screen">
                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                        <div className="flex items-center lg:hidden">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600 dark:text-slate-400">
                                <Icon name={sidebarOpen ? "close" : "menu"} />
                            </button>
                            <span className="ml-2 font-bold text-slate-900 dark:text-white">StaySync</span>
                        </div>
                        <h1 className="hidden lg:block text-lg font-semibold text-slate-900 dark:text-white">
                            {activeTab} Overview
                        </h1>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <Icon name="notifications" />
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden sm:flex">
                                <Icon name="add" className="text-sm" />
                                New Task
                            </button>
                        </div>
                    </header>

                    {/* Dashboard Body */}
                    <div className="p-6 space-y-8 flex-1 pb-24 lg:pb-6">
                        {loading ? (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatsCard icon="bed" label="Total" value={stats.totalRooms} subtext="Total Rooms" />
                                    <StatsCard 
                                        icon="meeting_room" 
                                        label={`${Math.round(stats.capacityPercentage)}% Capacity`} 
                                        value={stats.occupiedRooms} 
                                        subtext="Occupied Rooms" 
                                        trend={`${Math.round(stats.capacityPercentage)}% Capacity`} 
                                        trendColor={stats.capacityPercentage > 80 ? "text-amber-600" : "text-green-600"} 
                                    />
                                    <StatsCard 
                                        icon="warning" 
                                        label="Action Required" 
                                        value={stats.pendingComplaints} 
                                        subtext="Pending Complaints" 
                                        trend="Action Required" 
                                        trendColor={stats.pendingComplaints > 0 ? "text-amber-600" : "text-slate-400"} 
                                    />
                                    <StatsCard 
                                        icon="engineering" 
                                        label="Active" 
                                        value={stats.staffCount} 
                                        subtext="Staff Count" 
                                        trendColor="text-purple-600" 
                                    />
                                </div>

                                {/* Recent Complaints List */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints</h2>
                                        <button onClick={() => router.push('/admin/complaints')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint Title</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {recentComplaints.length > 0 ? (
                                                    recentComplaints.map(item => (
                                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                                                <p className="text-xs text-slate-500">{formatTime(item.time)}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                                    {item.room}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button className="text-sm font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">View Details</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                                                            No recent complaints found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Mobile Nav Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-3 pt-2 shadow-2xl">
                <div className="flex gap-2 justify-around">
                    {[
                        { icon: 'dashboard', label: 'Home', path: '/admin/dashboard' },
                        { icon: 'bed', label: 'Rooms', path: '/admin/rooms' },
                        { icon: 'group', label: 'Residents', path: '/admin/residents' },
                        { icon: 'report_problem', label: 'Reports', path: '/admin/complaints' },
                        { icon: 'settings', label: 'Settings', path: '/admin/settings' }
                    ].map(item => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center gap-1 ${(activeTab === (item.label === 'Home' ? 'Dashboard' : item.label)) ? 'text-primary' : 'text-slate-400'}`}
                        >
                            <Icon name={item.icon} />
                            <p className="text-[10px] font-medium leading-normal tracking-[0.015em]">{item.label}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Backdrop for mobile sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
