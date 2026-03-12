"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getResidents, addResident, deleteResident, getRooms } from '@/services/adminService'
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

export default function Residents() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Residents')
    const [residents, setResidents] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'Password123!', // Default password for new residents
        phone: '',
        roomId: ''
    })

    const fetchResidents = async () => {
        if (!user?.hostelId) return;
        try {
            const data = await getResidents(user.hostelId);
            setResidents(data);
        } catch (error) {
            console.error("Failed to fetch residents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRooms = async () => {
        if (!user?.hostelId) return;
        try {
            const data = await getRooms(user.hostelId);
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchResidents();
            fetchRooms();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addResident({ ...formData, hostelId: user?.hostelId })
            setIsModalOpen(false)
            setFormData({
                name: '',
                email: '',
                password: 'Password123!',
                phone: '',
                roomId: ''
            })
            fetchResidents()
        } catch (error) {
            console.error("Error adding resident:", error)
            alert("Failed to add resident. Please check if email is already in use.")
        }
    }

    const handleDelete = async (residentId: string) => {
        if (!window.confirm("Are you sure you want to remove this resident?")) return
        try {
            await deleteResident(residentId)
            fetchResidents()
        } catch (error) {
            console.error("Error deleting resident:", error)
        }
    }

    const filteredResidents = residents.filter(resident => 
        (resident.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resident.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resident.roomId?.roomNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )

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
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@staysync.com'}</p>
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
                            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <Icon name="notifications" />
                                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                            >
                                <Icon name="add" className="text-lg" />
                                Add Resident
                            </button>
                        </div>
                    </header>

                    {/* Table Section */}
                    <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        {/* Controls Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                                <input 
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm placeholder:text-slate-400 transition-all" 
                                    placeholder="Search residents by name, email or room..." 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Icon name="filter_list" className="text-xl" />
                                    Filter
                                </button>
                            </div>
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
                                        {isLoading ? (
                                            <tr><td colSpan={7} className="text-center py-20">
                                                <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                            </td></tr>
                                        ) : filteredResidents.length === 0 ? (
                                            <tr><td colSpan={7} className="text-center py-20 text-slate-500">No residents found.</td></tr>
                                        ) : filteredResidents.map((resident) => (
                                            <tr key={resident._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-indigo-100 text-indigo-600">
                                                            {resident.profileImage ? (
                                                                <img src={resident.profileImage} alt={resident.name} className="size-full object-cover" />
                                                            ) : (
                                                                resident.name?.charAt(0).toUpperCase() || 'U'
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{resident.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{resident.email}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{resident.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                    {resident.roomId?.roomNumber || 'Not Assigned'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                                                    {resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                                                        resident.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        resident.status === 'move-out pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                        resident.status === 'on leave' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}>
                                                        {resident.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleDelete(resident._id)} className="text-red-500 hover:text-red-400 text-sm font-medium">Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-sm text-slate-500">Showing {filteredResidents.length} residents</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <Icon name="chevron_left" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-sm font-medium">1</button>
                                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <Icon name="chevron_right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Resident Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10"
                        >
                            <h2 className="text-xl font-bold mb-6">Add New Resident</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Assign Room</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        value={formData.roomId}
                                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                                    >
                                        <option value="">Select Room (Optional)</option>
                                        {rooms.map(room => (
                                            <option key={room._id} value={room._id}>
                                                Room {room.roomNumber} ({room.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Add Resident
                                    </button>
                                </div>
                            </form>
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
