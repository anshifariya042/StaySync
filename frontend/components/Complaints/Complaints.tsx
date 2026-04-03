"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-slate-400">Loading Complaint Register...</div>}>
            <ComplaintsContent />
        </Suspense>
    );
}

function ComplaintsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const limit = 5;

    // Sync URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();
            if (searchTerm) params.set('search', searchTerm);
            if (page > 1) params.set('page', page.toString());
            
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, page, pathname, router]);

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
        <div className="bg-background-dashboard text-slate-800 flex h-screen overflow-hidden antialiased">
            <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>

            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden lg:pl-72">
                <AdminHeader title="Complaints Management" onMenuClick={() => setSidebarOpen(true)}>
                     <div className="flex items-center gap-3">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search complaints tracked..." 
                            className="hidden md:block w-72"
                        />
                    </div>
                </AdminHeader>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="md:hidden">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search complaints..." 
                        />
                    </div>

                    {/* Complaints Table Container */}
                    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden transition-all duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Complaint Header</th>
                                        <th className="px-6 py-4">Incident Details</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Assignee</th>
                                        <th className="px-6 py-4">Logged Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                                <p className="text-sm font-medium text-slate-400">Fetching incident log...</p>
                                            </div>
                                        </td></tr>
                                    ) : complaints.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-24">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon name="assignment_turned_in" className="text-5xl text-slate-200 material-symbols-outlined" />
                                                <p className="text-slate-400 font-medium">No open complaints found.</p>
                                            </div>
                                        </td></tr>
                                    ) : complaints.map((complaint: any) => (
                                        <tr key={complaint._id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-800 tracking-tight leading-none">{complaint.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest">INC-{complaint._id.slice(-6).toUpperCase()}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                                     <Icon name="meeting_room" className="material-symbols-outlined text-xs text-slate-400" />
                                                     Room {complaint.roomNumber}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{complaint.category}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getBadgeVariant(complaint.status) === 'resolved' ? 'bg-emerald-100 text-emerald-700' : getBadgeVariant(complaint.status) === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {complaint.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-xl bg-slate-50 overflow-hidden border border-border-light flex items-center justify-center font-bold text-[10px] text-slate-400">
                                                        {complaint.assignedStaff?.profileImage ? (
                                                            <img className="size-full object-cover" src={complaint.assignedStaff.profileImage} alt={complaint.assignedStaff.name} />
                                                        ) : (
                                                            complaint.assignedStaff?.name?.charAt(0) || <Icon name="person" className="material-symbols-outlined text-sm" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{complaint.assignedStaff?.name || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={() => { setSelectedComplaint(complaint); setIsAssignModalOpen(true); }}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                                                        title="Assign Staff"
                                                    >
                                                        <Icon name="person_add" className="material-symbols-outlined text-lg" />
                                                    </button>
                                                    {complaint.status !== 'Resolved' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(complaint._id, 'Resolved')}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" 
                                                            title="Close Ticket"
                                                        >
                                                            <Icon name="check_circle" className="material-symbols-outlined text-lg" />
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
                        <div className="px-6 py-4 border-t border-border-light flex items-center justify-between bg-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Showing {complaints.length} tickets</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-border-light text-slate-300 disabled:opacity-30 hover:bg-white transition-all"
                                >
                                    <Icon name="chevron_left" className="material-symbols-outlined" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all ${
                                                page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white border border-border-light text-slate-400 hover:border-primary/30'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-border-light text-slate-300 disabled:opacity-30 hover:bg-white transition-all"
                                >
                                    <Icon name="chevron_right" className="material-symbols-outlined" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Assign Staff Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Staff Member"
            >
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-border-light">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Ticket</p>
                    <p className="font-bold text-slate-800 tracking-tight leading-tight">"{selectedComplaint?.title}"</p>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {staffMembers.length > 0 ? (
                        staffMembers.map((staff: any) => (
                            <button
                                key={staff._id}
                                onClick={() => handleAssignStaff(staff._id)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border-light hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                            >
                                <div className="size-11 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-border-light shadow-sm">
                                    {staff.profileImage ? (
                                        <img src={staff.profileImage} alt={staff.name} className="size-full object-cover" />
                                    ) : (
                                        <div className="font-bold text-xs text-primary">{staff.name?.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-500 truncate">{staff.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{staff.designation || 'Technical Staff'}</p>
                                </div>
                                <Icon name="chevron_right" className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-12">
                             <Icon name="person_off" className="text-4xl text-slate-100 mb-2 material-symbols-outlined" />
                             <p className="text-slate-400 text-sm font-medium">No personal found for assignment.</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-8 pt-6 ">
                    <button
                        onClick={() => setIsAssignModalOpen(false)}
                        className="flex-1 px-4 py-3 rounded-xl border border-border-light font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    )
}
