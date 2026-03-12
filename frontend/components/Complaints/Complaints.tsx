"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getComplaints, updateComplaintStatus, assignStaff, getStaff } from '@/services/adminService'
import { useAuth } from '@/context/AuthContext'

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
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Complaints')
    const [complaints, setComplaints] = useState<any[]>([])
    const [staffMembers, setStaffMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Assignment States
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)

    const fetchComplaintsData = async () => {
        if (!user?.hostelId) return;
        try {
            const data = await getComplaints(user.hostelId);
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffData = async () => {
        if (!user?.hostelId) return;
        try {
            const data = await getStaff(user.hostelId);
            setStaffMembers(data);
        } catch (error) {
            console.error("Failed to fetch staff:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchComplaintsData();
            fetchStaffData();
        }
    }, [user]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateComplaintStatus(id, status);
            fetchComplaintsData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const handleAssignStaff = async (staffId: string) => {
        if (!selectedComplaint) return;
        try {
            await assignStaff(selectedComplaint._id, staffId);
            setIsAssignModalOpen(false);
            fetchComplaintsData();
        } catch (error) {
            console.error("Error assigning staff:", error);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'High Priority': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    }

    const getDotColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500';
            case 'In Progress': return 'bg-blue-500';
            case 'Resolved': return 'bg-green-500';
            case 'High Priority': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    }

    const filteredComplaints = complaints.filter(complaint => 
        (complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (complaint.roomNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )

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
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@staysync.com'}</p>
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
                        </div>
                    </header>

                    {/* Content Section */}
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                    <input 
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm" 
                                        placeholder="Search complaints..." 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                ) : (
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
                                            {filteredComplaints.length > 0 ? (
                                                filteredComplaints.map((complaint) => (
                                                    <tr key={complaint._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-slate-900 dark:text-slate-100">{complaint.title}</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">ID: #{complaint._id.slice(-6).toUpperCase()}</div>
                                                        </td>
                                                        <td className="px-6 py-4">{complaint.roomNumber}</td>
                                                        <td className="px-6 py-4">{complaint.category}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(complaint.status)}`}></span>
                                                                {complaint.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-6 rounded-full bg-slate-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                                                                    {complaint.assignedStaff?.profileImage ? (
                                                                        <img className="w-full h-full object-cover" src={complaint.assignedStaff.profileImage} alt={complaint.assignedStaff.name} />
                                                                    ) : (
                                                                        <Icon name="person" className="text-xs flex items-center justify-center h-full" />
                                                                    )}
                                                                </div>
                                                                <span className="text-slate-700 dark:text-slate-300">{complaint.assignedStaff?.name || 'Not Assigned'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button 
                                                                    onClick={() => { setSelectedComplaint(complaint); setIsAssignModalOpen(true); }}
                                                                    className="p-1 text-slate-400 hover:text-primary transition-colors" 
                                                                    title="Assign Staff"
                                                                >
                                                                    <Icon name="person_add" className="text-lg" />
                                                                </button>
                                                                {complaint.status !== 'Resolved' && (
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(complaint._id, 'Resolved')}
                                                                        className="p-1 text-slate-400 hover:text-green-500 transition-colors" 
                                                                        title="Close Ticket"
                                                                    >
                                                                        <Icon name="check_circle" className="text-lg" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={7} className="text-center py-20 text-slate-500">No complaints found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Pagination Footer */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/30">
                                <span>Showing {filteredComplaints.length} results</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>Previous</button>
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white transition-colors">1</button>
                                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Assign Staff Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAssignModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative z-10"
                        >
                            <h3 className="text-lg font-bold mb-4">Assign Staff</h3>
                            <p className="text-sm text-slate-500 mb-6">Select a staff member to handle this complaint: <span className="font-semibold text-slate-900 dark:text-white">"{selectedComplaint?.title}"</span></p>
                            
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {staffMembers.length > 0 ? (
                                    staffMembers.map(staff => (
                                        <button
                                            key={staff._id}
                                            onClick={() => handleAssignStaff(staff._id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30 transition-all text-left group"
                                        >
                                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                                {staff.profileImage ? (
                                                    <img src={staff.profileImage} alt={staff.name} className="size-full object-cover" />
                                                ) : (
                                                    <Icon name="person" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{staff.name}</p>
                                                <p className="text-xs text-slate-500">{staff.designation || 'Staff'}</p>
                                            </div>
                                            <Icon name="chevron_right" className="ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-slate-500">No staff members found.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="w-full mt-6 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
