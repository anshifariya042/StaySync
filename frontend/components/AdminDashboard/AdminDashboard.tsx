"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useDashboardOverview } from '@/hooks/useDashboard'

import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import StatsCard from '@/components/ui/StatsCard'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function AdminDashboard() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const { data: dashboardData, isLoading: loading } = useDashboardOverview(user?.hostelId)

    const statsData = dashboardData?.stats || {
        totalRooms: 0,
        occupiedRooms: 0,
        pendingComplaints: 0,
        staffCount: 0,
        capacityPercentage: 0
    }
    const recentComplaints = dashboardData?.recentComplaints || []

    return (
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased flex">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen flex flex-col lg:pl-72">
                <AdminHeader title="Admin Overview" onMenuClick={() => setSidebarOpen(true)} />
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-6xl mx-auto w-full">
                        
                        {loading ? (
                            <div className="py-24 text-center">
                                <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                                <p className="text-sm font-black text-[#4F7C82] uppercase tracking-[0.2em]">Synchronizing Overview...</p>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    <StatsCard 
                                        icon="bed" 
                                        label="Total Rooms" 
                                        value={statsData.totalRooms} 
                                        subtext="Available Inventory" 
                                        index={0}
                                    />
                                    <StatsCard 
                                        icon="door_front" 
                                        label="Occupied" 
                                        value={statsData.occupiedRooms} 
                                        subtext={`${Math.round(statsData.capacityPercentage)}% Usage`} 
                                        index={1}
                                    />
                                    <StatsCard 
                                        icon="warning" 
                                        label="Pending" 
                                        value={statsData.pendingComplaints} 
                                        subtext="Needs Attention" 
                                        index={2}
                                    />
                                    <StatsCard 
                                        icon="engineering" 
                                        label="Staff" 
                                        value={statsData.staffCount} 
                                        subtext="Active Personnel" 
                                        index={3}
                                    />
                                </div>

                                {/* Recent Complaints Section */}
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-50 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div>
                                            <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">complaints</h2>
                                            <p className="text-xs font-bold text-[#4F7C82] uppercase tracking-[0.1em] mt-1 opacity-70">Active maintenance complaints</p>
                                        </div>
                                        <button 
                                            onClick={() => router.push('/admin/complaints')}
                                            className="px-6 py-2.5 bg-[#B8E3E9]/30 text-[#4F7C82] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#B8E3E9]/50 transition-all active:scale-95"
                                        >
                                            View complaints
                                        </button>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        {recentComplaints.length > 0 ? (
                                            recentComplaints.map((item: any, idx: number) => (
                                                <motion.div 
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] hover:border-[#B8E3E9]/30 transition-all duration-300 gap-5 group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="size-14 rounded-[1.25rem] bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-[#B8E3E9]/20 transition-all duration-500">
                                                            <Icon name="description" className="text-[#4F7C82] text-2xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-lg text-[#0B2E33] group-hover:text-[#4F7C82] transition-colors leading-none">{item.title}</h3>
                                                            <div className="flex items-center gap-3 mt-2.5">
                                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-md">
                                                                    ROOM: {item.room}
                                                                </p>
                                                                <span className="text-slate-200">/</span>
                                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-widest opacity-60">
                                                                    {new Date(item.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 w-full sm:w-auto self-stretch sm:self-center">
                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-white ${
                                                            item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#B8E3E9]/40 text-[#4F7C82]'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                        <button 
                                                            onClick={() => router.push('/admin/complaints')}
                                                            className="flex-1 sm:flex-none px-6 py-2.5 bg-[#0B2E33] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0B2E33]/20 hover:scale-105 active:scale-95 transition-all"
                                                        >
                                                            Process
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center bg-[#F8FAFC] rounded-[2.5rem] border border-dashed border-[#B8E3E9]">
                                                <Icon name="check_circle" className="text-4xl mb-4 text-[#B8E3E9]" />
                                                <p className="text-[#4F7C82] font-black uppercase tracking-widest text-[10px]">No action items found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
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
                        className="fixed inset-0 bg-[#0B2E33]/20 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
