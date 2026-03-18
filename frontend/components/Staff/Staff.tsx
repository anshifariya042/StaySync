"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import { useStaff, useAddStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/useStaff'

import Icon from '@/components/ui/Icon'
import AdminSidebar from '@/components/ui/AdminSidebar'
import AdminHeader from '@/components/ui/AdminHeader'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import Modal from '@/components/ui/Modal'

export default function Staff() {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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
            alert("Failed to save staff information.")
        }
    }

    const handleDelete = async (staffId: string) => {
        if (!window.confirm("Are you sure you want to remove this staff member?")) return
        try {
            await deleteStaffMutation.mutateAsync(staffId)
        } catch (error) {
            console.error("Error deleting staff:", error)
        }
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
                                className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0 flex items-center gap-2"
                            >
                                <Icon name="add" className="text-[20px]" />
                                <span className="hidden sm:inline">Add Staff</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </AdminHeader>

                    {/* Table Section */}
                    <section className="p-4 md:p-8 flex-1 overflow-y-auto pb-24 md:pb-8">
                        <div className="md:hidden mb-6">
                            <SearchInput 
                                value={searchTerm} 
                                onChange={setSearchTerm} 
                                placeholder="Search staff..." 
                            />
                        </div>

                        {/* Table Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Staff Member</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Contact Details</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Employment Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {loading ? (
                                            <tr><td colSpan={4} className="text-center py-20">
                                                <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                            </td></tr>
                                        ) : staffMembers.length === 0 ? (
                                            <tr><td colSpan={4} className="text-center py-20 text-slate-500 font-medium">No staff members found.</td></tr>
                                        ) : staffMembers.map((staff: any) => (
                                            <tr key={staff._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                                            {staff.profileImage ? (
                                                                <img alt={staff.name} src={staff.profileImage} className="size-full object-cover" />
                                                            ) : (
                                                                <Icon name="engineering" className="text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{staff.name}</p>
                                                            <p className="text-xs text-slate-500">{staff.designation || 'Technical Staff'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{staff.email}</p>
                                                    <p className="text-xs text-slate-500">{staff.phone || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={getBadgeVariant(staff.status)}>
                                                        {staff.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleOpenModal('edit', staff)} 
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                            title="Edit Details"
                                                        >
                                                            <Icon name="edit" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(staff._id)} 
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Remove Staff"
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
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/30">
                                <span className="text-slate-500 font-medium font-sans">Total Staff: {staffMembers.length}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30" disabled>
                                        <Icon name="chevron_left" />
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold shadow-sm">1</button>
                                    <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30" disabled>
                                        <Icon name="chevron_right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Staff Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Details'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            placeholder="e.g., Jane Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            placeholder="email@staysync.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    {modalMode === 'add' && (
                        <div>
                            <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Initial Password</label>
                            <input
                                required
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Phone</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="+91..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Role</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                placeholder="e.g., Warden"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Current Status</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="on leave">On Leave</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            {modalMode === 'add' ? 'Confirm Addition' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
