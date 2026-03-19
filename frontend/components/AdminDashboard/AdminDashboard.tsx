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
        <div className="bg-background-dashboard text-slate-800 flex h-screen overflow-hidden antialiased">
            <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title="Dashboard Overview" onMenuClick={() => setSidebarOpen(true)} />
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatsCard icon="bed" label="Total" value={stats.totalRooms} subtext="Total Rooms" />
                                <StatsCard 
                                    icon="door_front" 
                                    label="Capacity" 
                                    value={stats.occupiedRooms} 
                                    subtext="Occupied Rooms" 
                                    trend={`${Math.round(stats.capacityPercentage)}% Capacity`} 
                                    trendColor="text-emerald-600" 
                                />
                                <StatsCard 
                                    icon="warning" 
                                    label="Action Required" 
                                    value={stats.pendingComplaints} 
                                    subtext="Pending Complaints" 
                                    trend="Action Required" 
                                    trendColor="text-orange-600" 
                                />
                                <StatsCard 
                                    icon="engineering" 
                                    label="Total" 
                                    value={stats.staffCount} 
                                    subtext="Staff Count" 
                                    trendColor="text-slate-400" 
                                />
                            </div>

                            {/* Recent Complaints Table */}
                            <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border-light flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800">Recent Complaints</h3>
                                    <button onClick={() => router.push('/admin/complaints')} className="text-sm font-semibold text-orange-600 hover:text-orange-700">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Complaint Title</th>
                                                <th className="px-6 py-4">Room</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-light">
                                            {recentComplaints.length > 0 ? (
                                                recentComplaints.map((item: any) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                                        <td className="px-6 py-5">
                                                            <div className="font-bold text-slate-800">{item.title}</div>
                                                            <div className="text-[10px] text-slate-400 font-medium">{new Date(item.time).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                                {item.room}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button className="text-sm font-bold text-orange-600 hover:text-orange-700">View Details</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">
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



