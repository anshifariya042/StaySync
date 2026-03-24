// "use client"

// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useRouter } from 'next/navigation'
// import { useAuthStore as useAuth } from '@/store/useAuthStore'

// const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
//     <span className={`material-symbols-outlined ${className}`}>{name}</span>
// )

// const SidebarItem = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
//     <button
//         onClick={onClick}
//         className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full font-medium transition-colors ${active
//             ? 'bg-primary/10 text-primary'
//             : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
//             }`}
//     >
//         <Icon name={icon} />
//         {label}
//     </button>
// )

// export default function Settings() {
//     const router = useRouter()
//     const { user, logout } = useAuth()
//     const [sidebarOpen, setSidebarOpen] = useState(false)

//     const handleLogout = () => {
//         logout()
//         router.push('/login')
//     }

//     return (
//         <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display min-h-screen">
//              <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
//             <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
//             <style jsx global>{`
//                 body { font-family: 'Public Sans', sans-serif; }
//                 .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
//             `}</style>

//             <div className="flex min-h-screen">
//                 {/* Sidebar */}
//                 <aside className={`
//                     fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 md:translate-x-0 md:static
//                     ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//                 `}>
//                     <div className="p-6">
//                         <div className="flex items-center gap-2 text-primary">
//                             <Icon name="sync_alt" className="text-3xl font-bold" />
//                             <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StaySync</span>
//                         </div>
//                     </div>
//                     <nav className="flex-1 px-4 space-y-1">
//                         <SidebarItem icon="dashboard" label="Dashboard" onClick={() => router.push('/admin/dashboard')} />
//                         <SidebarItem icon="bed" label="Rooms" onClick={() => router.push('/admin/rooms')} />
//                         <SidebarItem icon="group" label="Residents" onClick={() => router.push('/admin/residents')} />
//                         <SidebarItem icon="report_problem" label="Complaints" onClick={() => router.push('/admin/complaints')} />
//                         <SidebarItem icon="badge" label="Staff" onClick={() => router.push('/admin/staff')} />

//                         <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
//                             <SidebarItem icon="settings" label="Settings" active={true} />
//                         </div>
//                     </nav>

//                     <div className="p-4 border-t border-slate-100 dark:border-slate-800">
//                         <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
//                                 <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@staysync.com'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
//                     <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
//                         <div className="flex items-center gap-4">
//                             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-600 dark:text-slate-400">
//                                 <Icon name={sidebarOpen ? "close" : "menu"} />
//                             </button>
//                             <h1 className="text-xl font-bold">Settings</h1>
//                         </div>
//                     </header>

//                     <div className="p-8 max-w-2xl">
//                         <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
//                             <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                            
//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
//                                     <p className="text-lg font-semibold">{user?.name || 'Admin User'}</p>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
//                                     <p className="text-lg font-semibold">{user?.email || 'admin@staysync.com'}</p>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
//                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
//                                         {user?.role || 'Admin'}
//                                     </span>
//                                 </div>

//                                 <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
//                                     <button 
//                                         onClick={handleLogout}
//                                         className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
//                                     >
//                                         <Icon name="logout" />
//                                         Logout from Account
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }
