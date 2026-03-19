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
        <div className="bg-background-dashboard text-slate-800 flex h-screen overflow-hidden antialiased font-sans">
             <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title="Room Management" onMenuClick={() => setSidebarOpen(true)}>
                    <div className="flex items-center gap-4">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Filter rooms..." 
                            className="hidden md:block w-64"
                        />
                        <button
                            onClick={() => handleOpenModal('add')}
                            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0"
                        >
                            <Icon name="add" className="material-symbols-outlined text-[20px]" />
                            <span className="hidden sm:inline">Add Room</span>
                        </button>
                    </div>
                </AdminHeader>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="md:hidden">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search rooms..." 
                        />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Scanning Directory...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {rooms.length > 0 ? (
                                rooms.map((room: any) => {
                                    return (
                                        <motion.div
                                            key={room._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ y: -4 }}
                                            className="bg-white p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                    <Icon name="bed" className="material-symbols-outlined text-2xl" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleOpenModal('edit', room)} className="p-2.5 bg-slate-50 hover:bg-primary/10 rounded-xl text-slate-400 hover:text-primary transition-all"><Icon name="edit" className="material-symbols-outlined text-lg" /></button>
                                                    <button onClick={() => handleDelete(room._id)} className="p-2.5 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Icon name="delete" className="material-symbols-outlined text-lg" /></button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none">Room {room.roomNumber}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.type} Room</span>
                                                    <span className="text-slate-200">/</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.capacity} Bed Unit</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <div className="text-xl font-black text-primary tracking-tight">₹{room.price}<span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1 font-bold">/ Mo</span></div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getBadgeVariant(room.status) === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {room.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            ) : (
                                <div className="col-span-full py-32 text-center">
                                    <Icon name="meeting_room" className="text-6xl text-slate-100 mb-4 material-symbols-outlined" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching rooms allocated</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Room Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Onboard New Room' : 'Update Room Configuration'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room Identification</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-2xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                            placeholder="e.g. 101-A"
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room Class</label>
                            <select
                                className="w-full px-4 py-3 rounded-2xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Standard</option>
                                <option>Deluxe</option>
                                <option>Premium</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Beds available</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-3 rounded-2xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                                placeholder="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Monthly Pricing</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                required
                                type="number"
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                                placeholder="5000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Inventory Status</label>
                        <select
                            className="w-full px-4 py-3 rounded-2xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="available">AVAILABLE</option>
                            <option value="occupied">OCCUPIED</option>
                            <option value="maintenance">MAINTENANCE</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-3 rounded-2xl border border-border-light font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
                        >
                            {modalMode === 'add' ? 'Confirm Onboarding' : 'Save Updates'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
