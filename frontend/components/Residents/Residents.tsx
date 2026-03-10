"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

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

export default function Residents() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Residents')

    const residents = [
        { id: 1, name: 'Jordan Smith', initials: 'JS', email: 'j.smith@example.com', phone: '(555) 123-4567', room: 'B-402', joinDate: 'Jan 12, 2023', status: 'Active', statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600' },
        { id: 2, name: 'Amara Chen', initials: 'AC', email: 'amara.c@webmail.com', phone: '(555) 987-6543', room: 'A-108', joinDate: 'Mar 05, 2023', status: 'Active', statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600' },
        { id: 3, name: 'Liam Wilson', initials: 'LW', email: 'l.wilson@provider.net', phone: '(555) 234-5678', room: 'C-215', joinDate: 'Jun 22, 2023', status: 'Move-out Pending', statusColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600' },
        { id: 4, name: 'Sarah Park', initials: 'SP', email: 'sarah.park@email.com', phone: '(555) 345-6789', room: 'A-304', joinDate: 'Sep 15, 2023', status: 'Active', statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30', textColor: 'text-pink-600' },
    ]

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <style jsx global>{`
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 md:translate-x-0 md:static
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
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Icon name="person" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">Admin User</p>
                                <p className="text-xs text-slate-500 truncate">admin@staysync.com</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-600 dark:text-slate-400">
                                <Icon name={sidebarOpen ? "close" : "menu"} />
                            </button>
                            <h1 className="text-xl font-bold">Residents</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <Icon name="notifications" />
                            </button>
                        </div>
                    </header>

                    {/* Table Section */}
                    <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        {/* Controls Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                                <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm placeholder:text-slate-400 transition-all" placeholder="Search residents by name, email or room..." type="text" />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Icon name="filter_list" className="text-xl" />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                                    <Icon name="add" className="text-xl" />
                                    Add Resident
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800">
                            <button className="px-4 py-2 border-b-2 border-primary text-primary text-sm font-semibold">All Residents</button>
                            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700">Active</button>
                            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700">Move-out Pending</button>
                        </div>

                        {/* Table Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Join Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {residents.map((resident) => (
                                            <tr key={resident.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-8 ${resident.bgColor} ${resident.textColor} rounded-full flex items-center justify-center font-bold text-xs`}>{resident.initials}</div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{resident.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{resident.email}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{resident.phone}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{resident.room}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{resident.joinDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${resident.statusColor}`}>
                                                        {resident.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="text-primary hover:text-primary/70 text-sm font-medium">View</button>
                                                        <span className="text-slate-300 dark:text-slate-700">|</span>
                                                        <button className="text-red-500 hover:text-red-400 text-sm font-medium">Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-sm text-slate-500">Showing 1 to 4 of 24 residents</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <Icon name="chevron_left" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-sm font-medium">1</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-medium">2</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-medium">3</button>
                                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <Icon name="chevron_right" />
                                    </button>
                                </div>
                            </div>
                        </div>
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
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
