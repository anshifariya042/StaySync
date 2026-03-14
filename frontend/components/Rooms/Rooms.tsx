"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useRooms, useAddRoom, useUpdateRoom, useDeleteRoom } from '@/hooks/useRooms'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'

export default function Rooms() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch queries
    const { data: rooms = [], isLoading: loading } = useRooms(user?.hostelId, searchTerm)

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

    // Mutations
    const addRoomMutation = useAddRoom()
    const updateRoomMutation = useUpdateRoom()
    const deleteRoomMutation = useDeleteRoom()

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
                status: 'available'
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
                await addRoomMutation.mutateAsync(payload)
            } else {
                await updateRoomMutation.mutateAsync({ roomId: currentRoom._id, roomData: payload })
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error("Error submitting room:", error)
            alert("Failed to save room details.")
        }
    }

    const handleDelete = async (roomId: string) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return
        try {
            await deleteRoomMutation.mutateAsync(roomId)
        } catch (error) {
            console.error("Error deleting room:", error)
        }
    }

    const getBadgeVariant = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'available': return 'resolved';
            case 'occupied': return 'pending';
            case 'maintenance': return 'default';
            default: return 'default';
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <style jsx global>{`
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <div className="flex min-h-screen">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <AdminHeader title="Room Management" onMenuClick={() => setSidebarOpen(true)}>
                        <div className="flex items-center gap-3">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search rooms..." 
                                className="hidden md:block w-64"
                            />
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm shadow-primary/20 active:scale-95"
                            >
                                <Icon name="add" className="text-xl" />
                                <span className="hidden sm:inline">Add Room</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </AdminHeader>

                    {/* Content Section */}
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        <div className="md:hidden mb-4 relative">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search rooms..." 
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {rooms.length > 0 ? (
                                    rooms.map((room: any) => {
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
                                                    <Badge variant={getBadgeVariant(room.status)}>
                                                        {room.status}
                                                    </Badge>
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add New Room' : 'Edit Room Details'}
            >
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
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 transition-all"
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
            </Modal>
        </div>
    )
}
