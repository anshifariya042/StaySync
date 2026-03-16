// "use client"

// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useRouter } from 'next/navigation'
// import { useAuthStore as useAuth } from '@/store/useAuthStore'
// import api from '@/lib/api'
// import UserSidebar from '@/components/UserSidebar/UserSidebar'
// import { useUserStore } from '@/store/useUserStore'

// // Helper for Material Symbols
// const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
//     <span className={`material-symbols-outlined ${className}`}>{name}</span>
// )


// export default function MyHostel() {
//     const router = useRouter()
//     const { logout } = useAuth()
//     const { profile, isLoading, fetchProfile } = useUserStore()
//     const [sidebarOpen, setSidebarOpen] = useState(false)

//     useEffect(() => {
//         if (!profile) {
//             fetchProfile()
//         }
//     }, [profile, fetchProfile])

//     const hostel = profile?.hostelId;
//     const room = profile?.roomId;

//     const handleLogout = () => {
//         logout();
//         router.push('/login');
//     }

//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//         )
//     }

//     return (
//         <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
//             <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
//             <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
//             <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
//                 <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//                 {/* Top Navigation */}
//                 <header className="flex items-center bg-white/80 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-40 px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800 lg:ml-72">
//                     <button className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setSidebarOpen(true)}>
//                         <Icon name="menu" />
//                     </button>
//                     <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 lg:pr-0">My Hostel</h2>
//                 </header>

//                 <main className="flex-1 lg:ml-72 pb-24">
//                     {!hostel ? (
//                         <div className="p-12 text-center space-y-4">
//                             <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
//                                 <Icon name="apartment" className="text-4xl" />
//                             </div>
//                             <h3 className="text-xl font-bold">No Hostel Assigned</h3>
//                             <p className="text-slate-500">You haven't been assigned to any hostel yet or your booking is pending.</p>
//                             <button 
//                                 onClick={() => router.push('/explore-hostels')}
//                                 className="bg-primary text-white px-6 py-2 rounded-xl font-bold"
//                             >
//                                 Explore Hostels
//                             </button>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Hero Banner */}
//                             <div className="px-4 py-4">
//                                 <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl aspect-[16/9] shadow-lg relative" style={{ backgroundImage: `url(${hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d1502f?auto=format&fit=crop&q=80&w=800'})` }}>
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                                     <div className="relative p-6">
//                                         <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block shadow-lg">Verified Stay</span>
//                                         <h1 className="text-white text-3xl font-black">{hostel.name}</h1>
//                                         <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1 font-medium">
//                                             <Icon name="location_on" className="text-sm" />
//                                             {hostel.location}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Facilities Section */}
//                             <section className="px-4 py-2">
//                                 <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 flex items-center gap-2">
//                                     <Icon name="bolt" className="text-primary text-xl" />
//                                     Facilities
//                                 </h3>
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                                     {(hostel.facilities?.length > 0 ? hostel.facilities : ['WiFi', 'Laundry', 'Kitchen', 'Gym']).map((fac: string, idx: number) => (
//                                         <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
//                                             <Icon name={
//                                                 fac.toLowerCase().includes('wifi') ? 'wifi' : 
//                                                 fac.toLowerCase().includes('laundry') ? 'local_laundry_service' :
//                                                 fac.toLowerCase().includes('kitchen') ? 'restaurant' :
//                                                 fac.toLowerCase().includes('gym') ? 'fitness_center' : 'star'
//                                             } className="text-primary" />
//                                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{fac}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </section>

//                             {/* Room Details Section */}
//                             <section className="px-4 py-6">
//                                 <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 flex items-center gap-2">
//                                     <Icon name="king_bed" className="text-primary text-xl" />
//                                     Room Details
//                                 </h3>
//                                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
//                                     <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
//                                         <div>
//                                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Room Number</p>
//                                             <p className="text-3xl font-black text-primary">{room?.roomNumber || 'TBD'}</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
//                                             <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-bold text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/50">
//                                                 {profile?.status?.toUpperCase() || 'OCCUPIED'}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="p-6 flex flex-col gap-6">
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
//                                                     <Icon name="meeting_room" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="text-sm font-bold">Room Type</p>
//                                                     <p className="text-sm text-slate-600 dark:text-slate-400">{profile?.roomType || room?.type || 'Standard Room'}</p>
//                                                 </div>
//                                             </div>
//                                             <div className="text-right">
//                                                 <p className="text-xl font-black text-slate-900 dark:text-slate-100">₹{room?.price || hostel?.price || '0.00'}</p>
//                                                 <p className="text-[10px] text-slate-500 font-bold uppercase">Monthly Rent</p>
//                                             </div>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
//                                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Resident Since</p>
//                                                 <p className="font-bold">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 12, 2023'}</p>
//                                             </div>
//                                             <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
//                                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-1">Status Date</p>
//                                                 <p className="font-bold">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </section>
//                         </>
//                     )}
//                 </main>
                
    
//             </div>
//         </div>
//     )
// }



"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
                <div className="size-12 border-4 border-[#ec5b13]/20 border-t-[#ec5b13] rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Residency...</p>
            </div>
        )
    }

    return (
        <div className="bg-[#F9FAFB] font-display text-slate-900 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-5xl mx-auto w-full">
                        
                        {/* Elegant Header */}
                        <header className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSidebarOpen(true)} 
                                    className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 lg:hidden"
                                >
                                    <Icon name="menu" className="text-[#ec5b13]" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">My Hostel</h1>
                                    <p className="text-slate-400 text-sm font-medium">Manage your current stay and room details.</p>
                                </div>
                            </div>
                        </header>

                        {!hostel ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-16 rounded-[3rem] text-center border border-slate-100 shadow-sm"
                            >
                                <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon name="apartment" className="text-5xl text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Hostel Assigned</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                                    You haven't been assigned to a hostel yet. Explore our verified properties to book your stay.
                                </p>
                                <button 
                                    onClick={() => router.push('/explore-hostels')}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
                                >
                                    Explore Hostels
                                </button>
                            </motion.div>
                        ) : (
                            <div className="space-y-8">
                                
                                {/* Hero Banner Section */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="group relative h-[350px] w-full overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200"
                                >
                                    <img 
                                        src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d1502f?q=80&w=1200'} 
                                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        alt="Hostel image"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                                    <div className="absolute bottom-10 left-10">
            
                                        <h2 className="text-5xl font-black text-white tracking-tighter mb-2">{hostel.name}</h2>
                                        <p className="flex items-center gap-2 text-white/70 font-semibold tracking-wide">
                                            <Icon name="location_on" className="text-lg text-[#ec5b13]" />
                                            {hostel.location}
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    
                                    {/* Left: Facilities & Info */}
                                    <div className="lg:col-span-2 space-y-8">
                                        
                                        {/* Premium Facilities Grid */}
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-bold tracking-tight">Included Facilities</h3>
                                                <div className="size-8 bg-slate-50 rounded-full flex items-center justify-center">
                                                    <Icon name="bolt" className="text-[#ec5b13] text-sm font-fill" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {(hostel.facilities?.length > 0 ? hostel.facilities : ['WiFi', 'Laundry', 'Mess', 'CCTV']).map((fac: string, idx: number) => (
                                                    <div key={idx} className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                                                        <div className="size-12 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                            <Icon name={
                                                                fac.toLowerCase().includes('wifi') ? 'wifi' : 
                                                                fac.toLowerCase().includes('laundry') ? 'local_laundry_service' :
                                                                fac.toLowerCase().includes('kitchen') || fac.toLowerCase().includes('mess') ? 'restaurant' :
                                                                fac.toLowerCase().includes('gym') ? 'fitness_center' : 'verified_user'
                                                            } className="text-slate-400 group-hover:text-[#ec5b13] transition-colors" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{fac}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Detailed Stats */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                                                <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                    <Icon name="event_available" className="text-2xl" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resident Since</p>
                                                    <p className="text-lg font-bold text-slate-900">
                                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 12, 2023'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                                                <div className="size-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                                    <Icon name="update" className="text-2xl" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</p>
                                                    <p className="text-lg font-bold text-slate-900">
                                                        {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Room Assignment Card */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                                                <Icon name="bed" className="text-9xl" />
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-8">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room Assignment</p>
                                                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        {profile?.status || 'Occupied'}
                                                    </span>
                                                </div>

                                                <div className="mb-8">
                                                    <h4 className="text-6xl font-black text-slate-900 tracking-tighter mb-1">
                                                        {room?.roomNumber || 'TBD'}
                                                    </h4>
                                                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                                                        {profile?.roomType || room?.type || 'Standard Room'}
                                                    </p>
                                                </div>

                                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-slate-500">Monthly Rent</span>
                                                        <span className="text-xl font-black text-slate-900 tracking-tight">₹{room?.price || hostel?.price || '0.00'}</span>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => router.push('/user/complaints/new')}
                                                    className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200"
                                                >
                                                    <Icon name="report" className="text-lg" />
                                                    Report Issue
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            {/* Mobile Bottom Spacer */}
            <div className="lg:hidden h-20"></div>
        </div>
    )
}