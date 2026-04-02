"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useStaff, useAddStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/useStaff'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import Modal from '@/components/ui/Modal'
import { useModal } from '@/components/Providers/ModalProvider'

export default function Staff() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-black uppercase text-slate-400">Loading Staff Directory...</div>}>
            <StaffContent />
        </Suspense>
    );
}

function StaffContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { user } = useAuth()
    const { showAlert, showConfirm } = useModal()
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
    const { data: staffMembers = [], isLoading: loading } = useStaff(user?.hostelId, searchTerm)

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
    const [currentStaff, setCurrentStaff] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'StaffPassword123!',
        phone: '',
        designation: '',
        status: 'active'
    })

    // Mutations
    const addStaffMutation = useAddStaff()
    const updateStaffMutation = useUpdateStaff()
    const deleteStaffMutation = useDeleteStaff()

    const handleOpenModal = (mode: 'add' | 'edit', staff?: any) => {
        setModalMode(mode)
        if (mode === 'edit' && staff) {
            setCurrentStaff(staff)
            setFormData({
                name: staff.name,
                email: staff.email,
                password: '',
                phone: staff.phone || '',
                designation: staff.designation || '',
                status: staff.status
            })
        } else {
            setCurrentStaff(null)
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                designation: '',
                status: 'active'
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (modalMode === 'add') {
                await addStaffMutation.mutateAsync({ ...formData, hostelId: user?.hostelId })
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete (updateData as any).password;
                await updateStaffMutation.mutateAsync({ staffId: currentStaff._id, staffData: updateData })
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error("Error saving staff member:", error)
            showAlert("Action Failed", "Failed to save staff information. Please check your network or try again.", "error")
        }
    }

    const handleDelete = async (staffId: string) => {
        showConfirm(
            "Terminate Employment", 
            "Are you sure you want to remove this staff member from the system? This action cannot be undone.",
            async () => {
                try {
                    await deleteStaffMutation.mutateAsync(staffId)
                    showAlert("Success", "Staff member removed successfully.", "success")
                } catch (error) {
                    console.error("Error deleting staff:", error)
                    showAlert("Error", "Could not remove staff member.", "error")
                }
            }
        )
    }

    const getBadgeVariant = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'active': return 'resolved';
            case 'on leave': return 'pending';
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
                <AdminHeader title="Staff Management" onMenuClick={() => setSidebarOpen(true)}>
                     <div className="flex items-center gap-4">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search staff..." 
                            className="hidden md:block w-72"
                        />
                        <button 
                            onClick={() => handleOpenModal('add')}
                            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0 flex items-center gap-2"
                        >
                            <Icon name="add" className="material-symbols-outlined text-[20px]" />
                            <span className="hidden sm:inline">Add Staff</span>
                        </button>
                    </div>
                </AdminHeader>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="md:hidden">
                        <SearchInput 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                            placeholder="Search staff..." 
                        />
                    </div>

                    {/* Staff Table Card */}
                    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden transition-all duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Staff Member</th>
                                        <th className="px-6 py-4">Contact Details</th>
                                        <th className="px-6 py-4">Employment Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                                <p className="text-sm font-medium text-slate-400">Loading staff directory...</p>
                                            </div>
                                        </td></tr>
                                    ) : staffMembers.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-24">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon name="engineering" className="text-5xl text-slate-200 material-symbols-outlined" />
                                                <p className="text-slate-400 font-medium">No staff members found.</p>
                                            </div>
                                        </td></tr>
                                    ) : staffMembers.map((staff: any) => (
                                        <tr key={staff._id} className="hover:bg-slate-50/50 transition-all duration-200">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-11 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-border-light shadow-sm">
                                                        {staff.profileImage ? (
                                                            <img alt={staff.name} src={staff.profileImage} className="size-full object-cover" />
                                                        ) : (
                                                            <Icon name="engineering" className="text-slate-300 material-symbols-outlined" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 tracking-tight">{staff.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{staff.designation || 'Technical Staff'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-semibold text-slate-700">{staff.email}</p>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-wide">{staff.phone || 'NO CONTACT'}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getBadgeVariant(staff.status) === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {staff.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button 
                                                        onClick={() => handleOpenModal('edit', staff)} 
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                        title="Edit Details"
                                                    >
                                                        <Icon name="edit" className="material-symbols-outlined text-lg" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(staff._id)} 
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Remove Staff"
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
                        <div className="px-6 py-4 bg-slate-50 border-t border-border-light flex items-center justify-between text-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Staff: {staffMembers.length}</span>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg border border-border-light text-slate-300 hover:bg-white disabled:opacity-30" disabled>
                                    <Icon name="chevron_left" className="material-symbols-outlined" />
                                </button>
                                <button className="h-8 w-8 rounded-lg bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/20">1</button>
                                <button className="p-2 rounded-lg border border-border-light text-slate-300 hover:bg-white disabled:opacity-30" disabled>
                                    <Icon name="chevron_right" className="material-symbols-outlined" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Staff Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Register New Staff' : 'Modify Staff Credentials'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    {modalMode === 'add' && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
                            <input
                                required
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                placeholder="+91..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Staff Designation</label>
                            <input
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium"
                                placeholder="e.g., Housekeeper"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Availability Status</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-border-light bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">ACTIVE</option>
                            <option value="on leave">ON LEAVE</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-3 rounded-xl border border-border-light font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
                        >
                            {modalMode === 'add' ? 'Register Staff' : 'Apply Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
