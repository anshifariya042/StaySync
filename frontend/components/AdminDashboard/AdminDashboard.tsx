"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useDashboardOverview } from '@/hooks/useDashboard'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import StatsCard from '@/components/ui/StatsCard'

export default function AdminDashboard() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Dashboard')

    const { data: dashboardData, isLoading: loading } = useDashboardOverview(user?.hostelId)

    const stats = dashboardData?.stats || {
        totalRooms: 0,
        occupiedRooms: 0,
        pendingComplaints: 0,
        staffCount: 0,
        capacityPercentage: 0
    }
    const recentComplaints = dashboardData?.recentComplaints || []

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
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 min-h-screen">
                    <AdminHeader title="Dashboard Overview" onMenuClick={() => setSidebarOpen(true)} />
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
                                                    recentComplaints.map((item: any) => (
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
