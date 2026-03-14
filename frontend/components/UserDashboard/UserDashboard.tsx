// "use client"

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { useRouter } from 'next/navigation'
// import api from '@/lib/api'
// import UserSidebar from '@/components/UserSidebar/UserSidebar'
// import { useUserStore } from '@/store/useUserStore'

// // Helper for Material Symbols
// const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
//     <span className={`material-symbols-outlined ${className}`}>{name}</span>
// )

// export default function UserDashboard() {
//     const router = useRouter()
//     const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [complaints, setComplaints] = useState<any[]>([])
//     const [isLoadingComplaints, setIsLoadingComplaints] = useState(true)

//     useEffect(() => {
//         const loadDashboardData = async () => {
//             if (!profile) {
//                 await fetchProfile()
//             }
            
//             if (profile?.hostelId) {
//                 try {
//                     const hostelId = profile.hostelId._id || profile.hostelId;
//                     const response = await api.get(`/hostels/${hostelId}/complaints`);
                    
//                     const userComplaints = response.data.filter((c: any) => 
//                         (c.userId?._id === profile._id || c.userId === profile._id)
//                     );
//                     setComplaints(userComplaints);
//                 } catch (error) {
//                     console.error("Failed to fetch complaints:", error);
//                 } finally {
//                     setIsLoadingComplaints(false)
//                 }
//             } else if (!isProfileLoading) {
//                 setIsLoadingComplaints(false)
//             }
//         }
//         loadDashboardData()
//     }, [profile, fetchProfile, isProfileLoading])

//     const stats = [
//         { 
//             label: 'My Room Number', 
//             value: profile?.roomId?.roomNumber || 'TBD', 
//             icon: 'meeting_room', 
//             gradient: 'from-blue-50 to-indigo-50', // Softened gradients
//             iconBg: 'bg-blue-100',
//             textColor: 'text-blue-700',
//             subText: 'Assigned status'
//         },
//         { 
//             label: 'Active Complaints', 
//             value: complaints.filter(c => c.status !== 'Resolved').length.toString().padStart(2, '0'), 
//             icon: 'pending_actions', 
//             gradient: 'from-orange-50 to-amber-50',
//             iconBg: 'bg-orange-100',
//             textColor: 'text-orange-700',
//             subText: 'Needs attention'
//         },
//         { 
//             label: 'Resolved Complaints', 
//             value: complaints.filter(c => c.status === 'Resolved').length.toString().padStart(2, '0'), 
//             icon: 'task_alt', 
//             gradient: 'from-emerald-50 to-teal-50',
//             iconBg: 'bg-emerald-100',
//             textColor: 'text-emerald-700',
//             subText: 'Completed tasks'
//         }
//     ]

//     const getIconForCategory = (category: string) => {
//         switch (category?.toLowerCase()) {
//             case 'plumbing': return 'plumbing';
//             case 'electrical': return 'electrical_services';
//             case 'wifi': return 'wifi';
//             case 'ac': return 'ac_unit';
//             default: return 'description';
//         }
//     }

//     return (
//         <div className="bg-[#F8F9FA] font-display text-slate-900 min-h-screen">
//             <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
//             <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
//             <div className="relative flex h-full w-full">
//                 <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//                 {/* Main Content Area */}
//                 <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
//                     <div className="max-w-6xl mx-auto w-full">
                        
//                         {/* Header */}
//                         <header className="flex items-center justify-between mb-10">
//                             <div>
//                                 <div className="flex items-center gap-3 lg:hidden mb-4">
//                                     <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
//                                         <Icon name="menu" className="text-[#ec5b13]" />
//                                     </button>
//                                 </div>
//                                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//                                     Welcome back, {profile?.name?.split(' ')[0] || 'User'}
//                                 </h1>
//                                 <p className="text-slate-500 mt-1 font-medium">Here's what's happening in your residence today.</p>
//                             </div>
                            
//                             <div className="flex items-center gap-4">
//                                 <button className="relative p-3 text-slate-500 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
//                                     <Icon name="notifications" />
//                                     <span className="absolute top-3 right-3 size-2.5 bg-[#ec5b13] rounded-full border-2 border-white"></span>
//                                 </button>
//                                 <div className="size-12 rounded-full border-2 border-white shadow-lg bg-slate-200 bg-center bg-cover overflow-hidden" 
//                                      style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}>
//                                     {!profile?.profileImage && (
//                                         <div className="size-full flex items-center justify-center text-slate-400 font-bold bg-white">
//                                             {profile?.name?.charAt(0) || 'U'}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </header>

//                         {/* Stats Grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//                             {stats.map((stat, idx) => (
//                                 <motion.div 
//                                     key={idx}
//                                     initial={{ opacity: 0, y: 15 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: idx * 0.1 }}
//                                     className={`rounded-3xl p-6 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow`}
//                                 >
//                                     <div className="flex items-center justify-between mb-4">
//                                         <span className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.textColor} flex items-center justify-center`}>
//                                             <Icon name={stat.icon} />
//                                         </span>
//                                         <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                                             {stat.label}
//                                         </span>
//                                     </div>
//                                     <p className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
//                                     <p className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.subText}</p>
//                                 </motion.div>
//                             ))}
//                         </div>

//                         {/* Recent Complaints Section */}
//                         <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100">
//                             <div className="flex items-center justify-between mb-8">
//                                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Complaint Updates</h2>
//                                 <button className="text-[#ec5b13] text-sm font-bold hover:text-[#d44d0e] transition-colors">View All History</button>
//                             </div>

//                             <div className="space-y-4">
//                                 {isLoadingComplaints ? (
//                                     <div className="py-20 text-center">
//                                         <div className="animate-spin size-8 border-3 border-[#ec5b13] border-t-transparent rounded-full mx-auto mb-4"></div>
//                                         <p className="text-sm font-semibold text-slate-400">Synchronizing data...</p>
//                                     </div>
//                                 ) : complaints.length === 0 ? (
//                                     <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
//                                         <Icon name="verified" className="text-5xl mb-4 text-slate-200" />
//                                         <p className="text-slate-500 font-medium">All clear! No active complaints found.</p>
//                                     </div>
//                                 ) : (
//                                     complaints.slice(0, 4).map((complaint, idx) => (
//                                         <motion.div 
//                                             key={complaint._id}
//                                             initial={{ opacity: 0, x: -10 }}
//                                             animate={{ opacity: 1, x: 0 }}
//                                             transition={{ delay: idx * 0.05 }}
//                                             className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-4 group"
//                                         >
//                                             <div className="flex items-center gap-5">
//                                                 <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
//                                                     <Icon name={getIconForCategory(complaint.category)} className="text-[#ec5b13] text-2xl" />
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="font-bold text-slate-900 leading-tight group-hover:text-[#ec5b13] transition-colors">
//                                                         {complaint.title}
//                                                     </h3>
//                                                     <p className="text-sm text-slate-500 mt-1 font-medium">
//                                                         Case #{complaint._id.slice(-6).toUpperCase()} • 
//                                                         <span className="ml-1 text-slate-400 font-normal">{new Date().toLocaleDateString()}</span>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-4 w-full sm:w-auto">
//                                                 <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                                                     complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
//                                                 }`}>
//                                                     {complaint.status}
//                                                 </span>
//                                                 <button 
//                                                     onClick={() => router.push(`/user/complaints`)}
//                                                     className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
//                                                 >
//                                                     Details
//                                                 </button>
//                                             </div>
//                                         </motion.div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//             <div className="lg:hidden h-24"></div>
//         </div>
//     )
// }


"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useUserStore } from '@/store/useUserStore'
import { useComplaints } from '@/hooks/useComplaints'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function UserDashboard() {
    const router = useRouter()
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 4

    useEffect(() => {
        if (!profile && !isProfileLoading) {
            fetchProfile()
        }
    }, [profile, isProfileLoading, fetchProfile])

    // Use the hook for paginated complaints
    const hostelId = profile?.hostelId?._id || profile?.hostelId;
    const { data, isLoading: isLoadingComplaints } = useComplaints(
        hostelId, 
        '', 
        page, 
        limit, 
        profile?._id
    )

    const complaints = data?.complaints || []
    const totalPages = data?.totalPages || 1
    const totalCount = data?.totalCount || 0

    const stats = [
        { 
            label: 'My Room Number', 
            value: profile?.roomId?.roomNumber || 'TBD', 
            icon: 'meeting_room', 
            gradient: 'from-[#A9C9FF] to-[#CDD5FF]',
            textColor: 'text-blue-900',
            subText: 'Assigned status'
        },
        { 
            label: 'Active Complaints', 
            value: complaints.filter((c: any) => c.status !== 'Resolved').length.toString().padStart(2, '0'), 
            icon: 'pending_actions', 
            gradient: 'from-[#FFDFA3] to-[#FFF5D1]',
            textColor: 'text-amber-900',
            subText: 'Needs attention'
        },
        { 
            label: 'Resolved Complaints', 
            value: complaints.filter((c: any) => c.status === 'Resolved').length.toString().padStart(2, '0'), 
            icon: 'task_alt', 
            gradient: 'from-[#A8E6CF] to-[#DCEDC1]',
            textColor: 'text-emerald-900',
            subText: 'Completed tasks'
        }
    ]

    const getIconForCategory = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'plumbing': return 'plumbing';
            case 'electrical': return 'electrical_services';
            case 'wifi': return 'wifi';
            case 'ac': return 'ac_unit';
            default: return 'description';
        }
    }

    return (
        <div className="bg-[#F9FAFB] font-display text-slate-900 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-6xl mx-auto w-full">
                        
                        {/* Header */}
                        <header className="flex items-center justify-between mb-10">
                            <div>
                                <div className="flex items-center gap-3 lg:hidden mb-4">
                                    <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                                        <Icon name="menu" className="text-[#ec5b13]" />
                                    </button>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Welcome back, {profile?.name?.split(' ')[0] || 'User'}
                                </h1>
                                <p className="text-slate-500 mt-1 font-medium">Your residency overview and updates.</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button className="relative p-3 text-slate-400 bg-white rounded-full border border-slate-200 shadow-sm hover:text-slate-600 transition-colors">
                                    <Icon name="notifications" />
                                    <span className="absolute top-3 right-3 size-2 bg-[#ec5b13] rounded-full border-2 border-white"></span>
                                </button>
                                <div 
                                     onClick={() => router.push('/user/profile')}
                                     className="size-12 rounded-full border-2 border-white shadow-md bg-slate-200 bg-center bg-cover overflow-hidden cursor-pointer hover:shadow-lg transition-all" 
                                     style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}>
                                    {!profile?.profileImage && (
                                        <div className="size-full flex items-center justify-center text-slate-400 font-bold bg-white">
                                            {profile?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Stats Grid - Using requested theme colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {stats.map((stat, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`rounded-[2rem] p-7 shadow-sm border border-white bg-gradient-to-br ${stat.gradient} relative overflow-hidden group`}
                                >
                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <span className={`p-2 bg-white/40 backdrop-blur-md rounded-xl ${stat.textColor} flex items-center justify-center`}>
                                            <Icon name={stat.icon} />
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 ${stat.textColor}`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className={`text-5xl font-black ${stat.textColor} tracking-tighter`}>{stat.value}</p>
                                        <p className={`mt-3 text-xs font-bold uppercase tracking-wide opacity-70 ${stat.textColor}`}>{stat.subText}</p>
                                    </div>
                                    {/* Subtle decorative circle */}
                                    <div className="absolute -right-4 -bottom-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Container */}
                        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Complaints</h2>
                            </div>

                            <div className="space-y-4">
                                {isLoadingComplaints ? (
                                    <div className="py-20 text-center">
                                        <div className="animate-spin size-6 border-2 border-[#ec5b13] border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-sm font-medium text-slate-400">Loading your updates...</p>
                                    </div>
                                ) : complaints.length === 0 ? (
                                    <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                        <Icon name="check_circle" className="text-4xl mb-3 text-slate-200" />
                                        <p className="text-slate-500 font-medium">No active complaints found.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {complaints.map((complaint: any, idx: number) => (
                                                <motion.div 
                                                    key={complaint._id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all gap-4 group"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="size-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                                                            <Icon name={getIconForCategory(complaint.category)} className="text-[#ec5b13] text-2xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 group-hover:text-[#ec5b13] transition-colors">{complaint.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                                    Case #{complaint._id.slice(-6).toUpperCase()}
                                                                </p>
                                                                <span className="text-slate-200">•</span>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {complaint.status}
                                                        </span>
                                                       
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Page {page} of {totalPages}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        disabled={page === 1}
                                                        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                                                        className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Icon name="chevron_left" />
                                                    </button>
                                                    <button 
                                                        disabled={page === totalPages}
                                                        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                                                        className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Icon name="chevron_right" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div className="lg:hidden h-24"></div>
        </div>
    )
}