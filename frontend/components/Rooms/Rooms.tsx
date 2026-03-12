"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getRooms, addRoom, updateRoom, deleteRoom } from '@/services/adminService'
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

export default function Rooms() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('Rooms')
    const [rooms, setRooms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
    const [currentRoom, setCurrentRoom] = useState<any>(null)
    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'Standard',
        price: '',
        capacity: '',
        status: 'available'
    })

    const fetchRooms = async () => {
        if (!user?.hostelId) return;
        try {
            const data = await getRooms(user.hostelId);
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user]);

    const handleOpenModal = (mode: 'add' | 'edit', room?: any) => {
        setModalMode(mode)
        if (mode === 'edit' && room) {
            setCurrentRoom(room)
            setFormData({
                roomNumber: room.roomNumber,
                type: room.type,
                price: room.price.toString(),
                capacity: room.capacity.toString(),
                status: room.status
            })
        } else {
            setCurrentRoom(null)
            setFormData({
                roomNumber: '',
                type: 'Standard',
                price: '',
                capacity: '',
                status: 'Available'
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                hostelId: user?.hostelId
            }
            if (modalMode === 'add') {
                await addRoom(payload)
            } else {
                await updateRoom(currentRoom._id, payload)
            }
            setIsModalOpen(false)
            fetchRooms()
        } catch (error) {
            console.error("Error submitting room:", error)
            alert("Failed to save room details.")
        }
    }

    const handleDelete = async (roomId: string) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return
        try {
            await deleteRoom(roomId)
            fetchRooms()
        } catch (error) {
            console.error("Error deleting room:", error)
        }
    }

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'available':
                return {
                    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                    dotColor: 'bg-emerald-500'
                }
            case 'occupied':
                return {
                    statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                    dotColor: 'bg-amber-500'
                }
            case 'maintenance':
                return {
                    statusColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
                    dotColor: 'bg-slate-400'
                }
            default:
                return {
                    statusColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
                    dotColor: 'bg-slate-400'
                }
        }
    }

    const filteredRooms = rooms.filter(room =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <h1 className="text-xl font-semibold">Rooms Inventory</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-slate-500 hover:text-primary transition-colors">
                                <Icon name="notifications" />
                            </button>
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
                            >
                                <Icon name="add" className="text-lg" />
                                Add Room
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
                                        placeholder="Search rooms..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">
                                    <span>Filter</span>
                                    <Icon name="expand_more" className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Room Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredRooms.length > 0 ? (
                                    filteredRooms.map((room) => {
                                        const { statusColor, dotColor } = getStatusStyles(room.status);
                                        return (
                                            <motion.div
                                                key={room._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-primary/5 transition-all group relative"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <Icon name="bed" className="text-2xl" />
                                                    </div>
                                                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenModal('edit', room)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-primary transition-colors"><Icon name="edit" className="text-lg" /></button>
                                                        <button onClick={() => handleDelete(room._id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-500 transition-colors"><Icon name="delete" className="text-lg" /></button>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Room {room.roomNumber}</h3>
                                                    <p className="text-sm text-slate-500">{room.type} Room • {room.capacity} Bed</p>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                                    <div className="text-sm font-semibold text-primary">₹{room.price}/mo</div>
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColor} flex items-center gap-1`}>
                                                        <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
                                                        {room.status}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    <div className="col-span-full py-20 text-center text-slate-500">No rooms found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Room Modal */}
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
                            <h2 className="text-xl font-bold mb-6">{modalMode === 'add' ? 'Add New Room' : 'Edit Room'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Room Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. 101"
                                        value={formData.roomNumber}
                                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Type</label>
                                        <select
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Standard</option>
                                            <option>Deluxe</option>
                                            <option>Premium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 ml-1">Capacity</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="1"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Price per Month</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                        <input
                                            required
                                            type="number"
                                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="5000"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 ml-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="maintenance">Maintenance</option>
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
                                        {modalMode === 'add' ? 'Add Room' : 'Save Changes'}
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
