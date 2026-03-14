"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore as useAuth } from '@/store/useAuthStore'
import UserSidebar from '@/components/UserSidebar/UserSidebar'
import { useSubmitComplaint } from '@/hooks/useUserComplaints'
import { useProfile } from '@/hooks/useProfile'

// Helper for Material Symbols
const Icon = ({ name, className = "" }: { name: string, className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
)

export default function RaiseComplaint() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: fullUser, isLoading: profileLoading } = useProfile()
    const submitComplaintMutation = useSubmitComplaint()

    const [formData, setFormData] = useState({
        category: '',
        priority: 'Normal',
        title: '',
        description: '',
        images: [] as File[]
    })

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
        }
    }

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.title || !formData.description) {
            setStatus({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }

        setStatus(null);

        try {
            const data = new FormData();
            data.append('category', formData.category);
            data.append('priority', formData.priority);
            data.append('title', formData.title);
            data.append('description', formData.description);
            formData.images.forEach(image => {
                data.append('images', image);
            });
            
            // Check if user is actually in a hostel
            if (!fullUser?.hostelId) {
                setStatus({ type: 'error', message: 'You must be a resident of a hostel to raise a complaint. Please book a hostel first.' });
                return;
            }

            // The backend now handles extracting hostelId from the authenticated user
            await submitComplaintMutation.mutateAsync(data);

            setStatus({ type: 'success', message: 'Your complaint has been submitted successfully!' });
            
            setFormData({
                category: '',
                priority: 'Normal',
                title: '',
                description: '',
                images: []
            });

            setTimeout(() => {
                router.push('/user/dashboard');
            }, 2000);

        } catch (error: any) {
            console.error("Failed to submit complaint:", error);
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || error.message || 'Failed to submit complaint. Please try again.' 
            });
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            
            <div className="relative flex h-full w-full overflow-x-hidden">
                <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
                    {/* Top Header */}
                    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-400">
                                <Icon name="menu" />
                            </button>
                            <h2 className="text-lg font-bold">Raise a Complaint</h2>
                        </div>
                       
                    </header>

                    <div className="p-6 max-w-2xl mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Submit a request</h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Please provide details about your issue and we'll get back to you shortly.</p>
                        </div>

                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                            >
                                {status.message}
                            </motion.div>
                        )}

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Room Number</label>
                                    <input 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed px-4 py-3 outline-none" 
                                        readOnly 
                                        type="text" 
                                        value={fullUser?.roomId?.roomNumber ? `Room ${fullUser.roomId.roomNumber} - ${fullUser.roomId.type}` : "No Room Assigned"}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                        <select 
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                                        >
                                            <option value="">Select category</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Housekeeping">Housekeeping</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Wifi">Wifi</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                                        <select 
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Issue Title</label>
                                    <input 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400" 
                                        placeholder="Brief summary of the issue" 
                                        type="text"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400 resize-none" 
                                        placeholder="Describe the problem in detail..." 
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Evidence Photos</label>
                                    <input 
                                        type="file" 
                                        multiple 
                                        hidden 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                                    >
                                        <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform text-primary">
                                            <Icon name="cloud_upload" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {formData.images.length > 0 ? `${formData.images.length} file(s) selected` : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                                    </div>
                                </div>

                                <button 
                                    disabled={submitComplaintMutation.isPending}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" 
                                    type="submit"
                                >
                                    {submitComplaintMutation.isPending ? (
                                        <>
                                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        "Submit Complaint"
                                    )}
                                </button>
                            </form>
                        </div>

                        <footer className="mt-8 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                Typically responded to within <span className="font-semibold text-slate-700 dark:text-slate-300">2 hours</span>.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    )
}
