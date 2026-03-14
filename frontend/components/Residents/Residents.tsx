"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useResidents, useDeleteResident } from '@/hooks/useResidents'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'

export default function Residents() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const { data: residents = [], isLoading } = useResidents(user?.hostelId, searchTerm)
    const deleteResidentMutation = useDeleteResident()

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
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            <style jsx global>{`
                body { font-family: 'Public Sans', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <div className="flex min-h-screen">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
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

                    {/* Table Section */}
                    <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        {/* Mobile Search */}
                        <div className="md:hidden">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search residents..." 
                            />
                        </div>

                        {/* Table Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resident</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Join Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {isLoading ? (
                                            <tr><td colSpan={6} className="text-center py-20">
                                                <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                            </td></tr>
                                        ) : residents.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center py-20 text-slate-500">No residents found.</td></tr>
                                        ) : residents.map((resident: any) => (
                                            <tr key={resident._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs bg-indigo-100 text-indigo-600 border border-indigo-200">
                                                            {resident.profileImage ? (
                                                                <img src={resident.profileImage} alt={resident.name} className="size-full object-cover" />
                                                            ) : (
                                                                resident.name?.charAt(0).toUpperCase() || 'U'
                                                            )}
                                                        </div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">{resident.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-900 dark:text-white">{resident.email}</p>
                                                    <p className="text-xs text-slate-500">{resident.phone || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                                                         <Icon name="meeting_room" className="text-sm text-slate-400" />
                                                         {resident.roomId?.roomNumber || 'Not Assigned'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-sm">
                                                    {resident.createdAt ? new Date(resident.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={getBadgeVariant(resident.status)}>
                                                        {resident.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleDelete(resident._id)} 
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Remove Resident"
                                                        >
                                                            <Icon name="delete" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Placeholder */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-sm text-slate-500">Showing {residents.length} residents</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>
                                        <Icon name="chevron_left" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold">1</button>
                                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-30" disabled>
                                        <Icon name="chevron_right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
