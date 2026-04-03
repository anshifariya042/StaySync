"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useRooms, useAddRoom, useUpdateRoom, useDeleteRoom } from '@/hooks/useRooms'
import * as XLSX from 'xlsx'

import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function Rooms() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-[#4F7C82]">Initializing Unit Matrix...</div>}>
            <RoomsContent />
        </Suspense>
    );
}

function RoomsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

    // Sync URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, pathname, router]);

    // Fetch queries
    const { data: rooms = [], isLoading: loading } = useRooms(user?.hostelId, searchTerm)
    const excelFileInputRef = React.useRef<HTMLInputElement>(null)
    const [isBulkLoading, setIsBulkLoading] = useState(false)

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
    const [currentRoom, setCurrentRoom] = useState<any>(null)
    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'single',
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
                type: 'single',
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

    const downloadTemplate = () => {
        const template = [
            { "Room Number": "101", "Capacity": 2, "Type": "Two sharing", "Price": 5500 },
            { "Room Number": "102", "Capacity": 4, "Type": "Four sharing", "Price": 4500 }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rooms");
        XLSX.writeFile(wb, "StaySync_Room_Inventory_Update_Template.xlsx");
    }

    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.hostelId) return;

        setIsBulkLoading(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    alert("The Excel file seems empty.");
                    setIsBulkLoading(false);
                    return;
                }

                const mappedRooms = data.map((row: any) => ({
                    roomNumber: String(row["Room Number"] || row["roomNo"] || row["room"] || ""),
                    capacity: Number(row["Capacity"] || row["capacity"] || 1),
                    type: String(row["Type"] || row["type"] || "Standard"),
                    price: Number(row["Price"] || row["price"] || 0),
                    hostelId: user.hostelId
                })).filter(r => r.roomNumber !== "");

                // Simple implementation: Add all as new rooms. 
                // For a more advanced version, we could check for existing roomNumbers and update.
                // But for now, let's keep it simple as requested.
                for (const room of mappedRooms) {
                    await addRoomMutation.mutateAsync(room);
                }
                
                alert(`Successfully processed ${mappedRooms.length} rooms.`);
            } catch (err) {
                console.error("Excel Parse Error:", err);
                alert("Failed to parse the Excel file.");
            } finally {
                setIsBulkLoading(false);
                if (excelFileInputRef.current) excelFileInputRef.current.value = '';
            }
        };
        reader.readAsBinaryString(file);
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

    const formatRoomType = (type: string) => {
        if (!type) return "Standard";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="bg-[#F8FAFC] font-display text-[#0B2E33] min-h-screen antialiased flex">
             <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen flex flex-col lg:pl-72">
                <AdminHeader title="Inventory Matrix" onMenuClick={() => setSidebarOpen(true)}>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Filter mapping..." 
                                className="w-64"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={downloadTemplate}
                                className="p-3 bg-white border border-[#B8E3E9] text-[#4F7C82] rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-[#B8E3E9]/10 transition-all active:scale-95"
                                title="Download Template"
                            >
                                <Icon name="download" className="text-sm" />
                                <span className="hidden lg:inline">Template</span>
                            </button>
                            <button
                                onClick={() => excelFileInputRef.current?.click()}
                                disabled={isBulkLoading}
                                className="p-3 bg-[#B8E3E9] text-[#4F7C82] rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Icon name={isBulkLoading ? "sync" : "upload_file"} className={isBulkLoading ? "animate-spin" : ""} />
                                <span className="hidden lg:inline">{isBulkLoading ? "Importing..." : "Bulk Upload"}</span>
                            </button>
                            <input 
                                type="file" 
                                ref={excelFileInputRef} 
                                onChange={handleExcelUpload} 
                                accept=".xlsx, .xls, .csv" 
                                className="hidden" 
                            />
                            <button
                                onClick={() => handleOpenModal('add')}
                                className="bg-[#0B2E33] text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0B2E33]/20 hover:scale-105 transition-all active:scale-95 shrink-0"
                            >
                                <Icon name="add_box" />
                                <span className="hidden sm:inline">Add Unit</span>
                            </button>
                        </div>
                    </div>
                </AdminHeader>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="md:hidden mb-8">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search mapping..." 
                            />
                        </div>

                        {loading ? (
                            <div className="py-24 text-center">
                                <div className="animate-spin size-12 border-4 border-[#B8E3E9] border-t-[#4F7C82] rounded-full mx-auto mb-6"></div>
                                <p className="text-sm font-black text-[#4F7C82] uppercase tracking-[0.2em]">Scanning Capacity...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {rooms.length > 0 ? (
                                    rooms.map((room: any) => {
                                        return (
                                            <motion.div
                                                key={room._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-[#4F7C82]/10 transition-all duration-500 group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-10 relative z-10">
                                                    <div className="size-14 rounded-2xl bg-[#B8E3E9]/20 flex items-center justify-center text-[#4F7C82] border border-[#B8E3E9]/30 group-hover:scale-110 group-hover:bg-[#B8E3E9]/40 transition-all duration-500">
                                                        <Icon name="meeting_room" className="text-2xl" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleOpenModal('edit', room)} 
                                                            className="size-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-[#4F7C82] hover:text-[#0B2E33] hover:shadow-md transition-all active:scale-95"
                                                        >
                                                            <Icon name="edit" className="text-lg" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(room._id)} 
                                                            className="size-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-[#4F7C82] hover:text-red-500 hover:shadow-md transition-all active:scale-95"
                                                        >
                                                            <Icon name="delete" className="text-lg" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 relative z-10">
                                                    <h3 className="font-black text-3xl text-[#0B2E33] tracking-tighter leading-none group-hover:text-[#4F7C82] transition-colors">{room.roomNumber}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-widest bg-[#B8E3E9]/30 px-2 py-0.5 rounded-md">{formatRoomType(room.type)}</span>
                                                        <span className="text-slate-200">/</span>
                                                        <span className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] opacity-60">{room.capacity} BEDS</span>
                                                    </div>
                                                </div>

                                                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                                                    <div className="text-2xl font-black text-[#0B2E33] tracking-tighter">
                                                        ₹{room.price}
                                                        <span className="text-[10px] text-[#4F7C82] uppercase tracking-widest ml-1 opacity-60 font-bold">/ Mo</span>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-white ${
                                                        room.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#B8E3E9]/40 text-[#4F7C82]'
                                                    }`}>
                                                        {room.status}
                                                    </span>
                                                </div>
                                                
                                                {/* Decorative background element */}
                                                <div className="absolute -right-10 -bottom-10 size-40 bg-[#B8E3E9]/10 rounded-full blur-3xl group-hover:bg-[#B8E3E9]/20 transition-all duration-1000"></div>
                                            </motion.div>
                                        )
                                    })
                                ) : (
                                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-[#B8E3E9]">
                                        <Icon name="meeting_room" className="text-6xl text-[#B8E3E9] mb-4 opacity-50" />
                                        <p className="text-[#4F7C82] font-black uppercase tracking-widest text-xs opacity-60">No matching logs found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Room Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Onboard New Unit' : 'Update Matrix'}
            >
                <form onSubmit={handleSubmit} className="space-y-8 p-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] ml-1 opacity-70">Room Identification</label>
                        <input
                            required
                            type="text"
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all font-black text-sm text-[#0B2E33] placeholder:opacity-30"
                            placeholder="e.g. 101-A"
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] ml-1 opacity-70">Classification</label>
                            <select
                                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all font-black text-sm text-[#0B2E33] appearance-none cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="single">single</option>
                                <option value="Two sharing">Two sharing</option>
                                <option value="Four sharing">Four sharing</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] ml-1 opacity-70">Capacity</label>
                            <input
                                required
                                type="number"
                                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all font-black text-sm text-[#0B2E33]"
                                placeholder="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] ml-1 opacity-70">Base Pricing</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4F7C82] font-black opacity-50">₹</span>
                            <input
                                required
                                type="number"
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all font-black text-sm text-[#0B2E33]"
                                placeholder="5000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#4F7C82] uppercase tracking-[0.2em] ml-1 opacity-70">Inventory Sync</label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#B8E3E9]/50 focus:border-[#4F7C82] transition-all font-black text-sm text-[#0B2E33] appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="available">AVAILABLE</option>
                            <option value="occupied">OCCUPIED</option>
                            <option value="maintenance">MAINTENANCE</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-8">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-8 py-4 rounded-2xl border border-slate-100 font-black text-[#4F7C82] hover:bg-slate-50 transition-all uppercase text-[10px] tracking-[0.2em]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-8 py-4 rounded-2xl bg-[#0B2E33] text-white font-black hover:bg-[#0B2E33]/90 shadow-xl shadow-[#0B2E33]/20 transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em]"
                        >
                            {modalMode === 'add' ? 'Confirm Onboarding' : 'Sync Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
