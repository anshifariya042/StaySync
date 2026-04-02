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

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useUserStore } from '@/store/useUserStore'
import { useComplaints } from '@/hooks/useComplaints'
import RestrictedAccess from '@/components/ui/RestrictedAccess'
import NotificationDropdown from '@/components/ui/NotificationDropdown'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)
export default function UserDashboard() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-[#4F7C82]">Initializing Residence Matrix...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { profile, isLoading: isProfileLoading, fetchProfile } = useUserStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
    const limit = 4

    // Sync URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            if (page > 1) params.set('page', page.toString());

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [page, pathname, router]);

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

    if (profile?.status === 'pending' || profile?.status === 'rejected') {
        return <RestrictedAccess status={profile.status as string} name={profile.name} />;
    }

    const stats = [
        {
            label: 'My Room Number',
            value: profile?.roomId?.roomNumber || 'TBD',
            icon: 'meeting_room',
            gradient: 'from-[#B8E3E9]/60 to-[#F8FAFC]',
            textColor: 'text-[#0B2E33]',
            subText: 'Assigned status'
        },
        {
            label: 'Active Complaints',
            value: complaints.filter((c: any) => c.status !== 'Resolved').length.toString().padStart(2, '0'),
            icon: 'pending_actions',
            gradient: 'from-[#4F7C82]/20 to-[#B8E3E9]/10',
            textColor: 'text-[#4F7C82]',
            subText: 'Needs attention'
        },
        {
            label: 'Resolved Complaints',
            value: complaints.filter((c: any) => c.status === 'Resolved').length.toString().padStart(2, '0'),
            icon: 'task_alt',
            gradient: 'from-[#B8E3E9]/40 to-emerald-50/30',
            textColor: 'text-emerald-800',
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
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="relative flex h-full w-full">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 md:p-10">
                    <div className="max-w-6xl mx-auto w-full">

                        {/* Header */}
                        <header className="flex items-center justify-between mb-12">
                            <div>
                                <div className="flex items-center gap-3 lg:hidden mb-4">
                                    <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-white rounded-2xl shadow-sm border border-[#B8E3E9]">
                                        <Icon name="menu" className="text-[#4F7C82]" />
                                    </button>
                                </div>
                                <h1 className="text-3xl font-black text-[#0B2E33] tracking-tighter">
                                    Welcome back, {profile?.name?.split(' ')[0] || 'User'}
                                </h1>
                                <p className="text-[#4F7C82] mt-1.5 font-bold text-sm uppercase tracking-widest opacity-80">Resident Portal Overview</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <NotificationDropdown />
                                <div
                                    onClick={() => router.push('/user/profile')}
                                    className="size-14 rounded-2xl border-4 border-white shadow-xl bg-slate-100 bg-center bg-cover overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
                                    style={{ backgroundImage: profile?.profileImage ? `url('${profile.profileImage}')` : 'none' }}>
                                    {!profile?.profileImage && (
                                        <div className="size-full flex items-center justify-center text-[#4F7C82] font-black bg-white">
                                            {profile?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                                    className={`rounded-[2.5rem] p-8 shadow-sm border border-white bg-gradient-to-br ${stat.gradient} relative overflow-hidden group hover:shadow-xl hover:shadow-[#4F7C82]/5 transition-all duration-500`}
                                >
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className={`p-3 bg-white/60 backdrop-blur-sm rounded-2xl ${stat.textColor} flex items-center justify-center shadow-sm`}>
                                            <Icon name={stat.icon} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ${stat.textColor}`}>
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className={`text-5xl font-black ${stat.textColor} tracking-tighter`}>{stat.value}</p>
                                        <p className={`mt-4 text-[11px] font-black uppercase tracking-widest opacity-60 ${stat.textColor}`}>{stat.subText}</p>
                                    </div>
                                    {/* Glass decorative element */}
                                    <div className="absolute -right-6 -bottom-6 size-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Complaints Section */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-50 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-[#0B2E33] tracking-tight">Recent Complaints</h2>
                                    <p className="text-xs font-bold text-[#4F7C82] uppercase tracking-[0.1em] mt-1 opacity-70">Latest tracking updates</p>
                                </div>

                            </div>

                            <div className="space-y-5 relative z-10">
                                {isLoadingComplaints ? (
                                    <div className="py-24 text-center">
                                        <div className="animate-spin size-8 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                                        <p className="text-xs font-black text-[#4F7C82] uppercase tracking-widest">Synchronizing Log...</p>
                                    </div>
                                ) : complaints.length === 0 ? (
                                    <div className="py-24 text-center bg-[#F8FAFC] rounded-[2.5rem] border border-dashed border-[#B8E3E9]">
                                        <Icon name="verified_user" className="text-5xl mb-4 text-[#B8E3E9]" />
                                        <p className="text-[#4F7C82] font-black uppercase tracking-widest text-xs">No active maintenance logs</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-5">
                                            {complaints.map((complaint: any, idx: number) => (
                                                <motion.div
                                                    key={complaint._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[2rem] border border-slate-50 bg-white hover:bg-[#F8FAFC] hover:border-[#B8E3E9]/30 hover:shadow-lg hover:shadow-[#4F7C82]/5 transition-all duration-300 gap-5 group"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="size-16 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 group-hover:bg-[#B8E3E9]/20 transition-all duration-500">
                                                            <Icon name={getIconForCategory(complaint.category)} className="text-[#4F7C82] text-3xl" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-lg text-[#0B2E33] group-hover:text-[#4F7C82] transition-colors duration-300 leading-none">{complaint.title}</h3>
                                                            <div className="flex items-center gap-3 mt-2.5">
                                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-wider bg-[#B8E3E9]/30 px-2 py-0.5 rounded-md">
                                                                    ID: {complaint._id.slice(-6).toUpperCase()}
                                                                </p>
                                                                <span className="text-slate-200">/</span>
                                                                <p className="text-[10px] text-[#4F7C82] font-black uppercase tracking-widest opacity-60">
                                                                    {new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 w-full sm:w-auto self-stretch sm:self-center">
                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-white ${complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#B8E3E9]/40 text-[#4F7C82]'
                                                            }`}>
                                                            {complaint.status}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                                                <p className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] opacity-50">
                                                    Page {page} of {totalPages}
                                                </p>
                                                <div className="flex gap-3">
                                                    <button
                                                        disabled={page === 1}
                                                        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                                                        className="size-12 rounded-2xl border border-slate-100 flex items-center justify-center text-[#4F7C82] hover:bg-white hover:shadow-lg transition-all disabled:opacity-20 bg-[#F8FAFC]"
                                                    >
                                                        <Icon name="chevron_left" />
                                                    </button>
                                                    <button
                                                        disabled={page === totalPages}
                                                        onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                                                        className="size-12 rounded-2xl border border-slate-100 flex items-center justify-center text-[#4F7C82] hover:bg-white hover:shadow-lg transition-all disabled:opacity-20 bg-[#F8FAFC]"
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