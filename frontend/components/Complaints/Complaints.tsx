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

export default function Complaints() {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Complaints')

    const complaints = [
        { id: 1, ticketId: '#CMP-1024', title: 'Leaking AC Unit', room: 'Room 302', category: 'Maintenance', status: 'Pending', statusColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dotColor: 'bg-yellow-500', staff: 'Not Assigned', staffImg: null, date: 'Oct 24, 09:15 AM' },
        { id: 2, ticketId: '#CMP-1023', title: 'Mini-fridge not cooling', room: 'Room 415', category: 'Electrical', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500', staff: 'James Chen', staffImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMcLEtNdluUgYnOcI33_4sk96SoLmrfCyQjAij-l8DsWjY8zC4U0U2bM7DxNi79Y2oiXacaOk3lM9MM3YUrHZmha_1vQC6MYcV7iA458NsUVhlYsDibZ4KBUk0rGr6zL1bQKkZgKaj4BLPUdYRi2yizMvuzlkGnFV2uyLnsuBzPkKF0HUw6cjBefSHULGfG5yCVtMYPyILxGtVXMZ8HyCwQ-BggtgXEsuNc4CEiFkfx8pFT0vBq3JmZMbYVAcK6ETmYcz_h0P-r-o', date: 'Oct 23, 02:30 PM' },
        { id: 3, ticketId: '#CMP-1020', title: 'Extra towels requested', room: 'Room 105', category: 'Housekeeping', status: 'Resolved', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dotColor: 'bg-green-500', staff: 'Sarah Miller', staffImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOH6IqUeFq-qYoBB8tPsu_76W3RJg-DIgxH6WLNJj5ZMMZNp2W7QORDBEisL0L93kL1tKltRQ-QB_YDgghWLlVuWzLYdD2KsreEuu8fTd0JBR-HeU7qYhRTjR4myoSBqY-9cguCE5YPTHmNQwswYlMVnpqjz4j7R1diCsxDHLiQpzFK59N4-mMlioBy6U2FluHyHn2ZGLVMUcdM8VgD2RIndipTRBRdDfpfnSNAFVHIsS2EGrWTMLb3PCBy78otQGjf1miCAn_o_Y', date: 'Oct 23, 11:45 AM' },
        { id: 4, ticketId: '#CMP-1019', title: 'Wi-Fi connection issues', room: 'Room 221', category: 'Technical', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dotColor: 'bg-blue-500', staff: 'Alex Rivera', staffImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoG-dI5SAPY9nbW_fqUXF-yzMlesvwbIRNibOBjS025AYyCXGWpGjryfJYHCbWr9D48FVlxTiuOXKSJGYiuObz4N51Cualdikd9V-G_fTp5UwfOa7IseDaYimkycYfhNf0ZSciuseeiedpOKECyqOYYBzjen4gem5UJoGgFl6ofems3TBaR8U8pceeOQsOsa4bxoEoirFeUq6foCzl8Sz8nr4eVfVko2aVhwix3KM4L60SN108oWV52RaLEqRqNfLjwST2T626QbE', date: 'Oct 23, 08:20 AM' },
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
                            <h1 className="text-xl font-semibold">Complaints Management</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-slate-500 hover:text-primary transition-colors">
                                <Icon name="notifications" />
                            </button>
                            <div className="size-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 dark:border-slate-700">
                                <Icon name="person" className="text-xl flex items-center justify-center h-full" />
                            </div>
                        </div>
                    </header>

                    {/* Content Section */}
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                    <input className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" placeholder="Search complaints..." type="text" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">
                                    <span>Filter: All</span>
                                    <Icon name="expand_more" className="text-lg" />
                                </button>
                            </div>
                            <button className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                <Icon name="add" className="text-lg" />
                                New Complaint
                            </button>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4">Complaint Title</th>
                                            <th className="px-6 py-4">Room</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Assigned Staff</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {complaints.map((complaint) => (
                                            <tr key={complaint.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900 dark:text-slate-100">{complaint.title}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">ID: {complaint.ticketId}</div>
                                                </td>
                                                <td className="px-6 py-4">{complaint.room}</td>
                                                <td className="px-6 py-4">{complaint.category}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${complaint.statusColor}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${complaint.dotColor}`}></span>
                                                        {complaint.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-6 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                                                            {complaint.staffImg ? (
                                                                <img className="w-full h-full object-cover" src={complaint.staffImg} alt={complaint.staff} />
                                                            ) : (
                                                                <Icon name="person" className="text-xs flex items-center justify-center h-full" />
                                                            )}
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300">{complaint.staff}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{complaint.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-1 text-slate-400 hover:text-primary transition-colors" title="Assign Staff"><Icon name="person_add" className="text-lg" /></button>
                                                        <button className="p-1 text-slate-400 hover:text-primary transition-colors" title="View Details"><Icon name="visibility" className="text-lg" /></button>
                                                        <button className="p-1 text-slate-400 hover:text-primary transition-colors" title="Close Ticket"><Icon name="check_circle" className="text-lg" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Footer */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/30">
                                <span>Showing 1 to 4 of 24 results</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Previous</button>
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white transition-colors">1</button>
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
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
