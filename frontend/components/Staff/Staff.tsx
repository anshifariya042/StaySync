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

export default function Staff() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Staff')

    const staffMembers = [
        { id: 1, name: 'Jordan Smith', role: 'Front Desk Manager', email: 'jordan.s@staysync.com', phone: '+1 555-0123', tasks: ['Check-ins', 'Billing'], status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4rdIiGMsmL89n83kz7JXgMv2BqfL8oG-Ico1mzF82qf9xNf71wJnb3T3zjVmtMQw_mAYhl9fmamQt4vS0AGqEK7iMtcBZfbqeZmT1kkCDmQCXEE34vpmC3qqBT8T-BrFuegPi95g_ZEXzfwKELNMx6hybTvfB3Bo9J6opHlTrD7IObz0DBs2C8AKb1JqsBF6uniPSo3BVFCYepMJ0likCKzDLnIO4MF_apSgSL-fwd3hUv1CVur7UyKe5qv5QhgXBZNeL1fCf7no' },
        { id: 2, name: 'Elena Rodriguez', role: 'Housekeeping Supervisor', email: 'elena.r@staysync.com', phone: '+1 555-0124', tasks: ['Floor 3 Inspect', 'Laundry'], status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUb0wLSYKnbfPVehTivP3mq-IbTCRMVW03SjOuT8X-1fwhbtX3S8xG2wWYUhMKbovp_wUATR4GU33ijT4nmVJdU0xyfbriDtwpS8D4Gh21A68osuGcxvSujozOkKMv7JG1QtUm1d6JCmKBCl8HzlgzJiT3g1L6QAB39Q41Dpw3nVXXyS2WeGPbylSeUhV_dF-MIbAwXEqCi5IFbE7sIzxcuCOmR7nMaZnOATdb3LiLnne84FAGy8DDoasLoG9tJGNRIxQ1ndPLerc' },
        { id: 3, name: 'Marcus Chen', role: 'Maintenance Lead', email: 'marcus.c@staysync.com', phone: '+1 555-0125', tasks: ['HVAC Service'], status: 'On Leave', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dotColor: 'bg-amber-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbJNPTV-I29VNhL7DCMv9ZqADprY1-0ZGoSxsrlZ6ZFD9B0-jtnFlBpiFqZ99JF3I1hT4aeja34ZQuceB6kqa8AykmKev4eFzqQTjRplCeuixOPn2eZbtvQA9q9b_IameYB0eGRpZJUX0rKWIJfD2D_qrSy_YowXs_zRMnkhY5MpS4LsJfUFYi4TC9dWPuxW1mMveHV4V_nX7pBf0eb_bU3ujy_QKPwkDQHMTOWJDGUETpsZkDWjnN-r00II7Iy58bVaKvO6MFl14' },
        { id: 4, name: 'Sarah Jenkins', role: 'Events Coordinator', email: 'sarah.j@staysync.com', phone: '+1 555-0126', tasks: ['Wedding Prep'], status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dotColor: 'bg-emerald-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo9ZunbZWAq6PLws_SF7fMiO7jK0gasM9fNsx-foWsnXmb9nFT3nyHXnxdyB61LzWh-yAnWpuPa4vxdehRjjjBgOdXWBtRsVDN0Gi81zy1aWEToexYni-ifUavJ2pVAb02KPsbesOonFgsHeEkeiUmZfBRd_2Cnf1Udl39g9iUiBKjAuEqWFHrWra376hiHo7m_evpU2uyvUgToUFEkEIwGctIdzDYrDeQM3VNtpKFq3FpMUQww4g3Zq-V-Ra1gir4T7EHVxWPYQ4' },
    ]

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen">
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

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                    {/* Header */}
                    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-600 dark:text-slate-400">
                                <Icon name={sidebarOpen ? "close" : "menu"} />
                            </button>
                            <h2 className="text-lg font-semibold">Staff Management</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                <Icon name="notifications" />
                            </button>
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                <Icon name="help_outline" />
                            </button>
                        </div>
                    </header>

                    {/* Table Section */}
                    <section className="p-4 md:p-8 flex-1 overflow-y-auto pb-24 md:pb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="relative w-full max-w-sm">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="Search staff by name or role..." type="text" />
                            </div>
                            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors shrink-0">
                                <Icon name="add" className="text-[20px]" />
                                Add Staff Member
                            </button>
                        </div>

                        {/* Table Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse border-b-0">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name & Role</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Tasks</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {staffMembers.map((staff) => (
                                            <tr key={staff.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                                            <img alt={staff.name} src={staff.img} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm text-slate-900 dark:text-white text-left">{staff.name}</p>
                                                            <p className="text-xs text-slate-500 text-left">{staff.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 text-left">{staff.email}</p>
                                                    <p className="text-xs text-slate-500 text-left">{staff.phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {staff.tasks.map((task, idx) => (
                                                            <span key={idx} className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                                                {task}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.statusColor}`}>
                                                        <span className={`size-1.5 rounded-full ${staff.dotColor}`}></span>
                                                        {staff.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                                            <Icon name="edit" className="text-[18px]" />
                                                        </button>
                                                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-400 transition-colors">
                                                            <Icon name="delete" className="text-[18px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                                <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900 dark:text-white">4</span> of <span className="font-medium text-slate-900 dark:text-white">24</span> staff members</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                                        <Icon name="chevron_left" className="text-[20px]" />
                                    </button>
                                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <Icon name="chevron_right" className="text-[20px]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
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

            {/* Mobile Sidebar Overlay */}
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
