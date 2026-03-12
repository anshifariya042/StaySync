"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useUserStore } from '@/store/useUserStore'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)


export default function UserDashboard() {
    const router = useRouter()
    const { logout } = useAuth()
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [complaints, setComplaints] = useState<any[]>([])
    const [isLoadingComplaints, setIsLoadingComplaints] = useState(true)

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!profile) {
                await fetchProfile()
            }
            
            if (profile?.hostelId) {
                try {
                    const hostelId = profile.hostelId._id || profile.hostelId;
                    const response = await api.get(`/hostels/${hostelId}/complaints`);
                    
                    const userComplaints = response.data.filter((c: any) => 
                        (c.userId?._id === profile._id || c.userId === profile._id)
                    );
                    setComplaints(userComplaints);
                } catch (error) {
                    console.error("Failed to fetch complaints:", error);
                } finally {
                    setIsLoadingComplaints(false)
                }
            } else if (!isProfileLoading) {
                setIsLoadingComplaints(false)
            }
        }
        loadDashboardData()
    }, [profile, fetchProfile, isProfileLoading])

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    const stats = [
        { 
            label: 'My Room Number', 
            value: profile?.roomId?.roomNumber || 'TBD', 
            icon: 'meeting_room', 
            bg: 'bg-primary/10', 
            text: 'text-primary' 
        },
        { 
            label: 'Active Complaints', 
            value: complaints.filter(c => c.status !== 'Resolved').length.toString().padStart(2, '0'), 
            icon: 'pending_actions', 
            bg: 'bg-amber-100', 
            text: 'text-amber-600' 
        },
        { 
            label: 'Resolved Complaints', 
            value: complaints.filter(c => c.status === 'Resolved').length.toString().padStart(2, '0'), 
            icon: 'task_alt', 
            bg: 'bg-emerald-100', 
            text: 'text-emerald-600' 
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-slate-100 text-slate-600';
            case 'in progress': return 'bg-amber-100 text-amber-700';
            case 'resolved': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    }

    const getIconForCategory = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'plumbing': return 'water_drop';
            case 'electrical': return 'lightbulb';
            case 'wifi': return 'wifi_off';
            case 'ac': return 'ac_unit';
            default: return 'report_problem';
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full overflow-x-hidden">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                    {/* Top Header */}
                    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-400">
                                <Icon name="menu" />
                            </button>
                            <h2 className="text-lg font-bold">Dashboard</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                <Icon name="notifications" />
                            </button>
                        </div>
                    </header>

                    <div className="p-6 space-y-6">
                        {/* Welcome Section */}
                        <div>
                            <h3 className="text-2xl font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'Guest'}!</h3>
                            <p className="text-slate-500">Here's what's happening in your residence today.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                                    <div className={`size-12 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                                        <Icon name={stat.icon} />
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                        <h4 className="text-2xl font-bold">{stat.value}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Complaints List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">Recent Complaint Updates</h3>
                                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                {isLoadingComplaints ? (
                                    <div className="p-8 text-center text-slate-500">Loading your complaints...</div>
                                ) : complaints.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">No complaints found.</div>
                                ) : (
                                    complaints.map((complaint) => (
                                        <div key={complaint._id} className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <Icon name={getIconForCategory(complaint.category)} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{complaint.title}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {complaint.updatedAt ? `Updated ${new Date(complaint.updatedAt).toLocaleDateString()}` : 'Date unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
