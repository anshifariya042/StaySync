"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useResidents, useDeleteResident, useUpdateResidentStatus } from '@/hooks/useResidents'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'

export default function Residents() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-slate-400">Synchronizing Resident Registry...</div>}>
            <ResidentsContent />
        </Suspense>
    );
}

function ResidentsContent() {
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

    const { data: residents = [], isLoading } = useResidents(user?.hostelId, searchTerm)
    const deleteResidentMutation = useDeleteResident()
    const updateStatusMutation = useUpdateResidentStatus()

    const handleUpdateStatus = async (userId: string, status: string) => {
        if (!window.confirm(`Are you sure you want to ${status} this resident?`)) return
        try {
            await updateStatusMutation.mutateAsync({ userId, status })
        } catch (error) {
            console.error(`Error updating resident status to ${status}:`, error)
        }
    }

    const handleDelete = async (residentId: string) => {
        if (!window.confirm("Are you sure you want to remove this resident?")) return
        try {
            await deleteResidentMutation.mutateAsync(residentId)
        } catch (error) {
            console.error("Error deleting resident:", error)
        }
    }

    const getBadgeVariant = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'active': return 'resolved';
            case 'move-out pending': return 'pending';
            case 'on leave': return 'in-progress';
            default: return 'default';
        }
    }

    return (
        <div className="bg-background-dashboard text-slate-800 flex h-screen overflow-hidden antialiased">
            <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden lg:pl-72">
                <AdminHeader title="Residents Management" onMenuClick={() => setSidebarOpen(true)}>
                     <div className="flex items-center gap-3">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search residents..." 
                            className="hidden md:block w-72"
                        />
                    </div>
                </AdminHeader>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Mobile Search */}
                    <div className="md:hidden">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search residents..." 
                        />
                    </div>

                    {/* Residents Table */}
                    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden transition-all duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Resident</th>
                                        <th className="px-6 py-4">Contact Details</th>
                                        <th className="px-6 py-4">Room Allocation</th>
                                        <th className="px-6 py-4">Admission Date</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {isLoading ? (
                                        <tr><td colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                                <p className="text-sm font-medium text-slate-400">Loading residents data...</p>
                                            </div>
                                        </td></tr>
                                    ) : residents.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-24">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon name="person_off" className="text-5xl text-slate-200 material-symbols-outlined" />
                                                <p className="text-slate-400 font-medium">No residents found.</p>
                                            </div>
                                        </td></tr>
                                    ) : residents.map((resident: any) => (
                                        <tr key={resident._id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-sm bg-primary/5 text-primary border border-primary/10">
                                                        {resident.profileImage ? (
                                                            <img src={resident.profileImage} alt={resident.name} className="size-full object-cover" />
                                                        ) : (
                                                            resident.name?.charAt(0).toUpperCase() || 'U'
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-slate-800 tracking-tight">{resident.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-slate-800 text-sm">{resident.email}</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{resident.phone || 'NO PHONE'}</p>
                                            </td>
                                            <td className="px-6 py-5 focus-within:ring-0">
                                                <div className="flex items-center gap-2 font-bold text-slate-700">
                                                     <Icon name="meeting_room" className="material-symbols-outlined text-sm text-slate-300 group-hover:text-primary transition-colors" />
                                                     <span className="text-sm">{resident.roomId?.roomNumber || 'Not Assigned'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 font-medium text-sm">
                                                {resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getBadgeVariant(resident.status) === 'resolved' ? 'bg-emerald-100 text-emerald-700' : getBadgeVariant(resident.status) === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {resident.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {resident.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(resident._id, 'approved')} 
                                                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                                                                title="Approve Resident"
                                                            >
                                                                <Icon name="check_circle" className="material-symbols-outlined text-lg" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateStatus(resident._id, 'rejected')} 
                                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                                                                title="Reject Resident"
                                                            >
                                                                <Icon name="cancel" className="material-symbols-outlined text-lg" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(resident._id)} 
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                        title="Remove Resident"
                                                    >
                                                        <Icon name="delete" className="material-symbols-outlined text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-border-light flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {residents.length} residents</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>
                                    <Icon name="chevron_left" className="material-symbols-outlined" />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/20">1</button>
                                <button className="p-2 text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>
                                    <Icon name="chevron_right" className="material-symbols-outlined" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
