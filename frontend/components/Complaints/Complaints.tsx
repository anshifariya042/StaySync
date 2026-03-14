"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useComplaints, useUpdateComplaintStatus, useAssignStaff } from '@/hooks/useComplaints'
import { useStaff } from '@/hooks/useStaff'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import Modal from '@/components/ui/Modal'

export default function Complaints() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [page, setPage] = useState(1);
    const limit = 5;

    // Fetch queries
    const { data, isLoading: loading } = useComplaints(user?.hostelId, searchTerm, page, limit)
    const complaints = data?.complaints || [];
    const totalPages = data?.totalPages || 1;
    const { data: staffMembers = [] } = useStaff(user?.hostelId)

    // Mutations
    const updateComplaintStatusMutation = useUpdateComplaintStatus()
    const assignStaffMutation = useAssignStaff()

    // Assignment States
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null)

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateComplaintStatusMutation.mutateAsync({ complaintId: id, status })
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const handleAssignStaff = async (staffId: string) => {
        if (!selectedComplaint) return;
        try {
            await assignStaffMutation.mutateAsync({ complaintId: selectedComplaint._id, staffId })
            setIsAssignModalOpen(false);
        } catch (error) {
            console.error("Error assigning staff:", error);
        }
    }

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'Pending': return 'pending';
            case 'In Progress': return 'in-progress';
            case 'Resolved': return 'resolved';
            case 'High Priority': return 'high-priority';
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
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
                    <AdminHeader title="Complaints Management" onMenuClick={() => setSidebarOpen(true)}>
                         <div className="flex items-center gap-3">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search complaints..." 
                                className="hidden md:block w-72"
                            />
                        </div>
                    </AdminHeader>

                    {/* Content Section */}
                    <div className="p-4 md:p-8 space-y-6 flex-1 overflow-y-auto pb-24 md:pb-8">
                        <div className="md:hidden">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search complaints..." 
                            />
                        </div>

                        {/* Table Container */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Complaint</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Assigned Staff</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr><td colSpan={6} className="text-center py-20">
                                                <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                            </td></tr>
                                        ) : complaints.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center py-20 text-slate-500">No complaints found.</td></tr>
                                        ) : complaints.map((complaint: any) => (
                                            <tr key={complaint._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{complaint.title}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">ID: #{complaint._id.slice(-6).toUpperCase()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                                                         <Icon name="meeting_room" className="text-xs text-slate-400" />
                                                         Room {complaint.roomNumber}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{complaint.category}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={getBadgeVariant(complaint.status)}>
                                                        {complaint.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                                            {complaint.assignedStaff?.profileImage ? (
                                                                <img className="size-full object-cover" src={complaint.assignedStaff.profileImage} alt={complaint.assignedStaff.name} />
                                                            ) : (
                                                                <Icon name="person" className="text-sm text-slate-400" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{complaint.assignedStaff?.name || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => { setSelectedComplaint(complaint); setIsAssignModalOpen(true); }}
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                                                            title="Assign Staff"
                                                        >
                                                            <Icon name="person_add" />
                                                        </button>
                                                        {complaint.status !== 'Resolved' && (
                                                            <button 
                                                                onClick={() => handleUpdateStatus(complaint._id, 'Resolved')}
                                                                className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                                                                title="Mark as Resolved"
                                                            >
                                                                <Icon name="check_circle" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Footer */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/30">
                                <span className="text-slate-500">Showing {complaints.length} results</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-white transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-all ${
                                                    page === i + 1 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-30 hover:bg-white transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Assign Staff Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Staff Member"
            >
                <p className="text-sm text-slate-500 mb-6 italic">Current Complaint: <span className="font-semibold text-slate-900 dark:text-white not-italic">"{selectedComplaint?.title}"</span></p>
                
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {staffMembers.length > 0 ? (
                        staffMembers.map((staff: any) => (
                            <button
                                key={staff._id}
                                onClick={() => handleAssignStaff(staff._id)}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/20 transition-all text-left group"
                            >
                                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {staff.profileImage ? (
                                        <img src={staff.profileImage} alt={staff.name} className="size-full object-cover" />
                                    ) : (
                                        <Icon name="engineering" className="text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{staff.name}</p>
                                    <p className="text-xs text-slate-500">{staff.designation || 'Technical Staff'}</p>
                                </div>
                                <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8">
                             <Icon name="person_off" className="text-3xl text-slate-300 mb-2" />
                             <p className="text-slate-500 text-sm">No staff members available.</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button
                        onClick={() => setIsAssignModalOpen(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    )
}
