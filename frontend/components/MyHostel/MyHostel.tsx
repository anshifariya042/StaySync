"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import api from '@/lib/api'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useUserStore } from '@/store/useUserStore'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)


export default function MyHostel() {
    const router = useRouter()
    const { logout } = useAuth()
    const { profile, isLoading, fetchProfile } = useUserStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!profile) {
            fetchProfile()
        }
    }, [profile, fetchProfile])

    const hostel = profile?.hostelId;
    const room = profile?.roomId;

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Top Navigation */}
                <header className="flex items-center bg-white/80 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-40 px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800 lg:ml-72">
                    <button className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Icon name="menu" />
                    </button>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 lg:pr-0">My Hostel</h2>
                </header>

                <main className="flex-1 lg:ml-72 pb-24">
                    {!hostel ? (
                        <div className="p-12 text-center space-y-4">
                            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                <Icon name="apartment" className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold">No Hostel Assigned</h3>
                            <p className="text-slate-500">You haven't been assigned to any hostel yet or your booking is pending.</p>
                            <button 
                                onClick={() => router.push('/explore-hostels')}
                                className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
                            >
                                Explore Hostels
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Hero Banner */}
                            <div className="px-4 py-4">
                                <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl aspect-[16/9] shadow-lg relative" style={{ backgroundImage: `url(${hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d1502f?auto=format&fit=crop&q=80&w=800'})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="relative p-6">
                                        <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block shadow-lg">Verified Stay</span>
                                        <h1 className="text-white text-3xl font-black">{hostel.name}</h1>
                                        <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1 font-medium">
                                            <Icon name="location_on" className="text-sm" />
                                            {hostel.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Facilities Section */}
                            <section className="px-4 py-2">
                                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 flex items-center gap-2">
                                    <Icon name="bolt" className="text-primary text-xl" />
                                    Facilities
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {(hostel.facilities?.length > 0 ? hostel.facilities : ['WiFi', 'Laundry', 'Kitchen', 'Gym']).map((fac: string, idx: number) => (
                                        <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                                            <Icon name={
                                                fac.toLowerCase().includes('wifi') ? 'wifi' : 
                                                fac.toLowerCase().includes('laundry') ? 'local_laundry_service' :
                                                fac.toLowerCase().includes('kitchen') ? 'restaurant' :
                                                fac.toLowerCase().includes('gym') ? 'fitness_center' : 'star'
                                            } className="text-primary" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{fac}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Room Details Section */}
                            <section className="px-4 py-6">
                                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 flex items-center gap-2">
                                    <Icon name="king_bed" className="text-primary text-xl" />
                                    Room Details
                                </h3>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Room Number</p>
                                            <p className="text-3xl font-black text-primary">{room?.roomNumber || 'TBD'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                                            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-bold text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                                                {profile?.status?.toUpperCase() || 'OCCUPIED'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Icon name="meeting_room" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Room Type</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{profile?.roomType || room?.type || 'Standard Room'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900 dark:text-slate-100">₹{room?.price || hostel?.price || '0.00'}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">Monthly Rent</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Resident Since</p>
                                                <p className="font-bold">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 12, 2023'}</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Status Date</p>
                                                <p className="font-bold">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </main>
                
    
            </div>
        </div>
    )
}
